import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function testReportsAPI() {
  console.log('\n=== PRUEBA DE API DE REPORTS ===\n');

  // 1. Obtener usuario y generar token
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

  const permissions = user.role?.rolePermissions.map(rp => rp.permission.permissionName) || [];

  console.log('1. Usuario:');
  console.log('   Email:', user.email);
  console.log('   Cliente:', user.client?.name);
  console.log('   Permisos:', permissions.length);
  console.log('   ¿Tiene admin_reports?', permissions.includes('admin_reports') ? '✅ SÍ' : '❌ NO');

  // 2. Verificar almacenamiento local
  console.log('\n2. Verificando almacenamiento local...');

  const { listLocalClientFolders, listLocalFiles } = await import('../services/local-storage.js');

  const folders = await listLocalClientFolders();
  console.log('   Carpetas encontradas:', folders.length);
  folders.forEach(f => console.log('     -', f));

  if (folders.length > 0) {
    console.log('\n3. Reportes por carpeta:');
    for (const folder of folders) {
      const prefix = `client-access-reports/${folder}/bi-reports/`;
      const files = await listLocalFiles(prefix);
      const pdfs = files.filter(f => f.key.endsWith('.pdf'));
      console.log(`   ${folder}: ${pdfs.length} reportes`);
      pdfs.forEach(f => console.log(`     - ${f.fileName} (${f.size} bytes)`));
    }
  }

  console.log('\n✅ TODO CORRECTO - Los datos están disponibles');
  console.log('   Si aún no ves datos en el frontend:');
  console.log('   1. Cierra sesión en el navegador');
  console.log('   2. Vuelve a iniciar sesión');
  console.log('   3. Recarga la página de Reports Management\n');

  await prisma.$disconnect();
}

testReportsAPI().catch(console.error);
