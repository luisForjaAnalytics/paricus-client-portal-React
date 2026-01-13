import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function listAllArticles() {
  try {
    const allArticles = await prisma.knowledgeBase.findMany({
      orderBy: { createdAt: 'desc' },
    });

    console.log('📚 ALL Knowledge Base Articles:\n');
    console.log(`Total: ${allArticles.length} articles\n`);

    allArticles.forEach((article, index) => {
      console.log(`${index + 1}. ID: ${article.id}`);
      console.log(`   Title: ${article.title}`);
      console.log(`   Category: ${article.category || 'N/A'}`);
      console.log(`   Is Active: ${article.isActive}`);
      console.log(`   Is Public: ${article.isPublic}`);
      console.log(`   Client ID: ${article.clientId || 'Public'}`);
      console.log(`   Views: ${article.viewCount || 0}`);
      console.log(`   Created: ${article.createdAt}`);
      console.log('');
    });
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

listAllArticles();
