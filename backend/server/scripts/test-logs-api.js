import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function testLogsAccess() {
  console.log('\n=== PRUEBA DE ACCESO A LOGS ===\n');

  // 1. Obtener usuario
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

  console.log('1. Usuario encontrado:');
  console.log('   Email:', user.email);
  console.log('   Cliente:', user.client?.name || 'NO TIENE');
  console.log('   Rol:', user.role?.roleName);

  // 2. Simular verificación del backend
  const isBPOAdmin = user?.client?.name === 'BPO Administration';
  console.log('\n2. Verificación de acceso:');
  console.log('   ¿Es BPO Admin?:', isBPOAdmin ? 'SÍ ✅' : 'NO ❌');

  if (!isBPOAdmin) {
    console.log('\n❌ ERROR: Usuario NO tiene acceso a logs');
    console.log('   Cliente actual:', user.client?.name || 'null');
    console.log('   Cliente requerido: BPO Administration');
  } else {
    // 3. Obtener logs
    const logs = await prisma.log.findMany({
      take: 10,
      orderBy: { timestamp: 'desc' }
    });

    console.log('\n3. Logs obtenidos:');
    console.log('   Total:', logs.length);
    if (logs.length > 0) {
      console.log('   Primer log:', logs[0].eventType, '-', logs[0].description);
    }
    console.log('\n✅ TODO OK - Usuario puede acceder a logs');
  }

  await prisma.$disconnect();
}

testLogsAccess().catch(console.error);
