# Technical Architecture Plan

This document outlines the technical architecture decisions and implementation strategies for the OSINT Framework's evolution from a frontend-only application to a full-stack platform.

## 🏗️ Current Architecture (v2.0)

### Frontend Stack
```
┌─────────────────────────────────────┐
│            Vue 3 App                │
├─────────────────────────────────────┤
│  Components  │  Composables  │ Stores │
│  ├─TreeContainer │ ├─useAppData │ ├─app.ts │
│  ├─App.vue      │ ├─useD3Tree  │        │
│  └─...          │ └─...        │        │
├─────────────────────────────────────┤
│      Tailwind CSS + D3.js          │
├─────────────────────────────────────┤
│         Vite Build Tool             │
└─────────────────────────────────────┘
```

### Data Flow (Current)
```
Static JSON → Composables → Pinia Store → Vue Components
```

## 🎯 Target Architecture (v3.0+)

### Full-Stack Overview
```
┌─────────────────────────────────────┐
│         Frontend (Vue 3)            │
│  ┌─────────────┐  ┌─────────────┐   │
│  │  Web App    │  │ Admin Panel │   │
│  └─────────────┘  └─────────────┘   │
└─────────────────┬───────────────────┘
                  │ REST API / GraphQL
┌─────────────────┼───────────────────┐
│                 │    Backend        │
│  ┌─────────────┐│  ┌─────────────┐   │
│  │ API Server  ││  │ Auth Service│   │
│  └─────────────┘│  └─────────────┘   │
│  ┌─────────────┐│  ┌─────────────┐   │
│  │   Workers   ││  │   Cache     │   │
│  └─────────────┘│  └─────────────┘   │
└─────────────────┼───────────────────┘
                  │
┌─────────────────┼───────────────────┐
│                 │   Database        │
│  ┌─────────────┐│  ┌─────────────┐   │
│  │ PostgreSQL  ││  │    Redis    │   │
│  └─────────────┘│  └─────────────┘   │
└─────────────────────────────────────┘
```

## 🗄️ Database Design

### Core Tables (PostgreSQL)

```sql
-- Tools table
CREATE TABLE tools (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    url VARCHAR(500),
    category_id UUID REFERENCES categories(id),
    tool_type VARCHAR(50), -- 'web', 'software', 'api', 'mobile'
    status VARCHAR(20) DEFAULT 'active', -- 'active', 'inactive', 'deprecated'
    difficulty VARCHAR(20), -- 'beginner', 'intermediate', 'advanced'
    is_free BOOLEAN DEFAULT true,
    last_verified TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    created_by UUID REFERENCES users(id),
    metadata JSONB -- Flexible metadata storage
);

-- Categories table (hierarchical)
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    parent_id UUID REFERENCES categories(id),
    icon VARCHAR(100),
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Tags table (many-to-many with tools)
CREATE TABLE tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) UNIQUE NOT NULL,
    color VARCHAR(7), -- Hex color code
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE tool_tags (
    tool_id UUID REFERENCES tools(id) ON DELETE CASCADE,
    tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY (tool_id, tag_id)
);

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(100) UNIQUE,
    password_hash VARCHAR(255),
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    role VARCHAR(20) DEFAULT 'user', -- 'admin', 'moderator', 'user'
    is_active BOOLEAN DEFAULT true,
    email_verified BOOLEAN DEFAULT false,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- User bookmarks
CREATE TABLE bookmarks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    tool_id UUID REFERENCES tools(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, tool_id)
);

-- Tool usage analytics
CREATE TABLE tool_usage (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tool_id UUID REFERENCES tools(id),
    user_id UUID REFERENCES users(id) NULL, -- NULL for anonymous
    session_id VARCHAR(100),
    ip_address INET,
    user_agent TEXT,
    accessed_at TIMESTAMP DEFAULT NOW(),
    INDEX(tool_id, accessed_at),
    INDEX(accessed_at)
);
```

## 🔧 Backend Technology Stack

### Option A: Node.js Stack (Recommended)
```javascript
// Technology choices
const stack = {
  runtime: "Node.js 20+",
  framework: "Express.js with TypeScript",
  database: "PostgreSQL 15+",
  cache: "Redis 7+",
  auth: "JWT + Passport.js",
  validation: "Zod",
  orm: "Prisma or TypeORM",
  testing: "Jest + Supertest",
  docs: "Swagger/OpenAPI"
};
```

### Option B: Python Stack (Alternative)
```python
# Technology choices
stack = {
    "framework": "FastAPI",
    "database": "PostgreSQL with SQLAlchemy",
    "cache": "Redis",
    "auth": "JWT + OAuth2",
    "validation": "Pydantic",
    "testing": "pytest + httpx",
    "docs": "FastAPI auto-generated"
}
```

## 🔌 API Design

### RESTful API Structure
```
/api/v1/
├── auth/
│   ├── POST /login
│   ├── POST /register
│   ├── POST /refresh
│   └── POST /logout
├── tools/
│   ├── GET    /         # List tools with filters
│   ├── POST   /         # Create tool (admin)
│   ├── GET    /:id      # Get tool details
│   ├── PUT    /:id      # Update tool (admin)
│   ├── DELETE /:id      # Delete tool (admin)
│   └── POST   /:id/verify # Verify tool link
├── categories/
│   ├── GET    /         # List categories
│   ├── POST   /         # Create category (admin)
│   ├── GET    /:id/tools # Get tools in category
│   └── PUT    /:id      # Update category (admin)
├── search/
│   ├── GET    /         # Search tools
│   └── GET    /suggest  # Search suggestions
├── bookmarks/
│   ├── GET    /         # User's bookmarks
│   ├── POST   /         # Add bookmark
│   └── DELETE /:id      # Remove bookmark
└── analytics/
    ├── POST   /track    # Track usage event
    └── GET    /stats    # Get usage statistics (admin)
```

### Example API Responses
```typescript
// GET /api/v1/tools
interface ToolsResponse {
  data: Tool[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  filters: {
    category?: string;
    type?: string;
    status?: string;
  };
}

// GET /api/v1/tools/:id
interface ToolResponse {
  data: Tool & {
    category: Category;
    tags: Tag[];
    stats: {
      usage_count: number;
      last_verified: string;
    };
  };
}
```

## 🔐 Authentication & Authorization

### JWT-Based Authentication
```typescript
// JWT payload structure
interface JWTPayload {
  sub: string; // user ID
  email: string;
  role: 'admin' | 'moderator' | 'user';
  exp: number;
  iat: number;
}

// Role-based access control
const permissions = {
  admin: ['read', 'write', 'delete', 'manage_users'],
  moderator: ['read', 'write', 'verify_tools'],
  user: ['read', 'bookmark', 'suggest_tools']
};
```

### OAuth Integration
```typescript
// Supported OAuth providers
const oauthProviders = {
  github: {
    clientId: process.env.GITHUB_CLIENT_ID,
    scope: ['user:email']
  },
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID,
    scope: ['email', 'profile']
  }
};
```

## 📊 Caching Strategy

### Redis Caching Layers
```typescript
// Cache structure
const cacheKeys = {
  tools: {
    list: 'tools:list:{filters_hash}', // 15 minutes
    detail: 'tools:detail:{id}', // 1 hour
    count: 'tools:count', // 5 minutes
  },
  categories: {
    tree: 'categories:tree', // 1 hour
    list: 'categories:list', // 30 minutes
  },
  search: {
    results: 'search:{query_hash}', // 10 minutes
    suggestions: 'search:suggestions', // 1 hour
  }
};
```

## 🔍 Search Implementation

### Elasticsearch Integration (Future)
```javascript
// Search configuration
const searchConfig = {
  index: 'osint_tools',
  mappings: {
    properties: {
      name: { type: 'text', analyzer: 'standard' },
      description: { type: 'text', analyzer: 'english' },
      category: { type: 'keyword' },
      tags: { type: 'keyword' },
      url: { type: 'keyword' },
      type: { type: 'keyword' },
      status: { type: 'keyword' }
    }
  }
};
```

### PostgreSQL Full-Text Search (Phase 1)
```sql
-- Add search index
ALTER TABLE tools ADD COLUMN search_vector tsvector;

-- Update trigger for search index
CREATE OR REPLACE FUNCTION update_search_vector()
RETURNS trigger AS $$
BEGIN
  NEW.search_vector := 
    setweight(to_tsvector('english', coalesce(NEW.name,'')), 'A') ||
    setweight(to_tsvector('english', coalesce(NEW.description,'')), 'B');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Search query
SELECT * FROM tools 
WHERE search_vector @@ plainto_tsquery('english', 'social media analysis')
ORDER BY ts_rank(search_vector, plainto_tsquery('english', 'social media analysis')) DESC;
```

## 🚀 Deployment Architecture

### Development Environment
```yaml
# docker-compose.yml
version: '3.8'
services:
  frontend:
    build: ./frontend
    ports: ['3000:3000']
    volumes: ['./frontend:/app']
    
  backend:
    build: ./backend
    ports: ['8000:8000']
    environment:
      - DATABASE_URL=postgresql://user:pass@db:5432/osint
      - REDIS_URL=redis://redis:6379
    depends_on: [db, redis]
    
  db:
    image: postgres:15
    environment:
      POSTGRES_DB: osint
      POSTGRES_USER: user
      POSTGRES_PASSWORD: pass
    volumes: ['postgres_data:/var/lib/postgresql/data']
    
  redis:
    image: redis:7
    volumes: ['redis_data:/data']
```

### Production Deployment (Cloud)
```
┌─────────────────────────────────────┐
│            CDN (CloudFlare)         │
└─────────────────┬───────────────────┘
                  │
┌─────────────────┼───────────────────┐
│                 │  Load Balancer    │
└─────────────────┼───────────────────┘
                  │
┌─────────────────┼───────────────────┐
│  ┌─────────────┐│  ┌─────────────┐   │
│  │ Frontend    ││  │ Backend API │   │ 
│  │ (Static)    ││  │ (Containers)│   │
│  └─────────────┘│  └─────────────┘   │
└─────────────────┼───────────────────┘
                  │
┌─────────────────┼───────────────────┐
│  ┌─────────────┐│  ┌─────────────┐   │
│  │ PostgreSQL  ││  │    Redis    │   │
│  │ (Managed)   ││  │ (Managed)   │   │
│  └─────────────┘│  └─────────────┘   │
└─────────────────────────────────────┘
```

## 📈 Performance Considerations

### Database Optimization
```sql
-- Essential indexes
CREATE INDEX idx_tools_category ON tools(category_id);
CREATE INDEX idx_tools_status ON tools(status);
CREATE INDEX idx_tools_created ON tools(created_at);
CREATE INDEX idx_tool_usage_tool_date ON tool_usage(tool_id, accessed_at);
CREATE INDEX idx_search_vector ON tools USING gin(search_vector);
```

### API Performance
```typescript
// Response compression
app.use(compression());

// Rate limiting
const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

// Pagination
const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;
```

## 🧪 Testing Strategy

### Backend Testing
```typescript
// Test structure
tests/
├── unit/
│   ├── models/
│   ├── services/
│   └── utils/
├── integration/
│   ├── api/
│   └── database/
└── e2e/
    └── workflows/
```

### API Testing Example
```typescript
describe('Tools API', () => {
  it('should list tools with pagination', async () => {
    const response = await request(app)
      .get('/api/v1/tools?page=1&limit=10')
      .expect(200);
      
    expect(response.body.data).toHaveLength(10);
    expect(response.body.pagination.page).toBe(1);
  });
});
```

## 🔄 Migration Strategy

### Phase 1: API-Ready Frontend
1. Add API layer abstraction
2. Create mock API responses
3. Implement loading states
4. Add error handling

### Phase 2: Backend Implementation
1. Set up database and basic API
2. Migrate data from JSON to database
3. Implement authentication
4. Add admin panel

### Phase 3: Advanced Features
1. Add search and analytics
2. Implement caching
3. Add monitoring
4. Performance optimization

---

**Next Steps:**
1. Review and validate architecture decisions
2. Set up development environment
3. Begin Phase 1 implementation
4. Gather community feedback

**Architecture Review Date:** End of Q1 2025
