import { GraphQLSchema } from 'graphql';
import { extendGraphqlSchema } from '@keystone-6/core';
import { Context } from '.keystone/types';

// Custom GraphQL resolvers for advanced functionality
export const extendedSchema = extendGraphqlSchema({
  typeDefs: `
    type Query {
      searchTools(query: String!, limit: Int = 20): [Tool!]!
      popularTools(limit: Int = 10): [Tool!]!
      toolsByCategory(categoryId: ID!, limit: Int = 20): [Tool!]!
      toolStats: ToolStats!
      healthCheck: HealthCheckResult!
    }

    type Mutation {
      trackToolUsage(toolId: ID!, sessionId: String): ToolUsage
      submitToolReview(toolId: ID!, rating: Int!, title: String, content: String): Review
      verifyToolStatus(toolId: ID!): ToolStatusCheck!
      importLegacyData: ImportResult!
    }

    type ToolStats {
      totalTools: Int!
      totalCategories: Int!
      totalUsers: Int!
      totalReviews: Int!
      averageRating: Float!
      mostPopularCategory: Category
      recentlyAddedTools: [Tool!]!
    }

    type HealthCheckResult {
      status: String!
      timestamp: String!
      version: String!
      database: String!
    }

    type ToolStatusCheck {
      tool: Tool!
      isAccessible: Boolean!
      responseTime: Int
      statusCode: Int
      lastChecked: String!
    }

    type ImportResult {
      success: Boolean!
      imported: Int!
      errors: [String!]!
    }
  `,
  resolvers: {
    Query: {
      searchTools: async (root, { query, limit }, context: Context) => {
        // Full-text search across tools
        return await context.query.Tool.findMany({
          where: {
            OR: [
              { name: { contains: query, mode: 'insensitive' } },
              { description: { contains: query, mode: 'insensitive' } },
              { tags: { some: { name: { contains: query, mode: 'insensitive' } } } },
              { categories: { some: { name: { contains: query, mode: 'insensitive' } } } },
            ],
            status: { equals: 'active' },
          },
          take: limit,
          orderBy: [
            { isFeatured: 'desc' },
            { usageCount: 'desc' },
            { rating: 'desc' },
          ],
        });
      },

      popularTools: async (root, { limit }, context: Context) => {
        return await context.query.Tool.findMany({
          where: { status: { equals: 'active' } },
          take: limit,
          orderBy: [
            { usageCount: 'desc' },
            { rating: 'desc' },
          ],
        });
      },

      toolsByCategory: async (root, { categoryId, limit }, context: Context) => {
        return await context.query.Tool.findMany({
          where: {
            categories: { some: { id: { equals: categoryId } } },
            status: { equals: 'active' },
          },
          take: limit,
          orderBy: [
            { isFeatured: 'desc' },
            { sortOrder: 'asc' },
            { name: 'asc' },
          ],
        });
      },

      toolStats: async (root, args, context: Context) => {
        const [
          totalTools,
          totalCategories,
          totalUsers,
          totalReviews,
          avgRating,
          recentTools,
        ] = await Promise.all([
          context.query.Tool.count({ where: { status: { equals: 'active' } } }),
          context.query.Category.count({ where: { isActive: { equals: true } } }),
          context.query.User.count({ where: { isActive: { equals: true } } }),
          context.query.Review.count(),
          context.prisma.review.aggregate({
            _avg: { rating: true },
          }),
          context.query.Tool.findMany({
            where: { status: { equals: 'active' } },
            take: 5,
            orderBy: { createdAt: 'desc' },
          }),
        ]);

        return {
          totalTools,
          totalCategories,
          totalUsers,
          totalReviews,
          averageRating: avgRating._avg.rating || 0,
          recentlyAddedTools: recentTools,
        };
      },

      healthCheck: async (root, args, context: Context) => {
        try {
          // Test database connection
          await context.prisma.$queryRaw`SELECT 1`;
          
          return {
            status: 'healthy',
            timestamp: new Date().toISOString(),
            version: '1.0.0',
            database: 'connected',
          };
        } catch (error) {
          return {
            status: 'unhealthy',
            timestamp: new Date().toISOString(),
            version: '1.0.0',
            database: 'disconnected',
          };
        }
      },
    },

    Mutation: {
      trackToolUsage: async (root, { toolId, sessionId }, context: Context) => {
        // Track tool usage for analytics
        const usage = await context.query.ToolUsage.createOne({
          data: {
            tool: { connect: { id: toolId } },
            user: context.session?.itemId ? { connect: { id: context.session.itemId } } : undefined,
            sessionId: sessionId || 'anonymous',
            timestamp: new Date().toISOString(),
          },
        });

        // Increment usage count on tool
        await context.query.Tool.updateOne({
          where: { id: toolId },
          data: {
            usageCount: { increment: 1 },
          },
        });

        return usage;
      },

      submitToolReview: async (root, { toolId, rating, title, content }, context: Context) => {
        if (!context.session?.itemId) {
          throw new Error('You must be logged in to submit a review');
        }

        // Check if user already reviewed this tool
        const existingReview = await context.query.Review.findMany({
          where: {
            tool: { id: { equals: toolId } },
            user: { id: { equals: context.session.itemId } },
          },
        });

        if (existingReview.length > 0) {
          throw new Error('You have already reviewed this tool');
        }

        const review = await context.query.Review.createOne({
          data: {
            tool: { connect: { id: toolId } },
            user: { connect: { id: context.session.itemId } },
            rating,
            title,
            content,
          },
        });

        // Update tool's average rating
        await updateToolRating(context, toolId);

        return review;
      },

      verifyToolStatus: async (root, { toolId }, context: Context) => {
        const tool = await context.query.Tool.findOne({
          where: { id: toolId },
        });

        if (!tool) {
          throw new Error('Tool not found');
        }

        try {
          const startTime = Date.now();
          const response = await fetch(tool.url, {
            method: 'HEAD',
            timeout: 10000,
          });
          const responseTime = Date.now() - startTime;

          const isAccessible = response.ok;
          const statusCode = response.status;

          // Update tool status
          await context.query.Tool.updateOne({
            where: { id: toolId },
            data: {
              lastChecked: new Date().toISOString(),
              status: isAccessible ? 'active' : 'inactive',
            },
          });

          return {
            tool,
            isAccessible,
            responseTime,
            statusCode,
            lastChecked: new Date().toISOString(),
          };
        } catch (error) {
          await context.query.Tool.updateOne({
            where: { id: toolId },
            data: {
              lastChecked: new Date().toISOString(),
              status: 'inactive',
            },
          });

          return {
            tool,
            isAccessible: false,
            responseTime: null,
            statusCode: null,
            lastChecked: new Date().toISOString(),
          };
        }
      },

      importLegacyData: async (root, args, context: Context) => {
        // This would trigger the seed script or similar import logic
        // For now, return a placeholder
        return {
          success: true,
          imported: 0,
          errors: ['Import functionality not yet implemented'],
        };
      },
    },
  },
});

// Helper function to update tool rating
async function updateToolRating(context: Context, toolId: string) {
  const reviews = await context.query.Review.findMany({
    where: { tool: { id: { equals: toolId } } },
  });

  if (reviews.length > 0) {
    const avgRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
    
    await context.query.Tool.updateOne({
      where: { id: toolId },
      data: {
        rating: Math.round(avgRating * 10) / 10, // Round to 1 decimal place
      },
    });
  }
}
