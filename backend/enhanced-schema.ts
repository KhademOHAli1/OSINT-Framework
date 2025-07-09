import { list } from '@keystone-6/core';
import { allowAll } from '@keystone-6/core/access';
import {
  text,
  relationship,
  timestamp,
  select,
  integer,
  json,
  checkbox,
  image,
  file,
} from '@keystone-6/core/fields';
import { document } from '@keystone-6/fields-document';

// Enhanced content management lists
export const contentLists = {
  // Blog/Article system for tools and guides
  Article: list({
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
          { label: 'Tutorial', value: 'tutorial' },
          { label: 'Guide', value: 'guide' },
          { label: 'Tool Review', value: 'review' },
          { label: 'News', value: 'news' },
          { label: 'Case Study', value: 'case-study' },
          { label: 'Methodology', value: 'methodology' },
        ],
        defaultValue: 'guide',
      }),
      relatedTools: relationship({
        ref: 'Tool',
        many: true,
      }),
      relatedArticles: relationship({
        ref: 'Article',
        many: true,
      }),
      tags: relationship({
        ref: 'ContentTag.articles',
        many: true,
      }),
      featuredImage: image({ storage: 'local_images' }),
      gallery: json({
        defaultValue: [],
      }),
      metadata: json({
        defaultValue: {},
      }),
      difficultyLevel: select({
        options: [
          { label: 'Beginner', value: 'beginner' },
          { label: 'Intermediate', value: 'intermediate' },
          { label: 'Advanced', value: 'advanced' },
          { label: 'Expert', value: 'expert' },
        ],
        defaultValue: 'beginner',
      }),
      estimatedReadTime: integer({ 
        ui: { description: 'Estimated reading time in minutes' },
        defaultValue: 5,
      }),
      isPublished: checkbox({ defaultValue: false }),
      isFeatured: checkbox({ defaultValue: false }),
      publishedAt: timestamp(),
      lastReviewed: timestamp(),
      viewCount: integer({ defaultValue: 0 }),
      likeCount: integer({ defaultValue: 0 }),
      createdAt: timestamp({
        defaultValue: { kind: 'now' },
      }),
      updatedAt: timestamp({
        defaultValue: { kind: 'now' },
        db: { updatedAt: true },
      }),
    },
  }),

  // Enhanced Tool documentation with rich content
  ToolGuide: list({
    access: allowAll,
    fields: {
      tool: relationship({
        ref: 'Tool.guides',
        many: false,
      }),
      title: text({ validation: { isRequired: true } }),
      type: select({
        options: [
          { label: 'Getting Started', value: 'getting-started' },
          { label: 'Advanced Usage', value: 'advanced' },
          { label: 'API Documentation', value: 'api' },
          { label: 'Troubleshooting', value: 'troubleshooting' },
          { label: 'Best Practices', value: 'best-practices' },
          { label: 'Use Cases', value: 'use-cases' },
        ],
        defaultValue: 'getting-started',
      }),
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
      prerequisites: text({ ui: { displayMode: 'textarea' } }),
      learningObjectives: json({
        defaultValue: [],
      }),
      screenshots: json({
        defaultValue: [],
      }),
      videoUrl: text(),
      codeExamples: json({
        defaultValue: [],
      }),
      difficultyLevel: select({
        options: [
          { label: 'Beginner', value: 'beginner' },
          { label: 'Intermediate', value: 'intermediate' },
          { label: 'Advanced', value: 'advanced' },
        ],
        defaultValue: 'beginner',
      }),
      estimatedTime: integer({
        ui: { description: 'Estimated completion time in minutes' },
        defaultValue: 15,
      }),
      isPublished: checkbox({ defaultValue: false }),
      lastUpdated: timestamp(),
      viewCount: integer({ defaultValue: 0 }),
      helpfulCount: integer({ defaultValue: 0 }),
      createdAt: timestamp({
        defaultValue: { kind: 'now' },
      }),
    },
  }),

  // Media management for rich content
  MediaFile: list({
    access: allowAll,
    fields: {
      name: text({ validation: { isRequired: true } }),
      description: text(),
      file: file({ storage: 'local_files' }),
      type: select({
        options: [
          { label: 'Image', value: 'image' },
          { label: 'Video', value: 'video' },
          { label: 'Document', value: 'document' },
          { label: 'Archive', value: 'archive' },
        ],
        defaultValue: 'image',
      }),
      alt: text({ ui: { description: 'Alt text for accessibility' } }),
      tags: relationship({
        ref: 'ContentTag.media',
        many: true,
      }),
      uploadedBy: relationship({
        ref: 'User',
        many: false,
      }),
      fileSize: integer(),
      mimeType: text(),
      isPublic: checkbox({ defaultValue: true }),
      createdAt: timestamp({
        defaultValue: { kind: 'now' },
      }),
    },
  }),

  // Content tagging system
  ContentTag: list({
    access: allowAll,
    fields: {
      name: text({ validation: { isRequired: true } }),
      slug: text({
        validation: { isRequired: true },
        isIndexed: 'unique',
      }),
      description: text(),
      color: text(),
      articles: relationship({
        ref: 'Article.tags',
        many: true,
      }),
      media: relationship({
        ref: 'MediaFile.tags',
        many: true,
      }),
      usageCount: integer({ defaultValue: 0 }),
      createdAt: timestamp({
        defaultValue: { kind: 'now' },
      }),
    },
  }),

  // Learning paths and curricula
  LearningPath: list({
    access: allowAll,
    fields: {
      title: text({ validation: { isRequired: true } }),
      slug: text({
        validation: { isRequired: true },
        isIndexed: 'unique',
      }),
      description: text({ ui: { displayMode: 'textarea' } }),
      content: document({
        formatting: true,
        links: true,
        dividers: true,
      }),
      creator: relationship({
        ref: 'User',
        many: false,
      }),
      difficulty: select({
        options: [
          { label: 'Beginner', value: 'beginner' },
          { label: 'Intermediate', value: 'intermediate' },
          { label: 'Advanced', value: 'advanced' },
        ],
        defaultValue: 'beginner',
      }),
      estimatedDuration: integer({
        ui: { description: 'Estimated completion time in hours' },
        defaultValue: 10,
      }),
      tools: relationship({
        ref: 'Tool',
        many: true,
      }),
      articles: relationship({
        ref: 'Article',
        many: true,
      }),
      prerequisites: json({
        defaultValue: [],
      }),
      learningOutcomes: json({
        defaultValue: [],
      }),
      isPublished: checkbox({ defaultValue: false }),
      isFeatured: checkbox({ defaultValue: false }),
      enrollmentCount: integer({ defaultValue: 0 }),
      completionRate: integer({ defaultValue: 0 }),
      rating: integer({
        validation: { min: 1, max: 50 },
        defaultValue: 25,
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

  // Community contributions and submissions
  Contribution: list({
    access: allowAll,
    fields: {
      title: text({ validation: { isRequired: true } }),
      type: select({
        options: [
          { label: 'New Tool Submission', value: 'tool-submission' },
          { label: 'Tool Update', value: 'tool-update' },
          { label: 'Bug Report', value: 'bug-report' },
          { label: 'Feature Request', value: 'feature-request' },
          { label: 'Content Contribution', value: 'content' },
        ],
        defaultValue: 'tool-submission',
      }),
      description: text({ ui: { displayMode: 'textarea' } }),
      content: json({
        defaultValue: {},
      }),
      contributor: relationship({
        ref: 'User',
        many: false,
      }),
      relatedTool: relationship({
        ref: 'Tool',
        many: false,
      }),
      status: select({
        options: [
          { label: 'Submitted', value: 'submitted' },
          { label: 'Under Review', value: 'review' },
          { label: 'Approved', value: 'approved' },
          { label: 'Rejected', value: 'rejected' },
          { label: 'Implemented', value: 'implemented' },
        ],
        defaultValue: 'submitted',
      }),
      reviewedBy: relationship({
        ref: 'User',
        many: false,
      }),
      reviewNotes: text({ ui: { displayMode: 'textarea' } }),
      priority: select({
        options: [
          { label: 'Low', value: 'low' },
          { label: 'Medium', value: 'medium' },
          { label: 'High', value: 'high' },
          { label: 'Critical', value: 'critical' },
        ],
        defaultValue: 'medium',
      }),
      submittedAt: timestamp({
        defaultValue: { kind: 'now' },
      }),
      reviewedAt: timestamp(),
    },
  }),
};
