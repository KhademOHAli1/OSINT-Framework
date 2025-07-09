# Contributing to OSINT Framework

First off, thank you for considering contributing to the OSINT Framework! It's people like you that make this project a valuable resource for the OSINT community.

## 🎯 Ways to Contribute

### 🔧 Code Contributions
- **Frontend Development** - Vue 3 + TypeScript improvements
- **Backend Development** - KeystoneJS + GraphQL enhancements
- **Database Improvements** - Schema optimizations and new content types
- **Performance Optimizations** - Speed and efficiency improvements
- **Bug Fixes** - Help us squash bugs and improve stability

### 📝 Content Contributions
- **Tool Guides** - Create comprehensive tool documentation
- **Articles** - Educational content and best practices
- **Learning Paths** - Structured curricula for OSINT education
- **Tool Reviews** - Share your experience with OSINT tools
- **Tool Information** - Update and improve tool metadata

### 🐛 Issue Reporting
- **Bug Reports** - Help us identify and fix issues
- **Feature Requests** - Suggest new functionality
- **Documentation Issues** - Report unclear or missing documentation
- **Accessibility Issues** - Help us improve accessibility

### 📖 Documentation
- **User Guides** - Help new users get started
- **Developer Documentation** - Improve setup and development guides
- **API Documentation** - Enhance GraphQL API documentation
- **Translations** - Help make the platform multilingual

## 🚀 Getting Started

### Development Setup

1. **Fork the Repository**
   ```bash
   # Fork on GitHub, then clone your fork
   git clone https://github.com/YOUR_USERNAME/OSINT-Framework.git
   cd OSINT-Framework
   ```

2. **Set Up Development Environment**
   ```bash
   # Backend setup
   cd backend
   npm install
   
   # Create database
   createdb osint_framework
   
   # Configure environment
   cp .env.example .env
   # Edit .env with your database credentials
   
   # Run migrations
   npm run migrate
   npm run seed
   npm run create-admin
   
   # Start backend
   npm run dev
   ```

3. **Frontend Setup**
   ```bash
   # Frontend setup (new terminal)
   cd frontend
   npm install
   
   # Configure environment
   cp .env.example .env
   # Edit .env with backend URL
   
   # Start frontend
   npm run dev
   ```

4. **Verify Setup**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3000/api/graphql
   - Admin Panel: http://localhost:3000/admin

## 🏗️ Enhanced Project Structure

```
OSINT-Framework/
├── frontend/                      # Vue 3 + TypeScript SPA
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/           # Reusable UI components
│   │   │   ├── tree/             # D3.js tree visualization
│   │   │   ├── modals/           # Enhanced tool modals
│   │   │   └── content/          # Content rendering components
│   │   ├── composables/
│   │   │   ├── useAppData.ts     # Main data management
│   │   │   ├── useGraphQLData.ts # GraphQL API integration
│   │   │   └── useEnhancedToolModal.ts # Tool modal logic
│   │   ├── stores/               # Pinia state management
│   │   ├── types.ts              # TypeScript definitions
│   │   └── styles/               # Tailwind CSS customization
│   └── public/                   # Static assets
├── backend/                      # KeystoneJS + PostgreSQL
│   ├── schema.ts                 # Main schema definition
│   ├── enhanced-schema.ts        # Enhanced content models
│   ├── keystone.ts               # Keystone configuration
│   ├── migrations/               # Database migrations
│   ├── scripts/                  # Utility scripts
│   ├── schema.prisma             # Prisma schema
│   └── schema.graphql            # Generated GraphQL schema
├── docs/                         # Documentation
├── ENHANCED_CONTENT_SYSTEM.md    # System documentation
└── README.md                     # Main documentation
```

## 🎯 How to Contribute

### 1. Adding New OSINT Tools

To add new tools to the framework:

1. **Update the data file**: Edit `frontend/public/data.json`
2. **Follow the data structure**:
   ```json
   {
     "name": "Tool Name",
     "type": "url",
     "url": "https://example.com"
   }
   ```

3. **For categories**, use:
   ```json
   {
     "name": "Category Name", 
     "type": "folder",
     "children": [...]
   }
   ```

### 2. Frontend Development

- **Components**: Add new Vue components in `frontend/src/components/`
- **Styling**: Use Tailwind CSS classes for consistency
- **State**: Use Pinia stores for global state management
- **Types**: Add TypeScript interfaces in `frontend/src/types.ts`

### 3. Documentation

- Update relevant documentation files in `docs/`
- Keep the main `README.md` current
- Document any new features or breaking changes

## 📋 Development Guidelines

### Code Style

- **TypeScript**: Use strict typing, avoid `any`
- **Vue 3**: Use Composition API with `<script setup>`
- **CSS**: Prefer Tailwind utilities over custom CSS
- **Naming**: Use descriptive variable and function names
- **Comments**: Document complex logic and business rules

### Commit Guidelines

Use conventional commits:
- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `style:` - Code style changes
- `refactor:` - Code refactoring
- `test:` - Adding tests
- `chore:` - Maintenance tasks

Examples:
```bash
git commit -m "feat: add search functionality to tree view"
git commit -m "fix: resolve mobile viewport issues"
git commit -m "docs: update installation instructions"
```

### Testing Your Changes

1. **Manual Testing**:
   - Test on desktop and mobile
   - Verify dark/light mode functionality
   - Test tree expansion and navigation
   - Check all OSINT tool links work

2. **Build Testing**:
   ```bash
   npm run build
   npm run preview
   ```

## 📋 Coding Standards

### TypeScript/JavaScript
```typescript
// Use TypeScript for all new code
interface ToolData {
  id: string;
  name: string;
  category: string;
  description?: string;
}

// Use meaningful variable names
const osintTools: ToolData[] = [];

// Add JSDoc comments for functions
/**
 * Fetches tool data from GraphQL API
 * @param toolId - Unique identifier for the tool
 * @returns Promise resolving to tool data
 */
async function fetchToolData(toolId: string): Promise<ToolData> {
  // Implementation
}
```

### Vue 3 Components
```vue
<template>
  <!-- Use semantic HTML -->
  <article class="tool-card">
    <header>
      <h2>{{ tool.name }}</h2>
    </header>
    <main>
      <p>{{ tool.description }}</p>
    </main>
  </article>
</template>

<script setup lang="ts">
// Use Composition API
import { computed, ref } from 'vue'
import type { Tool } from '@/types'

interface Props {
  tool: Tool
}

const props = defineProps<Props>()

// Use meaningful variable names
const isExpanded = ref(false)
const formattedDescription = computed(() => {
  return props.tool.description?.slice(0, 100) + '...'
})
</script>

<style scoped>
/* Use Tailwind CSS classes when possible */
.tool-card {
  @apply bg-white dark:bg-gray-800 rounded-lg shadow-md p-6;
}
</style>
```

### Backend (KeystoneJS)
```typescript
// Follow KeystoneJS patterns
export const Tool = list({
  access: allowAll,
  fields: {
    name: text({ validation: { isRequired: true } }),
    slug: text({ 
      validation: { isRequired: true },
      isIndexed: 'unique'
    }),
    description: text({ ui: { displayMode: 'textarea' } }),
    category: relationship({ 
      ref: 'Category.tools',
      many: false 
    }),
    // Use meaningful field names and validation
  },
  hooks: {
    // Add hooks for data processing
    beforeOperation: async ({ operation, item }) => {
      if (operation === 'create' && !item.slug) {
        item.slug = slugify(item.name)
      }
    }
  }
})
```

## 🧪 Testing Guidelines

### Frontend Testing
```bash
# Run tests
npm run test

# Run tests with coverage
npm run test:coverage

# Run E2E tests
npm run test:e2e
```

### Backend Testing
```bash
# Run API tests
npm run test:api

# Test database operations
npm run test:db

# Integration tests
npm run test:integration
```

## 📝 Content Contribution Guidelines

### Writing Tool Guides
```markdown
# Tool Name - Comprehensive Guide

## Overview
Brief description of what the tool does and why it's useful.

## Prerequisites
- Required skills or knowledge
- Dependencies or accounts needed

## Step-by-Step Tutorial
### 1. Getting Started
Detailed instructions with screenshots

### 2. Basic Usage
Common use cases with examples

### 3. Advanced Features
Power user features and tips

## Best Practices
- Security considerations
- Privacy implications
- Legal considerations

## Troubleshooting
Common issues and solutions

## Related Tools
Links to complementary tools
```

### Content Standards
- **Accuracy**: Verify all information before submitting
- **Clarity**: Write for beginners but include advanced tips
- **Completeness**: Cover the full workflow, not just basics
- **Legal Compliance**: Ensure all recommendations are legal and ethical
- **Privacy Awareness**: Include privacy and security considerations

## 🔄 Pull Request Process

1. **Create a feature branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** following the guidelines above

3. **Test thoroughly** on different devices and browsers

4. **Commit your changes** with descriptive messages

5. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create a Pull Request** with:
   - Clear title and description
   - Reference any related issues
   - Screenshots/GIFs for UI changes
   - Test results summary

### Review Process

- Maintainers will review your PR
- Address any feedback or requested changes
- Once approved, your PR will be merged

## 🏷️ Adding OSINT Tools Guidelines

### Quality Standards

Tools should be:
- **Legitimate**: Real, working OSINT tools
- **Accessible**: Publicly available (free or paid)
- **Relevant**: Used for open source intelligence gathering
- **Working**: Links should be functional

### Categories

Organize tools into appropriate categories:
- **Search Engines**: Google, Bing, specialized search
- **Social Media**: Platform-specific tools
- **Domain/IP**: DNS, WHOIS, network analysis
- **People**: People search, background checks
- **Images**: Reverse image search, metadata
- **Documents**: File analysis, metadata extraction
- **And more...**

### Data Format

```json
{
  "name": "Category Name",
  "type": "folder", 
  "children": [
    {
      "name": "Tool Name",
      "type": "url",
      "url": "https://tool-website.com"
    }
  ]
}
```

## 🚀 Release Process

Releases follow semantic versioning (semver):
- **Major** (1.0.0): Breaking changes
- **Minor** (0.1.0): New features, backward compatible
- **Patch** (0.0.1): Bug fixes, backward compatible

## 📞 Getting Help

- **GitHub Discussions**: [Ask questions and discuss ideas](https://github.com/KhademOHAli1/OSINT-Framework/discussions)
- **GitHub Issues**: [Report bugs or request features](https://github.com/KhademOHAli1/OSINT-Framework/issues)
- **Documentation**: [Enhanced Content System](./ENHANCED_CONTENT_SYSTEM.md)

---

**Thank you for contributing to the OSINT Framework!** 🎉

Every contribution, no matter how small, helps make this platform better for the entire OSINT community.
