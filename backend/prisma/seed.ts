import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

interface LegacyTool {
  name: string;
  type?: string;
  url?: string;
  children?: LegacyTool[];
}

function createSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

async function importLegacyData() {
  try {
    // Read the existing data.json from frontend
    const dataPath = path.join(__dirname, '../../frontend/public/data.json');
    const legacyData: LegacyTool = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

    console.log('Starting data migration...');

    // Create admin user if it doesn't exist
    const adminUser = await prisma.user.upsert({
      where: { email: 'admin@osintframework.com' },
      update: {},
      create: {
        name: 'Admin User',
        email: 'admin@osintframework.com',
        password: 'admin123', // Change this in production
        role: 'admin',
        isActive: true,
      },
    });

    console.log('Admin user created/updated');

    // Function to recursively process the tree structure
    async function processNode(
      node: LegacyTool,
      parentCategory?: any,
      level = 0
    ): Promise<void> {
      console.log(`Processing: ${node.name} (level: ${level})`);

      if (node.children && node.children.length > 0) {
        // This is a category
        const category = await prisma.category.upsert({
          where: { slug: createSlug(node.name) },
          update: {
            name: node.name,
            description: `OSINT category: ${node.name}`,
            sortOrder: level,
          },
          create: {
            name: node.name,
            slug: createSlug(node.name),
            description: `OSINT category: ${node.name}`,
            color: getColorForLevel(level),
            icon: getIconForCategory(node.name),
            parentCategory: parentCategory ? { connect: { id: parentCategory.id } } : undefined,
            sortOrder: level,
            isActive: true,
          },
        });

        // Process children
        for (const child of node.children) {
          await processNode(child, category, level + 1);
        }
      } else if (node.url) {
        // This is a tool
        const categories = parentCategory ? [parentCategory.id] : [];
        
        const tool = await prisma.tool.upsert({
          where: { slug: createSlug(node.name) },
          update: {
            name: node.name,
            url: node.url,
            description: `OSINT tool: ${node.name}`,
          },
          create: {
            name: node.name,
            slug: createSlug(node.name),
            description: `OSINT tool: ${node.name}`,
            url: node.url,
            type: determineToolType(node.url),
            status: 'active',
            isPaid: false,
            requiresRegistration: false,
            categories: categories.length > 0 ? {
              connect: categories.map(id => ({ id }))
            } : undefined,
            rating: Math.floor(Math.random() * 2) + 4, // Random rating between 4-5
            usageCount: Math.floor(Math.random() * 1000),
            isVerified: true,
            submittedBy: { connect: { id: adminUser.id } },
          },
        });

        // Create some sample tags
        await createTagsForTool(tool, node.name, parentCategory?.name);
      }
    }

    // Start processing from root
    if (legacyData.children) {
      for (const child of legacyData.children) {
        await processNode(child);
      }
    }

    console.log('Data migration completed successfully!');

    // Create some sample news items
    await createSampleNews(adminUser);

    console.log('Sample news items created!');

  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  }
}

function getColorForLevel(level: number): string {
  const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];
  return colors[level % colors.length];
}

function getIconForCategory(name: string): string {
  const iconMap: Record<string, string> = {
    'Search Engines': '🔍',
    'Social Networks': '👥',
    'Images': '🖼️',
    'Videos': '🎥',
    'Documents': '📄',
    'Email': '📧',
    'Phone Numbers': '📞',
    'Username': '👤',
    'Dating': '💕',
    'Domain/IP Lookup': '🌐',
    'Business Records': '🏢',
    'Government Records': '🏛️',
    'Archives': '📚',
    'Threat Intelligence': '🛡️',
  };
  return iconMap[name] || '🔧';
}

function determineToolType(url: string): string {
  if (url.includes('github.com')) return 'software';
  if (url.includes('chrome.google.com') || url.includes('addons.mozilla.org')) return 'extension';
  if (url.includes('play.google.com') || url.includes('apps.apple.com')) return 'mobile';
  if (url.includes('api') || url.includes('/docs')) return 'api';
  return 'website';
}

async function createTagsForTool(tool: any, toolName: string, categoryName?: string) {
  const tags = [];
  
  // Add category-based tags
  if (categoryName) {
    tags.push(categoryName.toLowerCase().replace(/\s+/g, '-'));
  }
  
  // Add some common OSINT tags
  const commonTags = ['osint', 'investigation', 'research', 'intelligence'];
  const randomTag = commonTags[Math.floor(Math.random() * commonTags.length)];
  tags.push(randomTag);

  for (const tagName of tags) {
    const tag = await prisma.tag.upsert({
      where: { slug: tagName },
      update: {
        usageCount: { increment: 1 },
      },
      create: {
        name: tagName.charAt(0).toUpperCase() + tagName.slice(1).replace(/-/g, ' '),
        slug: tagName,
        description: `Tag for ${tagName} related tools`,
        color: getColorForLevel(Math.floor(Math.random() * 6)),
        usageCount: 1,
      },
    });

    // Connect tag to tool
    await prisma.tool.update({
      where: { id: tool.id },
      data: {
        tags: {
          connect: { id: tag.id },
        },
      },
    });
  }
}

async function createSampleNews(adminUser: any) {
  const newsItems = [
    {
      title: 'OSINT Framework 2.0 Released',
      slug: 'osint-framework-2-0-released',
      summary: 'Major update with Vue 3, TypeScript, and improved mobile experience',
      category: 'framework',
    },
    {
      title: 'New Social Media Investigation Tools Added',
      slug: 'new-social-media-tools',
      summary: 'Latest tools for investigating social media platforms',
      category: 'new_tool',
    },
    {
      title: 'Security Best Practices for OSINT Investigators',
      slug: 'security-best-practices',
      summary: 'Important security considerations when conducting OSINT research',
      category: 'security',
    },
  ];

  for (const item of newsItems) {
    await prisma.newsItem.upsert({
      where: { slug: item.slug },
      update: {},
      create: {
        title: item.title,
        slug: item.slug,
        summary: item.summary,
        content: JSON.stringify([
          {
            type: 'paragraph',
            children: [{ text: item.summary }],
          },
        ]),
        author: { connect: { id: adminUser.id } },
        category: item.category,
        isPublished: true,
        publishedAt: new Date(),
      },
    });
  }
}

// Run the migration
importLegacyData()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
