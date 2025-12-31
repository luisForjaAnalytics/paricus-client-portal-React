import { PrismaClient } from '@prisma/client';

// SQLite-optimized configuration
export const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development'
    ? ['warn', 'error']
    : ['error'],
  // Connection pool settings for better SQLite handling
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

// Optimize SQLite for better concurrent writes
prisma.$queryRawUnsafe('PRAGMA journal_mode = WAL').catch(() => {
  console.log('⚠️  WAL mode not available, using default journal mode');
});
prisma.$queryRawUnsafe('PRAGMA busy_timeout = 5000').catch(() => {});
prisma.$queryRawUnsafe('PRAGMA synchronous = NORMAL').catch(() => {});

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