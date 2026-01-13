import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function cleanKnowledgeBase() {
  try {
    console.log('🗑️  Deleting all articles from knowledge base table...');

    const result = await prisma.knowledgeBase.deleteMany({});

    console.log(`✅ Deleted ${result.count} articles from local database`);
    console.log('📝 Note: Articles will now come from external API only');
  } catch (error) {
    console.error('❌ Error cleaning knowledge base:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

cleanKnowledgeBase();
