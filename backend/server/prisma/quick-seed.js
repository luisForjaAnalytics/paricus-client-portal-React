import { PrismaClient } from '@prisma/client';
//import bcrypt from 'bcryptjs';

console.log("DATABASE_URL:", process.env.DATABASE_URL);
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
  log: ['error'],
});

async function main() {
  console.log('Quick seed - checking existing data...');

  // Check if users already exist
  const userCount = await prisma.user.count();
  if (userCount > 0) {
    console.log(`Database already has ${userCount} users. Skipping seed.`);
    console.log('\nYou can log in with existing credentials.');
    return;
  }

  console.log('Database is empty. Creating minimal seed data...');

  // Create data WITHOUT upserts to avoid locking
  // Permissions
  const permIds = {};
  const perms = [
    'view_dashboard', 'view_financials', 'download_invoices',
    'view_reporting', 'download_reports', 'view_interactions',
    'view_knowledge_base', 'admin_clients', 'admin_users',
    'admin_roles', 'admin_reports', 'admin_invoices',
    'view_invoices', 'pay_invoices'
  ];

  for (const perm of perms) {
    const p = await prisma.permission.create({
      data: { permissionName: perm, description: perm.replace(/_/g, ' ') }
    });
    permIds[perm] = p.id;
  }

  // BPO Client
  const bpoClient = await prisma.client.create({
    data: { id: 1, name: 'BPO Administration', isActive: true, isProspect: false }
  });

  // BPO Admin Role
  const bpoRole = await prisma.role.create({
    data: {
      clientId: bpoClient.id,
      roleName: 'BPO Admin',
      description: 'Full admin access'
    }
  });

  // Assign all permissions to BPO Admin
  for (const permId of Object.values(permIds)) {
    await prisma.rolePermission.create({
      data: { roleId: bpoRole.id, permissionId: permId }
    });
  }

  // BPO Admin User
  const hash = await bcrypt.hash('admin123!', 12);
  await prisma.user.create({
    data: {
      email: 'admin@paricus.com',
      passwordHash: hash,
      firstName: 'System',
      lastName: 'Administrator',
      clientId: bpoClient.id,
      roleId: bpoRole.id,
      isActive: true
    }
  });

  console.log('Quick seed complete!');
  console.log('\nLogin with: admin@paricus.com / admin123!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('Seed error:', e.message);
    await prisma.$disconnect();
    process.exit(1);
  });
