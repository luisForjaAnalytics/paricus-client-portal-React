/**
 * Migration Script: Rename descriptionData to detailData and add attachmentIds
 */

import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_PATH = path.join(__dirname, 'prisma', 'dev.db');

async function migrateDetailFields() {
  console.log('🚀 Starting TicketDetail field migration...\n');

  const db = new Database(DB_PATH);

  try {
    // Start transaction
    db.exec('BEGIN TRANSACTION');

    console.log('Step 1: Creating backup...');
    db.exec(`
      CREATE TABLE IF NOT EXISTS _migration_backup_ticket_details_v2 AS
      SELECT * FROM ticket_details;
    `);
    console.log('✅ Backup created\n');

    console.log('Step 2: Creating new table with updated schema...');
    db.exec(`
      CREATE TABLE "ticket_details_new" (
        "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
        "ticket_id" TEXT NOT NULL,
        "detail_data" TEXT NOT NULL,
        "attachment_ids" TEXT,
        "created_by" INTEGER,
        "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "ticket_details_ticket_id_fkey" FOREIGN KEY ("ticket_id") REFERENCES "tickets" ("id") ON DELETE CASCADE ON UPDATE CASCADE
      );
    `);
    console.log('✅ New table created\n');

    console.log('Step 3: Migrating data...');
    // Copy data: description_data → detail_data, add empty attachment_ids
    db.exec(`
      INSERT INTO ticket_details_new (id, ticket_id, detail_data, attachment_ids, created_by, timestamp)
      SELECT id, ticket_id, description_data, '[]', created_by, timestamp
      FROM ticket_details;
    `);

    const migrated = db.prepare('SELECT COUNT(*) as count FROM ticket_details_new').get();
    console.log(`✅ Migrated ${migrated.count} details\n`);

    console.log('Step 4: Dropping old table and renaming new one...');
    db.exec(`DROP TABLE ticket_details;`);
    db.exec(`ALTER TABLE ticket_details_new RENAME TO ticket_details;`);
    console.log('✅ Tables renamed\n');

    console.log('Step 5: Recreating indexes...');
    db.exec(`CREATE INDEX "ticket_details_ticket_id_idx" ON "ticket_details"("ticket_id");`);
    db.exec(`CREATE INDEX "ticket_details_timestamp_idx" ON "ticket_details"("timestamp");`);
    db.exec(`CREATE INDEX "ticket_details_created_by_idx" ON "ticket_details"("created_by");`);
    console.log('✅ Indexes created\n');

    // Commit transaction
    db.exec('COMMIT');

    console.log('✅ Migration completed successfully!\n');
    console.log('📊 Summary:');
    console.log(`   - Details migrated: ${migrated.count}`);
    console.log(`   - descriptionData → detailData`);
    console.log(`   - Added attachmentIds field (initialized as [])`);
    console.log(`   - Backup table: _migration_backup_ticket_details_v2\n`);

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
migrateDetailFields()
  .then(() => {
    console.log('✨ Migration script completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Migration script failed:', error);
    process.exit(1);
  });
