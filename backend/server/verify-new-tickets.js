import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function verifyNewTickets() {
  try {
    console.log('🔍 Verificando tickets nuevos...\n');

    // Get the new tickets
    const newTickets = await prisma.ticket.findMany({
      where: {
        subject: {
          in: [
            'Dashboard no muestra gráficos correctamente',
            'Implementar autenticación de dos factores',
            'Error en sincronización de datos con CRM',
            'Agregar función de exportar a CSV',
            'Problema con permisos de acceso a reportes',
            'Mejorar interfaz de gestión de tickets',
            'Error al actualizar información del perfil',
            'Implementar notificaciones push',
            'Problema de rendimiento en búsqueda de clientes',
            'Agregar historial de cambios en tickets',
          ],
        },
      },
      include: {
        details: true,
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        client: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    console.log(`📊 Total de tickets nuevos encontrados: ${newTickets.length}\n`);

    // Get total count
    const totalTickets = await prisma.ticket.count();
    console.log(`📊 Total de tickets en la base de datos: ${totalTickets}\n`);

    console.log('✅ Primeros 5 tickets nuevos:\n');
    newTickets.slice(0, 5).forEach((ticket, index) => {
      console.log(`${index + 1}. ${ticket.subject}`);
      console.log(`   Cliente: ${ticket.client.name}`);
      console.log(`   Usuario: ${ticket.user.firstName} ${ticket.user.lastName}`);
      console.log(`   Prioridad: ${ticket.priority} | Estado: ${ticket.status}`);
      console.log(`   Detalles: ${ticket.details.length}`);

      // Parse and show description
      try {
        const desc = JSON.parse(ticket.description);
        const shortDesc = desc.descriptionData.replace(/<[^>]*>/g, '').substring(0, 80);
        console.log(`   Descripción: ${shortDesc}...`);
      } catch (e) {
        console.log(`   Descripción: Error al parsear`);
      }

      console.log('');
    });

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

verifyNewTickets();
