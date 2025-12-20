import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function testEndpoint() {
  console.log('\n=== PRUEBA DE ENDPOINT /api/reports/client-folders ===\n');

  // 1. Generar token JWT
  const user = await prisma.user.findUnique({
    where: { email: 'admin@paricus.com' },
    include: {
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

  const token = jwt.sign(
    {
      userId: user.id,
      email: user.email
    },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );

  console.log('1. Token generado para:', user.email);
  console.log('   User ID:', user.id);
  console.log('   Permisos:', permissions.length);

  // 2. Hacer petición al endpoint
  console.log('\n2. Haciendo petición a http://localhost:3001/api/reports/client-folders');

  try {
    const response = await fetch('http://localhost:3001/api/reports/client-folders', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    console.log('   Status:', response.status);
    const data = await response.json();

    if (response.ok) {
      console.log('\n✅ RESPUESTA EXITOSA:');
      console.log('   Folders:', data.folders);
      console.log('   Total carpetas:', data.folders?.length || 0);
    } else {
      console.log('\n❌ ERROR EN RESPUESTA:');
      console.log('   Error:', data.error);
      console.log('   Mensaje:', data.message);
    }
  } catch (error) {
    console.log('\n❌ ERROR DE CONEXIÓN:');
    console.log('   ¿El backend está corriendo en puerto 3001?');
    console.log('   Error:', error.message);
  }

  console.log('\n');
  await prisma.$disconnect();
}

testEndpoint().catch(console.error);
