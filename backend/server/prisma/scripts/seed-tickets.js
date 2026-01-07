import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const ticketSubjects = [
  'Sistema de facturación no responde',
  'Error al procesar pagos con tarjeta',
  'Actualizar información de contacto',
  'Problema con el reporte mensual',
  'Solicitud de acceso a nuevos módulos',
  'Inconsistencia en datos de clientes',
  'Mejorar velocidad de carga del dashboard',
  'Error 500 en módulo de usuarios',
  'Solicitud de nueva funcionalidad',
  'Bug en el formulario de registro',
  'Integración con API externa',
  'Exportar datos a Excel falla',
  'Problemas de autenticación',
  'Actualizar permisos de usuario',
  'Error en cálculo de comisiones',
  'Página en blanco después de login',
  'Timeout en consultas pesadas',
  'Agregar filtros avanzados',
  'Correo de notificación no llega',
  'Cambiar diseño del header',
  'Error al subir archivos grandes',
  'Implementar búsqueda global',
  'Problema con zona horaria',
  'Mejorar sistema de reportes',
  'Error en validación de formularios',
  'Agregar soporte para móviles',
  'Optimizar queries de base de datos',
  'Implementar cache en el sistema',
  'Error al eliminar registros',
  'Agregar confirmación antes de eliminar',
  // 10 nuevos tickets
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
];

const descriptions = [
  '<p>El usuario reporta que el sistema no está respondiendo correctamente. Se requiere investigación urgente.</p>',
  '<p>Al intentar procesar pagos, el sistema arroja un error. Los clientes no pueden completar sus transacciones.</p>',
  '<p>Se solicita actualizar la información de contacto en el sistema. Incluye email y teléfono.</p>',
  '<p>El reporte mensual muestra datos inconsistentes. Necesita revisión de las queries.</p>',
  '<p>El cliente solicita acceso a los nuevos módulos de reportería avanzada.</p>',
  '<p>Se encontraron inconsistencias en los datos de clientes. Algunos registros están duplicados.</p>',
  '<p>El dashboard tarda mucho en cargar. Se necesita optimización de rendimiento.</p>',
  '<p>Error 500 en el módulo de gestión de usuarios. Revisar logs del servidor.</p>',
  '<p>Cliente solicita nueva funcionalidad para exportar reportes en PDF.</p>',
  '<p>El formulario de registro no valida correctamente los campos requeridos.</p>',
  '<p>Se necesita integración con la API de un proveedor externo para sincronizar datos.</p>',
  '<p>La función de exportar a Excel está fallando con archivos grandes.</p>',
  '<p>Usuarios reportan problemas intermitentes al intentar iniciar sesión.</p>',
  '<p>Se requiere actualizar los permisos de varios usuarios según nueva estructura.</p>',
  '<p>El cálculo de comisiones no está reflejando correctamente los descuentos.</p>',
  '<p>Después de hacer login, algunos usuarios ven una página en blanco.</p>',
  '<p>Las consultas de reportes están generando timeouts por exceso de datos.</p>',
  '<p>Cliente solicita implementar filtros avanzados en el módulo de búsqueda.</p>',
  '<p>Los correos de notificación no están llegando a los destinatarios.</p>',
  '<p>Solicitud de rediseño del header para mejorar la experiencia de usuario.</p>',
  '<p>El sistema arroja error al intentar subir archivos mayores a 10MB.</p>',
  '<p>Implementar una búsqueda global que funcione en todos los módulos.</p>',
  '<p>Los timestamps están mostrando zona horaria incorrecta.</p>',
  '<p>El sistema de reportes necesita mejoras en velocidad y funcionalidad.</p>',
  '<p>Las validaciones de formularios no están funcionando correctamente en algunos campos.</p>',
  '<p>La interfaz necesita ser responsive para uso en dispositivos móviles.</p>',
  '<p>Optimizar las queries de base de datos que están causando lentitud.</p>',
  '<p>Implementar sistema de cache para mejorar rendimiento general.</p>',
  '<p>Error al intentar eliminar registros relacionados con otras tablas.</p>',
  '<p>Agregar modal de confirmación antes de eliminar registros importantes.</p>',
  // 10 nuevas descripciones
  '<p>Los gráficos del dashboard no se visualizan correctamente en Chrome. Se ven pixelados y algunos no cargan. Revisar librerías de charts.</p>',
  '<p>Por seguridad, se solicita implementar autenticación de dos factores (2FA) para todos los usuarios del sistema.</p>',
  '<p>La sincronización automática con el CRM está fallando. Los datos de clientes no se actualizan desde hace 48 horas.</p>',
  '<p>Varios usuarios solicitan la opción de exportar reportes en formato CSV además del actual PDF y Excel.</p>',
  '<p>Usuarios con rol "Viewer" están viendo reportes a los que no deberían tener acceso. Revisar sistema de permisos.</p>',
  '<p>La interfaz actual de gestión de tickets es confusa. Se solicita rediseño basado en mejores prácticas de UX.</p>',
  '<p>Al actualizar nombre o email en el perfil, los cambios no se guardan correctamente. Error en el endpoint PUT /profile.</p>',
  '<p>Implementar sistema de notificaciones push para alertar a los usuarios sobre actualizaciones importantes en sus tickets.</p>',
  '<p>La búsqueda de clientes tarda más de 10 segundos cuando hay más de 1000 registros. Necesita indexación y optimización.</p>',
  '<p>Agregar un historial completo de cambios en los tickets: quién modificó qué y cuándo. Incluir log de cambios de estado, prioridad y asignaciones.</p>',
];

const priorities = ['High', 'Medium', 'Low'];
const statuses = ['Open', 'In Progress', 'Resolved', 'Closed'];

async function createTickets() {
  try {
    console.log('Starting ticket creation...');

    // Get all users
    const users = await prisma.user.findMany({
      include: { client: true },
    });

    if (users.length === 0) {
      console.error('No users found. Please run seed first.');
      return;
    }

    console.log(`Found ${users.length} users`);

    // Create 40 tickets (30 originales + 10 nuevos)
    for (let i = 0; i < 40; i++) {
      const randomUser = users[Math.floor(Math.random() * users.length)];
      const randomPriority = priorities[Math.floor(Math.random() * priorities.length)];
      const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];

      // Create description JSON
      const descriptionJson = JSON.stringify({
        descriptionData: descriptions[i],
        attachmentIds: [], // Changed from attachmentId to attachmentIds (array)
        url: null,
      });

      const ticket = await prisma.ticket.create({
        data: {
          clientId: randomUser.clientId,
          userId: randomUser.id,
          subject: ticketSubjects[i],
          priority: randomPriority,
          status: randomStatus,
          assignedTo: Math.random() > 0.5 ? 'Support Team' : null,
          description: descriptionJson,
        },
        include: {
          details: true,
          user: true,
        },
      });

      console.log(`✓ Created ticket ${i + 1}/40: "${ticket.subject}"`);

      // Add random number of additional details (0-3)
      const additionalDetails = Math.floor(Math.random() * 4);
      for (let j = 0; j < additionalDetails; j++) {
        await prisma.ticketDetail.create({
          data: {
            ticketId: ticket.id,
            detailData: `<p>Actualización ${j + 1}: Se está trabajando en este ticket. Status actual: ${randomStatus}</p>`,
          },
        });
        console.log(`  + Added detail ${j + 1} to ticket ${i + 1}`);
      }
    }

    console.log('\n✅ Successfully created 40 tickets with details!');
  } catch (error) {
    console.error('Error creating tickets:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createTickets();
