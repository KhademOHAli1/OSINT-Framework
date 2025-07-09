import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedData() {
  console.log('Starting data seeding...');

  try {
    // Create or get a sample category
    const category = await prisma.category.upsert({
      where: { slug: 'search-engines' },
      update: {},
      create: {
        name: 'Search Engines',
        description: 'General search engines for OSINT research',
        slug: 'search-engines',
      },
    });

    console.log('Found/Created category:', category.name);

    // Create or get a sample tool
    const tool = await prisma.tool.upsert({
      where: { slug: 'google' },
      update: {},
      create: {
        name: 'Google',
        slug: 'google',
        description: 'The world\'s most popular search engine',
        url: 'https://www.google.com',
        categories: { connect: { id: category.id } },
        type: 'website',
        status: 'active',
      },
    });

    console.log('Found/Created tool:', tool.name);

    // Create or get a sample article
    const article = await prisma.article.upsert({
      where: { slug: 'introduction-to-osint' },
      update: {},
      create: {
        title: 'Introduction to OSINT',
        content: [{ type: 'paragraph', children: [{ text: 'Open Source Intelligence (OSINT) is intelligence collected from publicly available sources.' }] }],
        slug: 'introduction-to-osint',
        isPublished: true,
        summary: 'Learn the basics of OSINT methodology',
        estimatedReadTime: 5,
      },
    });

    console.log('Found/Created article:', article.title);

    console.log('✅ Data seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error seeding data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedData();
