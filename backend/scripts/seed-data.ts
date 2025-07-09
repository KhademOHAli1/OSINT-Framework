import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedData() {
  console.log('Starting data seeding...');

  try {
    // Create a sample category
    const category = await prisma.category.create({
      data: {
        name: 'Search Engines',
        description: 'General search engines for OSINT research',
        slug: 'search-engines',
      },
    });

    console.log('Created category:', category.name);

    // Create a sample tool
    const tool = await prisma.tool.create({
      data: {
        name: 'Google',
        slug: 'google',
        description: 'The world\'s most popular search engine',
        url: 'https://www.google.com',
        categories: { connect: { id: category.id } },
        type: 'website',
        status: 'active',
      },
    });

    console.log('Created tool:', tool.name);

    // Create a sample article
    const article = await prisma.article.create({
      data: {
        title: 'Introduction to OSINT',
        content: [{ type: 'paragraph', children: [{ text: 'Open Source Intelligence (OSINT) is intelligence collected from publicly available sources.' }] }],
        slug: 'introduction-to-osint',
        isPublished: true,
        summary: 'Learn the basics of OSINT methodology',
        estimatedReadTime: 5,
      },
    });

    console.log('Created article:', article.title);

    console.log('✅ Data seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error seeding data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedData();
