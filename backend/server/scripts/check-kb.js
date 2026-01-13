import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkKnowledgeBase() {
  try {
    const articles = await prisma.knowledgeBase.findMany({
      where: { isActive: true },
    });

    console.log('✅ Total articles found:', articles.length);
    console.log('\nArticles:');
    articles.forEach(article => {
      console.log(`- ID: ${article.id}, Title: ${article.title}, Category: ${article.category}`);
    });
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkKnowledgeBase();
