import { list } from '@keystone-6/core';
import { allowAll } from '@keystone-6/core/access';
import {
  text,
  relationship,
  password,
  timestamp,
  select,
  integer,
  json,
  checkbox,
} from '@keystone-6/core/fields';
import { document } from '@keystone-6/fields-document';

export const lists = {
  // User management
  User: list({
    access: allowAll,
    fields: {
      name: text({ validation: { isRequired: true } }),
      email: text({
        validation: { isRequired: true },
        isIndexed: 'unique',
      }),
      password: password({ validation: { isRequired: true } }),
      role: select({
        options: [
          { label: 'Admin', value: 'admin' },
          { label: 'Editor', value: 'editor' },
          { label: 'Contributor', value: 'contributor' },
          { label: 'User', value: 'user' },
        ],
        defaultValue: 'user',
        ui: {
          displayMode: 'segmented-control',
        },
      }),
      isActive: checkbox({ defaultValue: true }),
      lastLogin: timestamp(),
      createdAt: timestamp({
        defaultValue: { kind: 'now' },
      }),
    },
  }),

  // OSINT Tool Categories
  Category: list({
    access: allowAll,
    fields: {
      name: text({ validation: { isRequired: true } }),
      slug: text({
        validation: { isRequired: true },
        isIndexed: 'unique',
      }),
      description: text({ ui: { displayMode: 'textarea' } }),
      color: text(),
      icon: text(),
      parentCategory: relationship({
        ref: 'Category.subCategories',
        many: false,
      }),
      subCategories: relationship({
        ref: 'Category.parentCategory',
        many: true,
      }),
      tools: relationship({
        ref: 'Tool.categories',
        many: true,
      }),
      sortOrder: integer({ defaultValue: 0 }),
      isActive: checkbox({ defaultValue: true }),
      createdAt: timestamp({
        defaultValue: { kind: 'now' },
      }),
    },
  }),

  // OSINT Tools
  Tool: list({
    access: allowAll,
    fields: {
      name: text({ validation: { isRequired: true } }),
      slug: text({
        validation: { isRequired: true },
        isIndexed: 'unique',
      }),
      description: text({ ui: { displayMode: 'textarea' } }),
      longDescription: document({
        formatting: true,
        layouts: [
          [1, 1],
          [1, 1, 1],
          [2, 1],
        ],
        links: true,
        dividers: true,
      }),
      url: text({ validation: { isRequired: true } }),
      alternativeUrls: json({
        defaultValue: [],
      }),
      categories: relationship({
        ref: 'Category.tools',
        many: true,
      }),
      tags: relationship({
        ref: 'Tag.tools',
        many: true,
      }),
      type: select({
        options: [
          { label: 'Website', value: 'website' },
          { label: 'Software', value: 'software' },
          { label: 'Browser Extension', value: 'extension' },
          { label: 'Mobile App', value: 'mobile' },
          { label: 'API', value: 'api' },
          { label: 'Database', value: 'database' },
          { label: 'Search Engine', value: 'search' },
        ],
        defaultValue: 'website',
      }),
      status: select({
        options: [
          { label: 'Active', value: 'active' },
          { label: 'Inactive', value: 'inactive' },
          { label: 'Deprecated', value: 'deprecated' },
          { label: 'Under Review', value: 'review' },
        ],
        defaultValue: 'active',
      }),
      isPaid: checkbox({ defaultValue: false }),
      requiresRegistration: checkbox({ defaultValue: false }),
      supportedRegions: json({
        defaultValue: [],
      }),
      rating: integer({
        validation: {
          min: 1,
          max: 50, // 1-50 scale (equivalent to 0.1-5.0)
        },
        defaultValue: 25, // equivalent to 2.5 stars
      }),
      usageCount: integer({ defaultValue: 0 }),
      lastChecked: timestamp(),
      lastUpdated: timestamp(),
      submittedBy: relationship({
        ref: 'User',
        many: false,
      }),
      reviews: relationship({
        ref: 'Review.tool',
        many: true,
      }),
      metadata: json({
        defaultValue: {},
      }),
      sortOrder: integer({ defaultValue: 0 }),
      isFeatured: checkbox({ defaultValue: false }),
      isVerified: checkbox({ defaultValue: false }),
      createdAt: timestamp({
        defaultValue: { kind: 'now' },
      }),
    },
  }),

  // Tags for tools
  Tag: list({
    access: allowAll,
    fields: {
      name: text({ validation: { isRequired: true } }),
      slug: text({
        validation: { isRequired: true },
        isIndexed: 'unique',
      }),
      description: text({ ui: { displayMode: 'textarea' } }),
      color: text(),
      tools: relationship({
        ref: 'Tool.tags',
        many: true,
      }),
      usageCount: integer({ defaultValue: 0 }),
      createdAt: timestamp({
        defaultValue: { kind: 'now' },
      }),
    },
  }),

  // Tool Reviews and Ratings
  Review: list({
    access: allowAll,
    fields: {
      tool: relationship({
        ref: 'Tool.reviews',
        many: false,
      }),
      user: relationship({
        ref: 'User',
        many: false,
      }),
      rating: integer({
        validation: {
          min: 1,
          max: 5,
          isRequired: true,
        },
      }),
      title: text(),
      content: text({ ui: { displayMode: 'textarea' } }),
      isVerified: checkbox({ defaultValue: false }),
      isHelpful: integer({ defaultValue: 0 }),
      createdAt: timestamp({
        defaultValue: { kind: 'now' },
      }),
      updatedAt: timestamp({
        defaultValue: { kind: 'now' },
        db: { updatedAt: true },
      }),
    },
  }),

  // Analytics and Usage Tracking
  ToolUsage: list({
    access: allowAll,
    fields: {
      tool: relationship({
        ref: 'Tool',
        many: false,
      }),
      user: relationship({
        ref: 'User',
        many: false,
      }),
      ipAddress: text(),
      userAgent: text(),
      referrer: text(),
      sessionId: text(),
      timestamp: timestamp({
        defaultValue: { kind: 'now' },
      }),
    },
  }),

  // Search Analytics
  SearchQuery: list({
    access: allowAll,
    fields: {
      query: text({ validation: { isRequired: true } }),
      resultsCount: integer({ defaultValue: 0 }),
      user: relationship({
        ref: 'User',
        many: false,
      }),
      ipAddress: text(),
      timestamp: timestamp({
        defaultValue: { kind: 'now' },
      }),
    },
  }),

  // Collections/Playlists
  Collection: list({
    access: allowAll,
    fields: {
      name: text({ validation: { isRequired: true } }),
      slug: text({
        validation: { isRequired: true },
        isIndexed: 'unique',
      }),
      description: text({ ui: { displayMode: 'textarea' } }),
      tools: relationship({
        ref: 'Tool',
        many: true,
      }),
      user: relationship({
        ref: 'User',
        many: false,
      }),
      isPublic: checkbox({ defaultValue: false }),
      tags: relationship({
        ref: 'Tag',
        many: true,
      }),
      createdAt: timestamp({
        defaultValue: { kind: 'now' },
      }),
      updatedAt: timestamp({
        defaultValue: { kind: 'now' },
        db: { updatedAt: true },
      }),
    },
  }),

  // News and Updates
  NewsItem: list({
    access: allowAll,
    fields: {
      title: text({ validation: { isRequired: true } }),
      slug: text({
        validation: { isRequired: true },
        isIndexed: 'unique',
      }),
      summary: text({ ui: { displayMode: 'textarea' } }),
      content: document({
        formatting: true,
        layouts: [
          [1, 1],
          [1, 1, 1],
          [2, 1],
        ],
        links: true,
        dividers: true,
      }),
      author: relationship({
        ref: 'User',
        many: false,
      }),
      category: select({
        options: [
          { label: 'Tool Update', value: 'tool_update' },
          { label: 'New Tool', value: 'new_tool' },
          { label: 'Security Alert', value: 'security' },
          { label: 'Framework Update', value: 'framework' },
          { label: 'Community', value: 'community' },
        ],
        defaultValue: 'framework',
      }),
      relatedTools: relationship({
        ref: 'Tool',
        many: true,
      }),
      isPublished: checkbox({ defaultValue: false }),
      publishedAt: timestamp(),
      createdAt: timestamp({
        defaultValue: { kind: 'now' },
      }),
      updatedAt: timestamp({
        defaultValue: { kind: 'now' },
        db: { updatedAt: true },
      }),
    },
  }),
};
