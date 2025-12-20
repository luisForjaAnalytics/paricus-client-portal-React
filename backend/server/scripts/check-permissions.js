import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkPermissions() {
  const user = await prisma.user.findUnique({
    where: { email: 'admin@paricus.com' },
    include: {
      client: true,
      role: {
        include: {
          rolePermissions: {
            include: {
              permission: true
            }
          }
        }
      }
    }
  });

  console.log('\n=== VERIFICACIÓN DE PERMISOS ===');
  console.log('Email:', user.email);
  console.log('Cliente:', user.client?.name);
  console.log('Rol:', user.role?.roleName);
  console.log('\nPermisos:');
  const permissions = user.role?.rolePermissions.map(rp => rp.permission.permissionName) || [];
  permissions.forEach(p => console.log('  -', p));

  console.log('\n¿Tiene admin_reports?', permissions.includes('admin_reports') ? '✅ SÍ' : '❌ NO');
  console.log('================================\n');

  await prisma.$disconnect();
}

checkPermissions().catch(console.error);
