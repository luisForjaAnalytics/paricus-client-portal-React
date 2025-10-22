import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

// Initialize Prisma connection
export async function initializePrisma() {
  try {
    await prisma.$connect();
    console.log('✅ Prisma connected successfully');
  } catch (error) {
    console.error('❌ Failed to connect to Prisma:', error);
    throw error;
  }
}

// Gracefully shutdown Prisma
export async function disconnectPrisma() {
  await prisma.$disconnect();
}