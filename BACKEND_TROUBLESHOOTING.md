# Backend Troubleshooting Guide

## Quick Fix: Frontend is now working with static data fallback! 🎉

The frontend has been updated to automatically fallback to static JSON data when the GraphQL backend is not available. This means the tree visualization should work immediately.

## Current Status

### ✅ **Frontend Working**
- **URL**: http://localhost:3000
- **Status**: Running with static data fallback
- **Features**: Full tree visualization, search, tool information

### ⚠️ **Backend Setup Needed**
- **URL**: http://localhost:4000 (when running)
- **Status**: Needs configuration
- **Features**: Enhanced content, user management, GraphQL API

## Backend Setup Steps

### 1. Quick Test (Static Data)
Your frontend should now work with the existing OSINT tools data:
```bash
# The frontend is already running on:
# http://localhost:3000
```

### 2. Backend Setup (For Enhanced Features)
```bash
cd /Users/ali/OSINT-Framework/backend

# 1. Ensure PostgreSQL is running
brew services start postgresql

# 2. Create databases if needed
createdb osint_framework
createdb osint_framework_shadow

# 3. Run migrations
npx prisma migrate deploy

# 4. Generate Prisma client  
npx prisma generate

# 5. Start the backend
npm run dev
```

### 3. Environment Configuration
Ensure your `.env` file has the correct database URLs:
```bash
DATABASE_URL="postgresql://ali@localhost:5432/osint_framework"
SHADOW_DATABASE_URL="postgresql://ali@localhost:5432/osint_framework_shadow"
SESSION_SECRET="your-secret-key-here-change-in-production"
```

## Common Issues & Solutions

### Issue: "EADDRINUSE" (Port 4000 in use)
```bash
# Find and kill the process using port 4000
lsof -i :4000
kill [PID]

# Or use a different port in keystone.ts
```

### Issue: "Database connection failed"
```bash
# Check PostgreSQL status
brew services list | grep postgresql

# Restart PostgreSQL if needed
brew services restart postgresql

# Test connection
psql postgres -c "SELECT version();"
```

### Issue: "Prisma migration errors"
```bash
# Reset migrations (development only)
npx prisma migrate reset

# Apply existing migrations
npx prisma migrate deploy

# Generate Prisma client
npx prisma generate
```

## Data Seeding (Optional)

To populate the backend with initial data:
```bash
cd /Users/ali/OSINT-Framework/backend

# Run seeding script
npm run seed

# Create admin user
npm run create-admin
```

## Accessing Services

### Frontend (Always Available)
- **URL**: http://localhost:3000
- **Features**: Tree visualization, search, tool browsing
- **Data Source**: Static JSON (with GraphQL fallback)

### Backend Admin (When Backend Running)
- **URL**: http://localhost:4000/admin
- **Features**: Content management, user management
- **Login**: Use credentials from create-admin script

### GraphQL Playground (When Backend Running)
- **URL**: http://localhost:4000/api/graphql
- **Features**: API testing, schema exploration

## Current Fallback Behavior

The frontend now works in a hybrid mode:

1. **Tries GraphQL** - If backend is running on port 4000
2. **Falls back to JSON** - If backend is not available
3. **Seamless experience** - User doesn't see the difference

This means you can:
- ✅ Use the full OSINT Framework immediately with static data
- ✅ Browse all 1,104 tools across 190 categories  
- ✅ Search and filter tools
- ✅ View tool information and links
- ⚠️ Enhanced features (guides, reviews, learning paths) require backend

## Next Steps

1. **Immediate Use**: Visit http://localhost:3000 - the framework should work now!
2. **Enhanced Setup**: Follow backend setup steps for full v2.0 features
3. **Development**: Both frontend and backend can run simultaneously

---

**The OSINT Framework is now functional with static data! 🎉**
*Enhanced features will be available once the backend is configured.*
