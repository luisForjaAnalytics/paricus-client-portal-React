/**
 * Migration Script: Restructure Ticket Description to Details
 *
 * This script migrates the ticket structure:
 * 1. Adds a `description` JSON field to tickets
 * 2. Renames `descriptions` relation to `details`
 * 3. Renames `TicketDescription` table to `TicketDetail`
 * 4. Migrates existing data from ticket_descriptions to:
 *    - First description → ticket.description (JSON)
 *    - Rest of descriptions → ticket_details
 */

import { PrismaClient } from '@prisma/client';
import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_PATH = path.join(__dirname, 'prisma', 'dev.db');

async function migrateTicketStructure() {
  console.log('🚀 Starting ticket structure migration...\n');

  const db = new Database(DB_PATH);

  try {
    // Start transaction
    db.exec('BEGIN TRANSACTION');

    console.log('Step 1: Creating backup of existing data...');
    db.exec(`
      CREATE TABLE IF NOT EXISTS _migration_backup_tickets AS
      SELECT * FROM tickets;
    `);
    db.exec(`
      CREATE TABLE IF NOT EXISTS _migration_backup_ticket_descriptions AS
      SELECT * FROM ticket_descriptions;
    `);
    db.exec(`
      CREATE TABLE IF NOT EXISTS _migration_backup_ticket_attachments AS
      SELECT * FROM ticket_attachments;
    `);
    console.log('✅ Backup created\n');

    console.log('Step 2: Creating new ticket_details table...');
    db.exec(`
      CREATE TABLE "ticket_details" (
        "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
        "ticket_id" TEXT NOT NULL,
        "description_data" TEXT NOT NULL,
        "created_by" INTEGER,
        "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "ticket_details_ticket_id_fkey" FOREIGN KEY ("ticket_id") REFERENCES "tickets" ("id") ON DELETE CASCADE ON UPDATE CASCADE
      );
    `);
    console.log('✅ ticket_details table created\n');

    console.log('Step 3: Adding indexes to ticket_details...');
    db.exec(`CREATE INDEX "ticket_details_ticket_id_idx" ON "ticket_details"("ticket_id");`);
    db.exec(`CREATE INDEX "ticket_details_timestamp_idx" ON "ticket_details"("timestamp");`);
    db.exec(`CREATE INDEX "ticket_details_created_by_idx" ON "ticket_details"("created_by");`);
    console.log('✅ Indexes created\n');

    console.log('Step 4: Adding description column to tickets...');
    db.exec(`ALTER TABLE tickets ADD COLUMN description TEXT;`);
    console.log('✅ Description column added\n');

    console.log('Step 5: Migrating data from ticket_descriptions...');

    // Get all tickets with their descriptions
    const tickets = db.prepare(`
      SELECT t.id, t.user_id, t.created_at,
             td.id as desc_id, td.description_data, td.timestamp,
             ROW_NUMBER() OVER (PARTITION BY t.id ORDER BY td.timestamp ASC) as row_num
      FROM tickets t
      LEFT JOIN ticket_descriptions td ON td.ticket_id = t.id
      ORDER BY t.id, td.timestamp ASC
    `).all();

    const ticketsMap = {};

    // Group descriptions by ticket
    for (const row of tickets) {
      if (!ticketsMap[row.id]) {
        ticketsMap[row.id] = {
          userId: row.user_id,
          createdAt: row.created_at,
          descriptions: []
        };
      }

      if (row.desc_id) {
        ticketsMap[row.id].descriptions.push({
          id: row.desc_id,
          descriptionData: row.description_data,
          timestamp: row.timestamp,
          rowNum: row.row_num
        });
      }
    }

    // Process each ticket
    const updateTicket = db.prepare(`UPDATE tickets SET description = ? WHERE id = ?`);
    const insertDetail = db.prepare(`
      INSERT INTO ticket_details (ticket_id, description_data, created_by, timestamp)
      VALUES (?, ?, ?, ?)
    `);

    let ticketsProcessed = 0;
    let detailsCreated = 0;

    for (const [ticketId, data] of Object.entries(ticketsMap)) {
      if (data.descriptions.length === 0) {
        // No descriptions, create empty JSON
        const descriptionJson = JSON.stringify({
          descriptionData: '',
          createdAt: data.createdAt,
          createdBy: data.userId,
          attachmentIds: []
        });
        updateTicket.run(descriptionJson, ticketId);
      } else {
        // First description goes to ticket.description
        const firstDesc = data.descriptions[0];
        const descriptionJson = JSON.stringify({
          descriptionData: firstDesc.descriptionData,
          createdAt: firstDesc.timestamp,
          createdBy: data.userId,
          attachmentIds: []
        });
        updateTicket.run(descriptionJson, ticketId);

        // Rest go to ticket_details
        for (let i = 1; i < data.descriptions.length; i++) {
          const desc = data.descriptions[i];
          insertDetail.run(
            ticketId,
            desc.descriptionData,
            data.userId,
            desc.timestamp
          );
          detailsCreated++;
        }
      }
      ticketsProcessed++;
    }

    console.log(`✅ Migrated ${ticketsProcessed} tickets and created ${detailsCreated} details\n`);

    console.log('Step 6: Updating ticket_attachments table...');
    db.exec(`
      CREATE TABLE "ticket_attachments_new" (
        "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
        "ticket_id" TEXT NOT NULL,
        "detail_id" INTEGER,
        "file_name" TEXT NOT NULL,
        "s3_key" TEXT NOT NULL,
        "s3_bucket" TEXT NOT NULL,
        "file_size" INTEGER,
        "mime_type" TEXT NOT NULL,
        "uploaded_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "uploaded_by" INTEGER,
        CONSTRAINT "ticket_attachments_ticket_id_fkey" FOREIGN KEY ("ticket_id") REFERENCES "tickets" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT "ticket_attachments_detail_id_fkey" FOREIGN KEY ("detail_id") REFERENCES "ticket_details" ("id") ON DELETE SET NULL ON UPDATE CASCADE
      );
    `);

    // Copy data
    db.exec(`
      INSERT INTO ticket_attachments_new (id, ticket_id, file_name, s3_key, s3_bucket, file_size, mime_type, uploaded_at)
      SELECT id, ticket_id, file_name, s3_key, s3_bucket, file_size, mime_type, uploaded_at
      FROM ticket_attachments;
    `);

    // Drop old table and rename
    db.exec(`DROP TABLE ticket_attachments;`);
    db.exec(`ALTER TABLE ticket_attachments_new RENAME TO ticket_attachments;`);

    // Create indexes
    db.exec(`CREATE INDEX "ticket_attachments_ticket_id_idx" ON "ticket_attachments"("ticket_id");`);
    db.exec(`CREATE INDEX "ticket_attachments_detail_id_idx" ON "ticket_attachments"("detail_id");`);
    db.exec(`CREATE INDEX "ticket_attachments_uploaded_at_idx" ON "ticket_attachments"("uploaded_at");`);
    db.exec(`CREATE INDEX "ticket_attachments_uploaded_by_idx" ON "ticket_attachments"("uploaded_by");`);

    console.log('✅ ticket_attachments table updated\n');

    console.log('Step 7: Dropping old ticket_descriptions table...');
    db.exec(`DROP TABLE ticket_descriptions;`);
    console.log('✅ Old table dropped\n');

    // Commit transaction
    db.exec('COMMIT');

    console.log('✅ Migration completed successfully!\n');
    console.log('📊 Summary:');
    console.log(`   - Tickets processed: ${ticketsProcessed}`);
    console.log(`   - Details created: ${detailsCreated}`);
    console.log(`   - Backup tables created: _migration_backup_*`);
    console.log('\n💡 You can drop backup tables after verification:');
    console.log('   DROP TABLE _migration_backup_tickets;');
    console.log('   DROP TABLE _migration_backup_ticket_descriptions;');
    console.log('   DROP TABLE _migration_backup_ticket_attachments;\n');

  } catch (error) {
    // Rollback on error
    db.exec('ROLLBACK');
    console.error('❌ Migration failed:', error);
    console.error('\n⚠️  Database rolled back to previous state');
    throw error;
  } finally {
    db.close();
  }
}

// Run migration
migrateTicketStructure()
  .then(() => {
    console.log('✨ Migration script completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Migration script failed:', error);
    process.exit(1);
  });
