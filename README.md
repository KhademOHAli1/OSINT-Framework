# OSINT Framework - Enhanced Educational Platform

[![CI/CD Pipeline](https://github.com/KhademOHAli1/OSINT-Framework/actions/workflows/ci-cd.yml/badge.svg)](https://github.com/KhademOHAli1/OSINT-Framework/actions/workflows/ci-cd.yml)
[![GitHub release](https://img.shields.io/github/release/KhademOHAli1/OSINT-Framework.svg)](https://github.com/KhademOHAli1/OSINT-Framework/releases)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![GitHub stars](https://img.shields.io/github/stars/KhademOHAli1/OSINT-Framework.svg)](https://github.com/KhademOHAli1/OSINT-Framework/stargazers)

**Version 2.0** - A comprehensive Open Source Intelligence (OSINT) educational platform and content management system, evolved from a static tool listing to a dynamic, database-driven learning environment.

🔗 **Live Demo**: [https://khademohali1.github.io/OSINT-Framework](https://khademohali1.github.io/OSINT-Framework)  
📚 **Enhanced Content System**: [View Documentation](./ENHANCED_CONTENT_SYSTEM.md)

## 🎯 What's New in Version 2.0

### 🔄 **Major Upgrade: Static to Dynamic**
- **Database-Driven**: Migrated from static JSON to PostgreSQL with KeystoneJS CMS
- **GraphQL API**: Real-time data fetching with comprehensive content management
- **Enhanced Content Types**: Articles, Tool Guides, Learning Paths, Media Files, and more
- **Community Contributions**: User-generated content with review workflows

### 🧠 **Educational Excellence**
- 📚 **Rich Content Management** - Articles, tutorials, and comprehensive tool documentation
- 🛤️ **Learning Paths** - Structured curricula for OSINT skill development from beginner to expert
- 📖 **Interactive Tool Guides** - Step-by-step documentation with screenshots and examples
- 🎯 **Skill Assessment** - Track progress through different difficulty levels
- 📊 **Analytics Dashboard** - Monitor learning advancement and tool usage

### 🤝 **Community-Driven Platform**
- ⭐ **Reviews & Ratings** - Community feedback and comprehensive tool evaluation
- 📝 **User Contributions** - Submit articles, guides, and tool updates
- 🔄 **Collaborative Editing** - Improve documentation through community contributions
- 🐛 **Issue Reporting** - Built-in bug reports and feature request system
- 👥 **Author Profiles** - Recognition and reputation system for contributors

### 🛠️ **Enhanced Tool Experience**
- 🔍 **Interactive Tree Visualization** - D3.js-powered hierarchical tool discovery
- 💡 **Rich Tool Modals** - Tabbed interface with Overview, Guides, Reviews, and Contribute sections
- 📊 **Usage Analytics** - Real-time tool popularity and effectiveness metrics
- 🔗 **Smart Recommendations** - Discover related tools and complementary resources
- 📱 **Mobile-First Design** - Fully optimized for mobile and tablet devices

### 🎨 **Modern Tech Stack**
- 🌙 **Dark/Light Mode** - Automatic system detection with manual toggle
- ⚡ **Performance Optimized** - Built with Vue 3, TypeScript, and Vite for lightning-fast experience
- ♿ **Accessibility First** - WCAG compliant with full keyboard navigation and screen reader support
- 🎨 **Beautiful UI/UX** - Modern design with smooth animations and micro-interactions

## 🏗️ Enhanced Architecture

**Version 2.0 represents a complete transformation** from a static tool listing to a comprehensive, database-driven educational platform:

### 🎯 **Frontend (Vue 3 + TypeScript)**
- **Vue 3** with Composition API and TypeScript for type-safe development
- **Tailwind CSS** for responsive, utility-first styling
- **D3.js** for interactive hierarchical tree visualization
- **Pinia** for reactive state management
- **GraphQL Client** for efficient API communication
- **Vite** for lightning-fast development and build optimization

### 🔧 **Backend (KeystoneJS + PostgreSQL)**
- **KeystoneJS 6.5.1** headless CMS with auto-generated GraphQL API
- **PostgreSQL** database with comprehensive relational schema
- **Prisma** ORM for type-safe database operations and migrations
- **Rich Text Editor** with document formatting and media embedding
- **File Storage System** for media management and uploads
- **Role-Based Authentication** with granular permission control

### 📊 **Enhanced Content Management**
- 📝 **Rich Text Editing** - Full-featured WYSIWYG editor with markdown support
- 🖼️ **Media Management** - Comprehensive file upload and organization system
- 🏷️ **Content Organization** - Advanced tagging, categorization, and collections
- 📈 **Version Control** - Track all content changes with revision history
- 🚀 **Publication Workflow** - Draft → Review → Publish with approval processes

## 📊 Database Schema Overview

**Enhanced Content Types:**
- **Tools** (1,104 tools) - Enhanced with guides, reviews, analytics, and rich metadata
- **Categories** (190 categories) - Hierarchical organization with enhanced properties
- **Users** - Authentication, roles, and community profiles
- **Articles** - Educational blog-style content with rich text and media
- **Tool Guides** - Comprehensive step-by-step tool documentation
- **Learning Paths** - Structured educational curricula with progress tracking
- **Reviews** - Community feedback, ratings, and detailed evaluations
- **Media Files** - Centralized asset management with metadata
- **Content Tags** - Advanced tagging system for content discovery
- **Contributions** - Community-driven content submission and review workflow

## 📁 Enhanced Project Structure

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
│   │   ├── 20250709134910_init/
│   │   └── 20250709150320_enhanced_content_system/
│   ├── scripts/
│   │   └── create-admin.ts       # Admin user creation
│   ├── schema.prisma             # Prisma schema
│   └── schema.graphql            # Generated GraphQL schema
├── docs/                         # Documentation
├── ENHANCED_CONTENT_SYSTEM.md    # Comprehensive system documentation
└── README.md                     # This file
```

## 🚀 Quick Start

### Option 1: Use Online (Recommended)
Visit the live version: **[https://khademohali1.github.io/OSINT-Framework](https://khademohali1.github.io/OSINT-Framework)**

### Option 2: Development Setup (Full Stack)

#### Prerequisites
- **Node.js** (v18 or higher)
- **PostgreSQL** (v15 or higher)
- **Git**

#### 1. Clone Repository
```bash
git clone https://github.com/KhademOHAli1/OSINT-Framework.git
cd OSINT-Framework
```

#### 2. Backend Setup (KeystoneJS + PostgreSQL)
```bash
cd backend

# Install dependencies
npm install

# Setup PostgreSQL database
createdb osint_framework

# Configure environment
cp .env.example .env
# Edit .env with your database credentials:
# DATABASE_URL="postgresql://username:password@localhost:5432/osint_framework"
# SHADOW_DATABASE_URL="postgresql://username:password@localhost:5432/osint_framework_shadow"

# Run database migrations
npm run migrate

# Seed the database with initial data
npm run seed

# Create admin user
npm run create-admin

# Start the backend server
npm run dev
```

Backend will be available at: `http://localhost:3000`  
Admin interface: `http://localhost:3000/admin`

#### 3. Frontend Setup (Vue 3 + TypeScript)
```bash
cd ../frontend

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with backend URL:
# VITE_API_URL=http://localhost:3000/api/graphql

# Start the development server
npm run dev
```

Frontend will be available at: `http://localhost:5173`

### Option 3: Docker Deployment
```bash
# Clone and navigate
git clone https://github.com/KhademOHAli1/OSINT-Framework.git
cd OSINT-Framework

# Start with Docker Compose
docker-compose up -d

# Access the application
# Frontend: http://localhost:8080
# Backend: http://localhost:3000
# Admin: http://localhost:3000/admin
```

## 📖 User Guide

### For Learners
1. **Explore Tools** - Browse the interactive tree or search for specific tools
2. **Read Guides** - Access comprehensive documentation for each tool
3. **Follow Learning Paths** - Structured curricula from beginner to advanced
4. **Track Progress** - Monitor your learning journey and completed guides
5. **Join Community** - Read and write reviews, ask questions

### For Contributors
1. **Submit Tool Reviews** - Share your experience with OSINT tools
2. **Write Guides** - Create step-by-step tutorials
3. **Contribute Articles** - Educational content and best practices
4. **Report Issues** - Help improve tool information and functionality
5. **Collaborate** - Work with others to enhance documentation

### For Administrators
1. **Content Management** - Rich admin interface for all content types
2. **User Management** - Role-based access control and user administration
3. **Analytics** - Monitor tool usage, popular content, and user engagement
4. **Moderation** - Review and approve community contributions
5. **System Health** - Database management, backups, and monitoring

## 🔧 Development

### Key Technologies
- **Frontend**: Vue 3, TypeScript, Tailwind CSS, D3.js, Vite
- **Backend**: KeystoneJS, PostgreSQL, Prisma, GraphQL
- **Deployment**: Docker, GitHub Actions, Netlify

### Important Files
- `frontend/src/composables/useGraphQLData.ts` - GraphQL integration
- `backend/enhanced-schema.ts` - Enhanced content models
- `backend/migrations/` - Database schema evolution
- `ENHANCED_CONTENT_SYSTEM.md` - Comprehensive system documentation

### Development Workflow
1. **Database Changes**: Update `enhanced-schema.ts`, run migrations
2. **Frontend Changes**: Update components, add new features
3. **Testing**: Ensure both frontend and backend integration works
4. **Documentation**: Keep README and system docs updated

## 📈 Roadmap

### Phase 1: Core Enhanced Features ✅
- ✅ Database-driven architecture with PostgreSQL
- ✅ Enhanced content types (Articles, Guides, Learning Paths)
- ✅ GraphQL API integration
- ✅ Community contributions system
- ✅ Rich content management

### Phase 2: Advanced Features (In Progress)
- 🔄 Enhanced tool modals with tabbed interface
- 🔄 Article and guide rendering system
- 🔄 Learning path progress tracking
- 🔄 Review and rating system
- 🔄 Advanced search and filtering

### Phase 3: Community & Collaboration (Planned)
- 📋 Real-time collaborative editing
- 📋 Advanced analytics dashboard
- 📋 Personalized learning recommendations
- 📋 Mobile app development
- 📋 API documentation and public access

### Phase 4: Scale & Performance (Future)
- 📋 Advanced caching and CDN integration
- 📋 Multi-language support
- 📋 Enterprise features and white-labeling
- 📋 Advanced security and compliance features

## 🤝 Contributing

We welcome contributions from the OSINT community! Here's how you can help:

### Types of Contributions
- 🔧 **Code Contributions** - Frontend/backend improvements
- 📝 **Content** - Tool guides, articles, learning paths
- 🐛 **Bug Reports** - Help us identify and fix issues
- 💡 **Feature Requests** - Suggest new functionality
- 📖 **Documentation** - Improve guides and documentation

### Contributing Process
1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Write meaningful commit messages
- Update documentation for new features
- Test your changes thoroughly
- Ensure accessibility compliance

## 📊 Statistics

- **1,104 OSINT Tools** across 190 categories
- **Enhanced Database Schema** with 10+ content types
- **GraphQL API** with comprehensive querying capabilities
- **Community-Driven** content creation and review system
- **Mobile-First** responsive design
- **Open Source** with MIT license

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🌟 Acknowledgments

- **OSINT Community** for continuous feedback and contributions
- **Vue.js Team** for the excellent frontend framework
- **KeystoneJS Team** for the powerful CMS platform
- **D3.js Community** for the visualization capabilities
- **Contributors** who help improve the platform

## 📞 Support

- **GitHub Issues**: [Report bugs or request features](https://github.com/KhademOHAli1/OSINT-Framework/issues)
- **Discussions**: [Community discussions](https://github.com/KhademOHAli1/OSINT-Framework/discussions)
- **Documentation**: [Enhanced Content System](./ENHANCED_CONTENT_SYSTEM.md)

---

**Made with ❤️ for the OSINT Community**

*Empowering investigators, researchers, and security professionals with comprehensive OSINT education and tools.*
