import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testTicketData() {
  try {
    console.log('🔍 Fetching tickets with details...\n');

    // Find all tickets and show which ones have details
    const allTickets = await prisma.ticket.findMany({
      include: {
        details: {
          orderBy: { timestamp: 'asc' },
        },
        attachments: true,
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    console.log(`📊 Total tickets: ${allTickets.length}`);
    console.log('Tickets with details:');
    allTickets.forEach(t => {
      console.log(`  - ${t.subject}: ${t.details.length} details`);
    });
    console.log('');

    // Find one with details
    const tickets = allTickets.filter(t => t.details.length > 0);

    if (tickets.length === 0) {
      console.log('⚠️  No tickets with details found. Showing first ticket instead.\n');
      const tickets = allTickets.slice(0, 1);
    }

    if (tickets.length === 0) {
      console.log('❌ No tickets found in database\n');
      return;
    }

    const ticket = tickets[0];

    console.log('✅ Ticket found:');
    console.log('ID:', ticket.id);
    console.log('Subject:', ticket.subject);
    console.log('Description (raw):', ticket.description);
    console.log('\nParsing description JSON...');

    try {
      const descriptionObj = JSON.parse(ticket.description);
      console.log('✅ Description parsed:', JSON.stringify(descriptionObj, null, 2));
    } catch (e) {
      console.log('❌ Failed to parse description:', e.message);
    }

    console.log('\n📋 Details count:', ticket.details?.length || 0);
    if (ticket.details && ticket.details.length > 0) {
      console.log('✅ Details:');
      ticket.details.forEach((detail, index) => {
        console.log(`  ${index + 1}. ID: ${detail.id}, Created: ${detail.timestamp}`);
        console.log(`     Data: ${detail.descriptionData.substring(0, 50)}...`);
      });
    } else {
      console.log('⚠️  No details found for this ticket');
    }

    console.log('\n📎 Attachments count:', ticket.attachments?.length || 0);

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testTicketData();
