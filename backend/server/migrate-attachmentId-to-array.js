import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function migrateAttachmentIds() {
  try {
    console.log('🔄 Starting migration of attachmentId to attachmentIds array...\n');

    // Get all tickets
    const tickets = await prisma.ticket.findMany();
    console.log(`📊 Found ${tickets.length} tickets to migrate\n`);

    let migratedCount = 0;
    let alreadyMigratedCount = 0;
    let errorCount = 0;

    for (const ticket of tickets) {
      try {
        // Parse existing description
        const description = JSON.parse(ticket.description);

        // Check if already migrated
        if (description.hasOwnProperty('attachmentIds')) {
          console.log(`✅ Ticket ${ticket.id} already migrated`);
          alreadyMigratedCount++;
          continue;
        }

        // Migrate: convert attachmentId to attachmentIds array
        const newDescription = {
          descriptionData: description.descriptionData || '',
          attachmentIds: description.attachmentId
            ? [description.attachmentId]  // If there was an ID, put it in array
            : [],  // Otherwise empty array
          url: description.url || null,
        };

        // Update ticket
        await prisma.ticket.update({
          where: { id: ticket.id },
          data: {
            description: JSON.stringify(newDescription),
          },
        });

        console.log(`✅ Migrated ticket ${ticket.id}: attachmentId=${description.attachmentId} -> attachmentIds=[${newDescription.attachmentIds.join(', ')}]`);
        migratedCount++;
      } catch (error) {
        console.error(`❌ Error migrating ticket ${ticket.id}:`, error.message);
        errorCount++;
      }
    }

    console.log('\n📈 Migration Summary:');
    console.log(`   ✅ Successfully migrated: ${migratedCount}`);
    console.log(`   ⏭️  Already migrated: ${alreadyMigratedCount}`);
    console.log(`   ❌ Errors: ${errorCount}`);
    console.log('\n✅ Migration complete!');

  } catch (error) {
    console.error('❌ Migration failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

migrateAttachmentIds();
