import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkAdmin() {
  const user = await prisma.user.findUnique({
    where: { email: 'admin@paricus.com' },
    include: {
      client: true,
      role: true
    }
  });

  console.log('\n=== VERIFICACIÓN DE USUARIO ADMIN ===');
  console.log('Email:', user.email);
  console.log('Cliente ID:', user.clientId);
  console.log('Cliente Nombre:', user.client?.name || 'NO TIENE CLIENTE');
  console.log('Rol:', user.role?.roleName);
  console.log('');

  if (user.client?.name === 'BPO Administration') {
    console.log('✅ PUEDE ACCEDER A LOGS');
  } else {
    console.log('❌ NO PUEDE ACCEDER A LOGS');
    console.log('   Se requiere: Cliente = "BPO Administration"');
  }
  console.log('=====================================\n');

  await prisma.$disconnect();
}

checkAdmin().catch(console.error);
