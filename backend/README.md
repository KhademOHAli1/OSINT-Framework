# OSINT Framework Backend

A modern KeystoneJS backend with PostgreSQL for the OSINT Framework project.

## 🏗️ Architecture

- **KeystoneJS 6** - Modern headless CMS with GraphQL API
- **PostgreSQL** - Relational database with JSON support
- **TypeScript** - Type-safe development
- **Prisma** - Database ORM and migrations
- **GraphQL** - Modern API with real-time capabilities
- **Docker** - Containerized deployment

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- PostgreSQL 15+
- npm or yarn

### Local Development

1. **Install dependencies**:
```bash
npm install
```

2. **Set up environment**:
```bash
cp .env.example .env
# Edit .env with your database credentials
```

3. **Set up database**:
```bash
# Create database
createdb osint_framework

# Run migrations
npm run migrate

# Seed with sample data
npm run seed
```

4. **Start development server**:
```bash
npm run dev
```

5. **Access the admin UI**: http://localhost:4000

### Docker Deployment

1. **Using docker-compose**:
```bash
docker-compose up -d
```

2. **Run migrations**:
```bash
docker-compose exec backend npm run migrate:deploy
```

3. **Seed database**:
```bash
docker-compose exec backend npm run seed
```

## 📊 Database Schema

### Core Entities

- **User** - User accounts and authentication
- **Category** - Hierarchical tool categories
- **Tool** - OSINT tools and resources
- **Tag** - Flexible tagging system
- **Review** - User reviews and ratings
- **Collection** - User-curated tool collections
- **NewsItem** - Framework updates and news

### Analytics Entities

- **ToolUsage** - Usage tracking for analytics
- **SearchQuery** - Search analytics

## 🔌 API Endpoints

### GraphQL Endpoint
- **URL**: `http://localhost:4000/api/graphql`
- **Playground**: Available in development mode

### Custom Queries
```graphql
# Search tools
query SearchTools($query: String!, $limit: Int) {
  searchTools(query: $query, limit: $limit) {
    id
    name
    description
    url
    categories {
      name
    }
  }
}

# Get popular tools
query PopularTools($limit: Int) {
  popularTools(limit: $limit) {
    id
    name
    usageCount
    rating
  }
}

# Tool statistics
query ToolStats {
  toolStats {
    totalTools
    totalCategories
    averageRating
    recentlyAddedTools {
      name
      createdAt
    }
  }
}
```

### Custom Mutations
```graphql
# Track tool usage
mutation TrackUsage($toolId: ID!, $sessionId: String) {
  trackToolUsage(toolId: $toolId, sessionId: $sessionId) {
    id
    timestamp
  }
}

# Submit review
mutation SubmitReview($toolId: ID!, $rating: Int!, $title: String, $content: String) {
  submitToolReview(toolId: $toolId, rating: $rating, title: $title, content: $content) {
    id
    rating
    title
  }
}
```

## 🔧 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run start` | Start production server |
| `npm run build` | Build for production |
| `npm run migrate` | Run database migrations |
| `npm run migrate:deploy` | Deploy migrations to production |
| `npm run seed` | Seed database with sample data |
| `npm run studio` | Open Prisma Studio |
| `npm run generate` | Generate Prisma client |

## 🔐 Authentication

The backend uses session-based authentication:

- **Admin Panel**: Access requires user authentication
- **GraphQL API**: Public queries, authenticated mutations
- **First User**: Automatically created as admin on first startup

### Default Admin Credentials
- **Email**: admin@osintframework.com
- **Password**: admin123 (change in production!)

## 🌍 Environment Variables

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/osint_framework"

# Security
SESSION_SECRET="your-super-secret-session-key"

# Server
PORT=4000
NODE_ENV=development

# Frontend
FRONTEND_URL="http://localhost:3000"

# External APIs (optional)
CLOUDINARY_CLOUD_NAME=""
CLOUDINARY_API_KEY=""
CLOUDINARY_API_SECRET=""
```

## 📦 Data Migration

### Import Legacy Data

The backend includes a migration script to import data from the existing JSON format:

```bash
npm run seed
```

This will:
- Import all categories and tools from `frontend/public/data.json`
- Create proper relationships and metadata
- Generate sample tags and reviews
- Set up admin user

## 🔍 Features

### Core CMS Features
- ✅ **User Management** - Registration, authentication, roles
- ✅ **Tool Management** - CRUD operations for OSINT tools
- ✅ **Category System** - Hierarchical organization
- ✅ **Tagging System** - Flexible tool categorization
- ✅ **Review System** - User ratings and reviews
- ✅ **Search & Filtering** - Full-text search capabilities

### Analytics Features
- ✅ **Usage Tracking** - Tool click tracking
- ✅ **Search Analytics** - Query analysis
- ✅ **Popular Tools** - Usage-based rankings
- ✅ **Statistics Dashboard** - Comprehensive metrics

### Content Features
- ✅ **Rich Content** - Document field support
- ✅ **Image Management** - Tool screenshots and logos
- ✅ **News System** - Framework updates and announcements
- ✅ **Collections** - User-curated tool lists

## 🚀 Production Deployment

### Database Setup
1. Create PostgreSQL database
2. Set up connection pooling
3. Configure backups
4. Set up monitoring

### Security Checklist
- [ ] Change default admin password
- [ ] Set strong session secret
- [ ] Configure CORS properly
- [ ] Set up HTTPS/SSL
- [ ] Enable rate limiting
- [ ] Configure content security policy

### Performance Optimization
- [ ] Enable database query optimization
- [ ] Set up Redis caching
- [ ] Configure CDN for static assets
- [ ] Enable gzip compression
- [ ] Set up database connection pooling

## 🔗 Integration with Frontend

The backend is designed to integrate seamlessly with the Vue 3 frontend:

### GraphQL Client Setup
```typescript
// In frontend/src/api/client.ts
import { ApolloClient, InMemoryCache } from '@apollo/client/core';

const client = new ApolloClient({
  uri: 'http://localhost:4000/api/graphql',
  cache: new InMemoryCache(),
});
```

### Example Queries
```typescript
// Get all tools
const GET_TOOLS = gql`
  query GetTools {
    tools {
      id
      name
      description
      url
      categories {
        name
      }
    }
  }
`;
```

## 📋 Roadmap

### Phase 1 (Current)
- ✅ Basic CMS setup
- ✅ Data migration
- ✅ Authentication
- ✅ GraphQL API

### Phase 2
- [ ] Advanced search with Elasticsearch
- [ ] Real-time notifications
- [ ] Webhook system
- [ ] API rate limiting

### Phase 3
- [ ] Machine learning for tool categorization
- [ ] External API integrations
- [ ] Advanced analytics dashboard
- [ ] Mobile app API support

---

**Need help?** Check the [main project README](../README.md) or open an issue on GitHub.
