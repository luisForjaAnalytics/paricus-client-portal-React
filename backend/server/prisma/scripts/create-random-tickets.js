import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Ticket data templates
const titles = [
  'System Performance Issues',
  'Login Authentication Error',
  'Database Connection Timeout',
  'API Response Delay',
  'Email Notification Not Working',
  'File Upload Failure',
  'Report Generation Error',
  'Dashboard Loading Slowly',
  'User Permission Issue',
  'Payment Processing Failed',
  'Mobile App Crash',
  'Search Functionality Bug',
  'Data Export Issue',
  'Session Timeout Problem',
  'Integration API Error',
  'UI Layout Breaking',
  'Password Reset Not Working',
  'Notification Settings Bug',
  'Chart Display Error',
  'Invoice Generation Failed',
];

const categories = ['Technical', 'Billing', 'Account', 'Support', 'Sales'];
const priorities = ['Low', 'Medium', 'High', 'Urgent'];
const statuses = ['Open', 'In Progress', 'Resolved', 'Closed'];

const descriptionTemplates = [
  'Users are experiencing issues with {feature}. The problem started {timeframe} and affects {impact}.',
  'Unable to {action} due to {error}. This is causing {impact} for our team.',
  '{feature} is not working as expected. Users report {symptom} when trying to {action}.',
  'Critical issue with {feature}. System shows {error} and {impact}.',
  'Need assistance with {feature}. Current behavior: {symptom}. Expected: {action}.',
];

const features = [
  'user authentication',
  'data synchronization',
  'report generation',
  'payment processing',
  'file uploads',
  'email notifications',
  'dashboard analytics',
  'API integration',
  'mobile interface',
  'user permissions',
];

const timeframes = [
  'this morning',
  'yesterday',
  'over the weekend',
  'since the last update',
  'in the past hour',
  '2 days ago',
];

const impacts = [
  'multiple users',
  'all departments',
  'critical operations',
  'client-facing services',
  'internal processes',
  'daily workflows',
];

const errors = [
  'timeout errors',
  'connection failures',
  '500 server errors',
  'validation errors',
  'authentication failures',
  'database errors',
];

const symptoms = [
  'slow loading times',
  'error messages',
  'unexpected behavior',
  'missing data',
  'incorrect calculations',
  'UI glitches',
];

const actions = [
  'complete transactions',
  'access reports',
  'upload files',
  'save changes',
  'generate invoices',
  'export data',
];

function getRandomElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function generateDescription() {
  const template = getRandomElement(descriptionTemplates);
  return template
    .replace('{feature}', getRandomElement(features))
    .replace('{timeframe}', getRandomElement(timeframes))
    .replace('{impact}', getRandomElement(impacts))
    .replace('{error}', getRandomElement(errors))
    .replace('{symptom}', getRandomElement(symptoms))
    .replace('{action}', getRandomElement(actions));
}

function getRandomDate(daysBack) {
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * daysBack));
  date.setHours(Math.floor(Math.random() * 24));
  date.setMinutes(Math.floor(Math.random() * 60));
  return date;
}

async function createRandomTickets() {
  try {
    console.log('🎫 Creating 20 random tickets...\n');

    // Get all clients with their users
    const clients = await prisma.client.findMany({
      where: { isActive: true },
      include: {
        users: true,
      },
    });

    if (clients.length === 0) {
      console.error('❌ No active clients found. Please run seed first.');
      return;
    }

    console.log(`📋 Found ${clients.length} active clients\n`);

    const tickets = [];

    for (let i = 0; i < 20; i++) {
      const client = getRandomElement(clients);

      // Get a user from this client
      if (!client.users || client.users.length === 0) {
        console.warn(`⚠️  Skipping client ${client.name} - no users found`);
        continue;
      }

      const user = getRandomElement(client.users);
      const title = getRandomElement(titles);
      const category = getRandomElement(categories);
      const priority = getRandomElement(priorities);
      const status = getRandomElement(statuses);
      const createdAt = getRandomDate(30); // Within last 30 days

      const description = {
        type: 'doc',
        content: [
          {
            type: 'paragraph',
            content: [
              {
                type: 'text',
                text: generateDescription(),
              },
            ],
          },
          {
            type: 'paragraph',
            content: [
              {
                type: 'text',
                text: '\n',
              },
            ],
          },
          {
            type: 'paragraph',
            content: [
              {
                type: 'text',
                text: 'Steps to reproduce:',
                marks: [{ type: 'bold' }],
              },
            ],
          },
          {
            type: 'bulletList',
            content: [
              {
                type: 'listItem',
                content: [
                  {
                    type: 'paragraph',
                    content: [
                      {
                        type: 'text',
                        text: `Navigate to ${getRandomElement(features)}`,
                      },
                    ],
                  },
                ],
              },
              {
                type: 'listItem',
                content: [
                  {
                    type: 'paragraph',
                    content: [
                      {
                        type: 'text',
                        text: `Attempt to ${getRandomElement(actions)}`,
                      },
                    ],
                  },
                ],
              },
              {
                type: 'listItem',
                content: [
                  {
                    type: 'paragraph',
                    content: [
                      {
                        type: 'text',
                        text: `Observe ${getRandomElement(symptoms)}`,
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      };

      const ticket = await prisma.ticket.create({
        data: {
          subject: title,
          description: JSON.stringify(description),
          priority,
          status,
          clientId: client.id,
          userId: user.id,
          createdAt,
          updatedAt: createdAt,
        },
      });

      tickets.push(ticket);

      console.log(`✅ Ticket ${i + 1}/20: "${title}" (${priority} - ${status}) for ${client.name}`);
    }

    console.log(`\n✅ Successfully created ${tickets.length} tickets!\n`);

    // Show summary by client
    console.log('📊 Summary by client:');
    for (const client of clients) {
      const count = tickets.filter((t) => t.clientId === client.id).length;
      if (count > 0) {
        console.log(`   ${client.name}: ${count} tickets`);
      }
    }

    // Show summary by status
    console.log('\n📊 Summary by status:');
    for (const status of statuses) {
      const count = tickets.filter((t) => t.status === status).length;
      if (count > 0) {
        console.log(`   ${status}: ${count} tickets`);
      }
    }

    // Show summary by priority
    console.log('\n📊 Summary by priority:');
    for (const priority of priorities) {
      const count = tickets.filter((t) => t.priority === priority).length;
      if (count > 0) {
        console.log(`   ${priority}: ${count} tickets`);
      }
    }

  } catch (error) {
    console.error('❌ Error creating tickets:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
createRandomTickets()
  .then(() => {
    console.log('\n✨ Done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Script failed:', error);
    process.exit(1);
  });
