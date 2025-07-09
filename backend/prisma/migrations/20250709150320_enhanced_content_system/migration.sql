-- CreateTable
CREATE TABLE "Article" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL DEFAULT '',
    "slug" TEXT NOT NULL DEFAULT '',
    "summary" TEXT NOT NULL DEFAULT '',
    "content" JSONB NOT NULL DEFAULT '[{"type":"paragraph","children":[{"text":""}]}]',
    "author" TEXT,
    "category" TEXT DEFAULT 'guide',
    "featuredImage_id" TEXT,
    "featuredImage_filesize" INTEGER,
    "featuredImage_width" INTEGER,
    "featuredImage_height" INTEGER,
    "featuredImage_extension" TEXT,
    "gallery" JSONB DEFAULT '[]',
    "metadata" JSONB DEFAULT '{}',
    "difficultyLevel" TEXT DEFAULT 'beginner',
    "estimatedReadTime" INTEGER DEFAULT 5,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "publishedAt" TIMESTAMP(3),
    "lastReviewed" TIMESTAMP(3),
    "viewCount" INTEGER DEFAULT 0,
    "likeCount" INTEGER DEFAULT 0,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Article_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ToolGuide" (
    "id" TEXT NOT NULL,
    "tool" TEXT,
    "title" TEXT NOT NULL DEFAULT '',
    "type" TEXT DEFAULT 'getting-started',
    "content" JSONB NOT NULL DEFAULT '[{"type":"paragraph","children":[{"text":""}]}]',
    "author" TEXT,
    "prerequisites" TEXT NOT NULL DEFAULT '',
    "learningObjectives" JSONB DEFAULT '[]',
    "screenshots" JSONB DEFAULT '[]',
    "videoUrl" TEXT NOT NULL DEFAULT '',
    "codeExamples" JSONB DEFAULT '[]',
    "difficultyLevel" TEXT DEFAULT 'beginner',
    "estimatedTime" INTEGER DEFAULT 15,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "lastUpdated" TIMESTAMP(3),
    "viewCount" INTEGER DEFAULT 0,
    "helpfulCount" INTEGER DEFAULT 0,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ToolGuide_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MediaFile" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT '',
    "description" TEXT NOT NULL DEFAULT '',
    "file_filesize" INTEGER,
    "file_filename" TEXT,
    "type" TEXT DEFAULT 'image',
    "alt" TEXT NOT NULL DEFAULT '',
    "uploadedBy" TEXT,
    "fileSize" INTEGER,
    "mimeType" TEXT NOT NULL DEFAULT '',
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MediaFile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContentTag" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT '',
    "slug" TEXT NOT NULL DEFAULT '',
    "description" TEXT NOT NULL DEFAULT '',
    "color" TEXT NOT NULL DEFAULT '',
    "usageCount" INTEGER DEFAULT 0,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ContentTag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LearningPath" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL DEFAULT '',
    "slug" TEXT NOT NULL DEFAULT '',
    "description" TEXT NOT NULL DEFAULT '',
    "content" JSONB NOT NULL DEFAULT '[{"type":"paragraph","children":[{"text":""}]}]',
    "creator" TEXT,
    "difficulty" TEXT DEFAULT 'beginner',
    "estimatedDuration" INTEGER DEFAULT 10,
    "prerequisites" JSONB DEFAULT '[]',
    "learningOutcomes" JSONB DEFAULT '[]',
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "enrollmentCount" INTEGER DEFAULT 0,
    "completionRate" INTEGER DEFAULT 0,
    "rating" INTEGER DEFAULT 25,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LearningPath_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Contribution" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL DEFAULT '',
    "type" TEXT DEFAULT 'tool-submission',
    "description" TEXT NOT NULL DEFAULT '',
    "content" JSONB DEFAULT '{}',
    "contributor" TEXT,
    "relatedTool" TEXT,
    "status" TEXT DEFAULT 'submitted',
    "reviewedBy" TEXT,
    "reviewNotes" TEXT NOT NULL DEFAULT '',
    "priority" TEXT DEFAULT 'medium',
    "submittedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "reviewedAt" TIMESTAMP(3),

    CONSTRAINT "Contribution_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_Article_relatedTools" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_Article_tags" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_Article_relatedArticles" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_LearningPath_articles" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_ContentTag_media" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_LearningPath_tools" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Article_slug_key" ON "Article"("slug");

-- CreateIndex
CREATE INDEX "Article_author_idx" ON "Article"("author");

-- CreateIndex
CREATE INDEX "ToolGuide_tool_idx" ON "ToolGuide"("tool");

-- CreateIndex
CREATE INDEX "ToolGuide_author_idx" ON "ToolGuide"("author");

-- CreateIndex
CREATE INDEX "MediaFile_uploadedBy_idx" ON "MediaFile"("uploadedBy");

-- CreateIndex
CREATE UNIQUE INDEX "ContentTag_slug_key" ON "ContentTag"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "LearningPath_slug_key" ON "LearningPath"("slug");

-- CreateIndex
CREATE INDEX "LearningPath_creator_idx" ON "LearningPath"("creator");

-- CreateIndex
CREATE INDEX "Contribution_contributor_idx" ON "Contribution"("contributor");

-- CreateIndex
CREATE INDEX "Contribution_relatedTool_idx" ON "Contribution"("relatedTool");

-- CreateIndex
CREATE INDEX "Contribution_reviewedBy_idx" ON "Contribution"("reviewedBy");

-- CreateIndex
CREATE UNIQUE INDEX "_Article_relatedTools_AB_unique" ON "_Article_relatedTools"("A", "B");

-- CreateIndex
CREATE INDEX "_Article_relatedTools_B_index" ON "_Article_relatedTools"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_Article_tags_AB_unique" ON "_Article_tags"("A", "B");

-- CreateIndex
CREATE INDEX "_Article_tags_B_index" ON "_Article_tags"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_Article_relatedArticles_AB_unique" ON "_Article_relatedArticles"("A", "B");

-- CreateIndex
CREATE INDEX "_Article_relatedArticles_B_index" ON "_Article_relatedArticles"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_LearningPath_articles_AB_unique" ON "_LearningPath_articles"("A", "B");

-- CreateIndex
CREATE INDEX "_LearningPath_articles_B_index" ON "_LearningPath_articles"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ContentTag_media_AB_unique" ON "_ContentTag_media"("A", "B");

-- CreateIndex
CREATE INDEX "_ContentTag_media_B_index" ON "_ContentTag_media"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_LearningPath_tools_AB_unique" ON "_LearningPath_tools"("A", "B");

-- CreateIndex
CREATE INDEX "_LearningPath_tools_B_index" ON "_LearningPath_tools"("B");

-- AddForeignKey
ALTER TABLE "Article" ADD CONSTRAINT "Article_author_fkey" FOREIGN KEY ("author") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ToolGuide" ADD CONSTRAINT "ToolGuide_tool_fkey" FOREIGN KEY ("tool") REFERENCES "Tool"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ToolGuide" ADD CONSTRAINT "ToolGuide_author_fkey" FOREIGN KEY ("author") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MediaFile" ADD CONSTRAINT "MediaFile_uploadedBy_fkey" FOREIGN KEY ("uploadedBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LearningPath" ADD CONSTRAINT "LearningPath_creator_fkey" FOREIGN KEY ("creator") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contribution" ADD CONSTRAINT "Contribution_contributor_fkey" FOREIGN KEY ("contributor") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contribution" ADD CONSTRAINT "Contribution_relatedTool_fkey" FOREIGN KEY ("relatedTool") REFERENCES "Tool"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contribution" ADD CONSTRAINT "Contribution_reviewedBy_fkey" FOREIGN KEY ("reviewedBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Article_relatedTools" ADD CONSTRAINT "_Article_relatedTools_A_fkey" FOREIGN KEY ("A") REFERENCES "Article"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Article_relatedTools" ADD CONSTRAINT "_Article_relatedTools_B_fkey" FOREIGN KEY ("B") REFERENCES "Tool"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Article_tags" ADD CONSTRAINT "_Article_tags_A_fkey" FOREIGN KEY ("A") REFERENCES "Article"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Article_tags" ADD CONSTRAINT "_Article_tags_B_fkey" FOREIGN KEY ("B") REFERENCES "ContentTag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Article_relatedArticles" ADD CONSTRAINT "_Article_relatedArticles_A_fkey" FOREIGN KEY ("A") REFERENCES "Article"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Article_relatedArticles" ADD CONSTRAINT "_Article_relatedArticles_B_fkey" FOREIGN KEY ("B") REFERENCES "Article"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LearningPath_articles" ADD CONSTRAINT "_LearningPath_articles_A_fkey" FOREIGN KEY ("A") REFERENCES "Article"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LearningPath_articles" ADD CONSTRAINT "_LearningPath_articles_B_fkey" FOREIGN KEY ("B") REFERENCES "LearningPath"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ContentTag_media" ADD CONSTRAINT "_ContentTag_media_A_fkey" FOREIGN KEY ("A") REFERENCES "ContentTag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ContentTag_media" ADD CONSTRAINT "_ContentTag_media_B_fkey" FOREIGN KEY ("B") REFERENCES "MediaFile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LearningPath_tools" ADD CONSTRAINT "_LearningPath_tools_A_fkey" FOREIGN KEY ("A") REFERENCES "LearningPath"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LearningPath_tools" ADD CONSTRAINT "_LearningPath_tools_B_fkey" FOREIGN KEY ("B") REFERENCES "Tool"("id") ON DELETE CASCADE ON UPDATE CASCADE;
