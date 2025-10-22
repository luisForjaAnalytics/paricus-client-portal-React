import { PrismaClient } from '@prisma/client';
import { listClientFolders, listClientInvoices } from '../services/s3.js';

const prisma = new PrismaClient();

async function migrateInvoices() {
  console.log('Starting invoice migration from S3 to database...\n');

  try {
    // Get all client folders from S3
    const folders = await listClientFolders();
    console.log(`Found ${folders.length} client folders in S3\n`);

    for (const folderName of folders) {
      console.log(`\nProcessing folder: ${folderName}`);

      // Get client by folder access
      const folderAccess = await prisma.clientFolderAccess.findFirst({
        where: { folderName }
      });

      if (!folderAccess) {
        console.log(`   WARNING: No client found for folder ${folderName}, skipping...`);
        continue;
      }

      console.log(`   Found client ID: ${folderAccess.clientId}`);

      // Get invoices from S3 (this still uses the old S3 metadata approach)
      const s3Invoices = await listClientInvoices(folderName);
      console.log(`   Found ${s3Invoices.length} invoices in S3`);

      for (const s3Invoice of s3Invoices) {
        // Check if invoice already exists in database
        const existing = await prisma.invoice.findFirst({
          where: { s3Key: s3Invoice.key }
        });

        if (existing) {
          console.log(`   SKIP: Invoice ${s3Invoice.fileName} already exists`);
          continue;
        }

        // Create database record
        const invoiceNumber = `INV-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
        const now = new Date();

        const invoice = await prisma.invoice.create({
          data: {
            clientId: folderAccess.clientId,
            invoiceNumber: invoiceNumber,
            title: s3Invoice.fileName.replace('.pdf', ''),
            amount: 0, // Default
            currency: 'USD',
            status: 'sent',
            dueDate: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
            issuedDate: s3Invoice.lastModified || now,
            s3Key: s3Invoice.key,
            s3Bucket: process.env.S3_BUCKET_NAME || 'paricus-reports',
            fileSize: s3Invoice.size,
            mimeType: 'application/pdf',
            paymentLink: s3Invoice.paymentLink || null
          }
        });

        console.log(`   SUCCESS: Created invoice ${invoice.invoiceNumber} (${s3Invoice.fileName})`);
      }
    }

    console.log('\nMigration completed successfully!\n');
  } catch (error) {
    console.error('\nMigration failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run migration
migrateInvoices()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });