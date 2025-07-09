# Deployment Guide - OSINT Framework v2.0

This guide covers deployment strategies for the enhanced OSINT Framework v2.0 with its new database-driven architecture.

## 🏗️ Architecture Overview

**Frontend**: Vue 3 + TypeScript SPA  
**Backend**: KeystoneJS + PostgreSQL  
**API**: GraphQL with auto-generated schema  
**Database**: PostgreSQL with Prisma ORM  

## 🚀 Deployment Options

### Option 1: Development Environment (Local)

#### Prerequisites
- Node.js v18+
- PostgreSQL v15+
- Git

#### Setup Steps
```bash
# 1. Clone repository
git clone https://github.com/KhademOHAli1/OSINT-Framework.git
cd OSINT-Framework

# 2. Backend setup
cd backend
npm install

# 3. Database setup
createdb osint_framework
createdb osint_framework_shadow

# 4. Environment configuration
cp .env.example .env
# Edit .env with your database credentials

# 5. Run migrations and seed data
npm run migrate
npm run seed
npm run create-admin

# 6. Start backend
npm run dev

# 7. Frontend setup (new terminal)
cd ../frontend
npm install
cp .env.example .env
# Edit .env with backend URL

# 8. Start frontend
npm run dev
```

**Access Points:**
- Frontend: http://localhost:5173
- Backend API: http://localhost:3000/api/graphql
- Admin Panel: http://localhost:3000/admin

### Option 2: Docker Deployment

#### Docker Compose (Recommended)
```bash
# Clone and start
git clone https://github.com/KhademOHAli1/OSINT-Framework.git
cd OSINT-Framework

# Start all services
docker-compose up -d

# Create admin user
docker-compose exec backend npm run create-admin
```

**Docker Configuration:**
```yaml
version: '3.8'
services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: osint_framework
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  backend:
    build: ./backend
    environment:
      DATABASE_URL: postgresql://postgres:password@postgres:5432/osint_framework
      SHADOW_DATABASE_URL: postgresql://postgres:password@postgres:5432/osint_framework_shadow
    ports:
      - "3000:3000"
    depends_on:
      - postgres

  frontend:
    build: ./frontend
    environment:
      VITE_API_URL: http://localhost:3000/api/graphql
    ports:
      - "8080:80"
    depends_on:
      - backend

volumes:
  postgres_data:
```

### Option 3: Production Deployment

#### Cloud Platforms

**Vercel (Frontend) + Railway (Backend + Database):**
```bash
# Frontend deployment
cd frontend
npm run build
vercel deploy

# Backend deployment to Railway
# Connect GitHub repository to Railway
# Add environment variables in Railway dashboard
```

**Netlify (Frontend) + Heroku (Backend) + PostgreSQL:**
```bash
# Frontend build and deploy
cd frontend
npm run build
netlify deploy --prod

# Backend deploy to Heroku
cd backend
heroku create osint-framework-backend
heroku addons:create heroku-postgresql:hobby-dev
git push heroku master
```

## 🔐 Environment Configuration

### Backend Environment Variables (.env)
```bash
# Database Configuration
DATABASE_URL="postgresql://username:password@localhost:5432/osint_framework"
SHADOW_DATABASE_URL="postgresql://username:password@localhost:5432/osint_framework_shadow"

# KeystoneJS Configuration
SESSION_SECRET="your-session-secret-here"
ADMIN_EMAIL="admin@example.com"
ADMIN_PASSWORD="secure-admin-password"

# File Storage (optional)
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"

# Email Configuration (optional)
SMTP_HOST="smtp.example.com"
SMTP_PORT="587"
SMTP_USER="your-email@example.com"
SMTP_PASS="your-email-password"
```

### Frontend Environment Variables (.env)
```bash
# API Configuration
VITE_API_URL="http://localhost:3000/api/graphql"

# Optional: Analytics
VITE_GA_TRACKING_ID="GA-TRACKING-ID"

# Optional: Features flags
VITE_ENABLE_REVIEWS="true"
VITE_ENABLE_CONTRIBUTIONS="true"
```

## 📊 Database Management

### Migrations
```bash
# Run migrations
npm run migrate

# Reset database (development only)
npm run migrate:reset

# Generate new migration
npx prisma migrate dev --name description_of_changes
```

### Seeding
```bash
# Seed initial data
npm run seed

# Custom seeding
npm run seed:tools
npm run seed:categories
npm run seed:users
```

### Backup and Restore
```bash
# Backup database
pg_dump osint_framework > backup.sql

# Restore database
psql osint_framework < backup.sql
```

## 🔍 Monitoring and Maintenance

### Health Checks
```bash
# Backend health
curl http://localhost:3000/api/health

# Database connection
npm run db:check

# GraphQL endpoint
curl -X POST http://localhost:3000/api/graphql \
  -H "Content-Type: application/json" \
  -d '{"query":"{ __schema { types { name } } }"}'
```

### Logs and Debugging
```bash
# Backend logs
npm run logs

# Database logs
tail -f /var/log/postgresql/postgresql.log

# Docker logs
docker-compose logs -f backend
docker-compose logs -f postgres
```

### Performance Optimization
```bash
# Analyze database performance
npm run db:analyze

# GraphQL query analysis
npm run graphql:analyze

# Frontend bundle analysis
npm run build:analyze
```

## 🚨 Troubleshooting

### Common Issues

#### Database Connection Issues
```bash
# Check PostgreSQL service
systemctl status postgresql

# Verify database exists
psql -l | grep osint_framework

# Test connection
psql postgresql://username:password@localhost:5432/osint_framework
```

#### Migration Failures
```bash
# Check migration status
npx prisma migrate status

# Reset migrations (development only)
npx prisma migrate reset

# Manual migration
npx prisma db push
```

#### GraphQL Schema Issues
```bash
# Regenerate schema
npm run generate

# Check schema consistency
npm run schema:check

# Update Prisma client
npx prisma generate
```

### Error Solutions

**Error: "database does not exist"**
```bash
createdb osint_framework
createdb osint_framework_shadow
```

**Error: "migration failed"**
```bash
npx prisma migrate resolve --applied "20250709134910_init"
npm run migrate
```

**Error: "GraphQL endpoint not responding"**
```bash
# Check backend status
ps aux | grep node
netstat -tlnp | grep 3000
```

## 📈 Scaling Considerations

### Database Scaling
- **Read Replicas**: For read-heavy workloads
- **Connection Pooling**: Use PgBouncer for production
- **Indexing**: Optimize queries with proper indexes

### Application Scaling
- **Load Balancing**: Multiple backend instances
- **CDN**: Static asset delivery
- **Caching**: Redis for session and query caching

### Monitoring
- **Database**: PostgreSQL monitoring tools
- **Application**: APM tools (New Relic, DataDog)
- **Infrastructure**: Server monitoring and alerting

## 🔒 Security Checklist

### Production Security
- [ ] Environment variables secured
- [ ] Database credentials rotated
- [ ] HTTPS enabled for all endpoints
- [ ] Rate limiting implemented
- [ ] Input validation enabled
- [ ] File upload restrictions in place
- [ ] CORS properly configured
- [ ] Authentication tokens secured
- [ ] Admin access restricted
- [ ] Database backups encrypted

### Regular Maintenance
- [ ] Security updates applied
- [ ] Database maintenance scheduled
- [ ] Log rotation configured
- [ ] Backup verification performed
- [ ] Performance monitoring active
- [ ] Error tracking enabled

## 📞 Support

**Documentation**: [Enhanced Content System](./ENHANCED_CONTENT_SYSTEM.md)  
**Issues**: [GitHub Issues](https://github.com/KhademOHAli1/OSINT-Framework/issues)  
**Discussions**: [GitHub Discussions](https://github.com/KhademOHAli1/OSINT-Framework/discussions)

---

**Last Updated**: July 9, 2025 - v2.0.0 Release
