import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkTorchWireless() {
  console.log('Checking Torch Wireless setup...\n');

  try {
    // Find Torch Wireless client
    const client = await prisma.client.findFirst({
      where: {
        name: {
          contains: 'Torch',
          mode: 'insensitive'
        }
      }
    });

    if (!client) {
      console.log('ERROR: Torch Wireless client not found in database');
      return;
    }

    console.log(`Found client: ${client.name} (ID: ${client.id})`);

    // Check if folder access exists
    const folderAccess = await prisma.clientFolderAccess.findFirst({
      where: {
        clientId: client.id
      }
    });

    if (!folderAccess) {
      console.log('MISSING: No ClientFolderAccess record found');
      console.log('Creating ClientFolderAccess for torch-wireless...');

      const newAccess = await prisma.clientFolderAccess.create({
        data: {
          clientId: client.id,
          folderName: 'torch-wireless'
        }
      });

      console.log('SUCCESS: Created ClientFolderAccess:', newAccess);
    } else {
      console.log(`Folder Access exists: ${folderAccess.folderName}`);
    }

    // Check invoices
    const invoiceCount = await prisma.invoice.count({
      where: {
        clientId: client.id
      }
    });

    console.log(`\nInvoices in database: ${invoiceCount}`);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkTorchWireless();