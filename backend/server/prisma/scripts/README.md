# Prisma Scripts

This folder contains utility scripts for database operations, data seeding, and testing.

## 📋 Available Scripts

### `seed-tickets.js` - Data Seeding
**Purpose**: Create test tickets in Spanish

**Usage**:
```bash
npm run script:seed-tickets
```

**What it does**:
- Creates test tickets with Spanish subjects and descriptions
- Useful for testing purposes

**⚠️ WARNING**: Only run in NEW environments - creates duplicates if tickets exist

---

### `checkTickets.js` - Maintenance
**Purpose**: Verify ticket integrity and cleanup

**Usage**:
```bash
npm run script:check-tickets
```

**What it does**:
- Lists users with roles/clients
- Finds and deletes orphaned tickets (no assignee)
- Provides integrity report

---

### `test-add-detail.js` - API Testing
**Purpose**: Test ticket detail creation endpoint

**Usage**:
```bash
npm run script:test-add-detail
```

**What it does**:
- Tests login + authentication
- Tests POST `/api/tickets/:id/details`
- Verifies detail creation

---

### `test-ticket-data.js` - Data Inspection
**Purpose**: Inspect database structure

**Usage**:
```bash
npm run script:test-ticket-data
```

**What it does**:
- Fetches all tickets with relations
- Shows structure and counts

---

## 🗑️ Scripts Removed (No Longer Needed)

- ❌ `create50Tickets.js` - Tickets already in database
- ❌ `migrate-attachmentId-to-array.js` - Migration completed
- ❌ `verify-new-tickets.js` - Obsolete hardcoded checks

---

## 📝 Quick Reference

| Command | Purpose | When to Use |
|---------|---------|-------------|
| `npm run script:seed-tickets` | Create test data | New setup only |
| `npm run script:check-tickets` | Clean DB | Maintenance |
| `npm run script:test-add-detail` | Test API | After changes |
| `npm run script:test-ticket-data` | Inspect data | Debugging |

---

## ⚙️ Workflow

**Fresh Setup:**
```bash
npx prisma migrate reset
npx prisma db seed
npm run script:seed-tickets  # Optional
npm run script:check-tickets  # Verify
```

**Testing:**
```bash
npm run script:test-add-detail
npm run script:test-ticket-data
```

---

## 🔒 Safety

1. **Backup first**: `cp prisma/dev.db prisma/dev.db.backup`
2. **Development only**: Never run in production
3. **Review output**: Check console for errors
