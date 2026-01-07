import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // Get all users with their roles and clients
  const users = await prisma.user.findMany({
    include: {
      client: true,
      role: true
    },
    where: {
      isActive: true
    },
    orderBy: [
      { clientId: 'asc' },
      { email: 'asc' }
    ]
  });

  console.log('=== USERS ===');
  users.forEach(u => {
    console.log(`ID: ${u.id}, Email: ${u.email}, Client: ${u.client?.name || 'BPO'}, Role: ${u.role?.roleName || 'N/A'}`);
  });

  // Get tickets with no assignee
  const unassignedTickets = await prisma.ticket.findMany({
    where: {
      assignedToId: null
    }
  });

  console.log(`\n=== UNASSIGNED TICKETS: ${unassignedTickets.length} ===`);
  unassignedTickets.forEach(t => {
    console.log(`ID: ${t.id}, Subject: ${t.subject}`);
  });

  // Delete unassigned tickets
  if (unassignedTickets.length > 0) {
    await prisma.ticket.deleteMany({
      where: {
        assignedToId: null
      }
    });
    console.log(`\n✓ Deleted ${unassignedTickets.length} unassigned tickets`);
  }

  await prisma.$disconnect();
}

main().catch(e => {
  console.error(e);
  prisma.$disconnect();
  process.exit(1);
});
