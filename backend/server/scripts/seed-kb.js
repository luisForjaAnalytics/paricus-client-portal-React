import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedKnowledgeBase() {
  try {
    // Create sample knowledge base articles
    const articles = [
      {
        title: 'Getting Started with Customer Service',
        content: 'This article covers the basics of customer service best practices...',
        category: 'Training',
        isPublic: true,
        isActive: true,
        viewCount: 45,
        clientId: null, // Public article
      },
      {
        title: 'How to Handle Escalations',
        content: 'Step-by-step guide for handling customer escalations effectively...',
        category: 'Procedures',
        isPublic: true,
        isActive: true,
        viewCount: 32,
        clientId: null,
      },
      {
        title: 'Call Center Quality Standards',
        content: 'Quality assurance standards and metrics for call center operations...',
        category: 'Quality',
        isPublic: true,
        isActive: true,
        viewCount: 28,
        clientId: null,
      },
    ];

    for (const article of articles) {
      await prisma.knowledgeBase.create({
        data: article,
      });
      console.log(`✅ Created article: ${article.title}`);
    }

    console.log('\n✅ Successfully seeded knowledge base with 3 articles');
  } catch (error) {
    console.error('❌ Error seeding knowledge base:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

seedKnowledgeBase();
