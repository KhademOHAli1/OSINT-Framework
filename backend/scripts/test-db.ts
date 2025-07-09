import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testData() {
  console.log('Testing basic data...');

  try {
    // Test categories
    const categories = await prisma.category.findMany();
    console.log('Categories:', categories.length);

    // Test tools  
    const tools = await prisma.tool.findMany();
    console.log('Tools:', tools.length);

    // Test users
    const users = await prisma.user.findMany();
    console.log('Users:', users.length);

    console.log('✅ Basic data test completed!');
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testData();
