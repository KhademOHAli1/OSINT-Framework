# Frontend-Backend Integration Guide

This guide explains how to integrate the Vue 3 frontend with the KeystoneJS backend.

## 🔌 GraphQL Integration

### 1. Install Apollo Client

```bash
cd frontend
npm install @apollo/client graphql
```

### 2. Create GraphQL Client

```typescript
// frontend/src/api/client.ts
import { ApolloClient, InMemoryCache, HttpLink, from } from '@apollo/client/core';
import { onError } from '@apollo/client/link/error';

const httpLink = new HttpLink({
  uri: 'http://localhost:4000/api/graphql',
  credentials: 'include', // Include cookies for authentication
});

const errorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }) =>
      console.error(`GraphQL error: Message: ${message}, Location: ${locations}, Path: ${path}`)
    );
  }
  if (networkError) {
    console.error(`Network error: ${networkError}`);
  }
});

export const apolloClient = new ApolloClient({
  link: from([errorLink, httpLink]),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      errorPolicy: 'all',
    },
    query: {
      errorPolicy: 'all',
    },
  },
});
```

### 3. Vue Apollo Plugin

```typescript
// frontend/src/main-vue.ts
import { createApp, provide, h } from 'vue';
import { DefaultApolloClient } from '@vue/apollo-composable';
import { apolloClient } from './api/client';
import App from './App.vue';

const app = createApp({
  setup() {
    provide(DefaultApolloClient, apolloClient);
  },
  render: () => h(App),
});

app.mount('#app');
```

## 📊 Data Fetching Examples

### 1. Fetch All Tools

```typescript
// frontend/src/composables/useTools.ts
import { useQuery } from '@vue/apollo-composable';
import gql from 'graphql-tag';

const GET_TOOLS = gql`
  query GetTools($limit: Int) {
    tools(take: $limit, where: { status: { equals: "active" } }) {
      id
      name
      description
      url
      type
      rating
      usageCount
      categories {
        id
        name
        color
      }
      tags {
        id
        name
        color
      }
    }
  }
`;

export function useTools(limit = 100) {
  const { result, loading, error, refetch } = useQuery(GET_TOOLS, { limit });
  
  const tools = computed(() => result.value?.tools ?? []);
  
  return {
    tools,
    loading,
    error,
    refetch,
  };
}
```

### 2. Search Functionality

```typescript
// frontend/src/composables/useSearch.ts
import { useLazyQuery } from '@vue/apollo-composable';
import gql from 'graphql-tag';

const SEARCH_TOOLS = gql`
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
`;

export function useSearch() {
  const { load, result, loading } = useLazyQuery(SEARCH_TOOLS);
  
  const searchResults = computed(() => result.value?.searchTools ?? []);
  
  const search = (query: string, limit = 20) => {
    if (query.trim()) {
      load(SEARCH_TOOLS, { query, limit });
    }
  };
  
  return {
    search,
    searchResults,
    loading,
  };
}
```

### 3. Popular Tools

```typescript
// frontend/src/composables/usePopularTools.ts
import { useQuery } from '@vue/apollo-composable';
import gql from 'graphql-tag';

const GET_POPULAR_TOOLS = gql`
  query GetPopularTools($limit: Int) {
    popularTools(limit: $limit) {
      id
      name
      description
      url
      usageCount
      rating
      categories {
        name
        color
      }
    }
  }
`;

export function usePopularTools(limit = 10) {
  const { result, loading, error } = useQuery(GET_POPULAR_TOOLS, { limit });
  
  const popularTools = computed(() => result.value?.popularTools ?? []);
  
  return {
    popularTools,
    loading,
    error,
  };
}
```

## 🔄 Mutations (User Actions)

### 1. Track Tool Usage

```typescript
// frontend/src/composables/useAnalytics.ts
import { useMutation } from '@vue/apollo-composable';
import gql from 'graphql-tag';

const TRACK_TOOL_USAGE = gql`
  mutation TrackToolUsage($toolId: ID!, $sessionId: String) {
    trackToolUsage(toolId: $toolId, sessionId: $sessionId) {
      id
      timestamp
    }
  }
`;

export function useAnalytics() {
  const { mutate: trackUsage } = useMutation(TRACK_TOOL_USAGE);
  
  const trackToolClick = async (toolId: string) => {
    try {
      await trackUsage({
        toolId,
        sessionId: getSessionId(), // Implement session ID generation
      });
    } catch (error) {
      console.error('Failed to track usage:', error);
    }
  };
  
  return {
    trackToolClick,
  };
}

function getSessionId(): string {
  let sessionId = localStorage.getItem('sessionId');
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    localStorage.setItem('sessionId', sessionId);
  }
  return sessionId;
}
```

### 2. Submit Tool Review

```typescript
// frontend/src/composables/useReviews.ts
import { useMutation } from '@vue/apollo-composable';
import gql from 'graphql-tag';

const SUBMIT_REVIEW = gql`
  mutation SubmitReview($toolId: ID!, $rating: Int!, $title: String, $content: String) {
    submitToolReview(toolId: $toolId, rating: $rating, title: $title, content: $content) {
      id
      rating
      title
      content
      user {
        name
      }
    }
  }
`;

export function useReviews() {
  const { mutate: submitReview, loading: submitting } = useMutation(SUBMIT_REVIEW);
  
  const submitToolReview = async (data: {
    toolId: string;
    rating: number;
    title?: string;
    content?: string;
  }) => {
    try {
      const result = await submitReview(data);
      return result?.data?.submitToolReview;
    } catch (error) {
      console.error('Failed to submit review:', error);
      throw error;
    }
  };
  
  return {
    submitToolReview,
    submitting,
  };
}
```

## 🌳 Tree Data Conversion

### Convert GraphQL Data to Tree Format

```typescript
// frontend/src/utils/dataConverter.ts
import type { Tool, Category } from '../types';

interface GraphQLTool {
  id: string;
  name: string;
  description: string;
  url: string;
  categories: Array<{ id: string; name: string; }>;
}

interface GraphQLCategory {
  id: string;
  name: string;
  description: string;
  subCategories: GraphQLCategory[];
  tools: GraphQLTool[];
}

export function convertToTreeFormat(categories: GraphQLCategory[]): any {
  return {
    name: "OSINT Framework",
    children: categories.map(convertCategory)
  };
}

function convertCategory(category: GraphQLCategory): any {
  const children = [
    ...category.subCategories.map(convertCategory),
    ...category.tools.map(tool => ({
      name: tool.name,
      type: "url",
      url: tool.url,
      description: tool.description,
    }))
  ];
  
  return {
    name: category.name,
    type: "category",
    description: category.description,
    children: children.length > 0 ? children : undefined,
  };
}
```

## 🔧 Environment Configuration

### Frontend Environment Variables

```env
# frontend/.env
VITE_API_URL=http://localhost:4000/api/graphql
VITE_WS_URL=ws://localhost:4000/api/graphql
VITE_ENABLE_ANALYTICS=true
```

### Use in Vue App

```typescript
// frontend/src/config/index.ts
export const config = {
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:4000/api/graphql',
  wsUrl: import.meta.env.VITE_WS_URL || 'ws://localhost:4000/api/graphql',
  enableAnalytics: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
};
```

## 🔄 Data Migration Strategy

### Phase 1: Hybrid Mode (Current + Backend)
- Keep existing JSON data as fallback
- Gradually migrate features to use GraphQL
- Implement feature flags for A/B testing

### Phase 2: Full Migration
- Replace all data sources with GraphQL
- Remove JSON file dependencies
- Implement real-time updates

### Implementation Example

```typescript
// frontend/src/composables/useHybridData.ts
import { ref, computed } from 'vue';
import { useTools as useGraphQLTools } from './useTools';
import jsonData from '../data/tools.json';

export function useHybridData() {
  const useBackend = ref(true); // Feature flag
  
  const { tools: graphqlTools, loading: graphqlLoading } = useGraphQLTools();
  const jsonTools = ref(jsonData);
  
  const tools = computed(() => {
    return useBackend.value ? graphqlTools.value : jsonTools.value;
  });
  
  const loading = computed(() => {
    return useBackend.value ? graphqlLoading.value : false;
  });
  
  return {
    tools,
    loading,
    useBackend,
  };
}
```

## 🚀 Deployment Considerations

### Development
- Frontend: `npm run dev` (Port 3000)
- Backend: `npm run dev` (Port 4000)
- CORS configured for local development

### Production
- Frontend: Build and serve static files
- Backend: KeystoneJS production mode
- Reverse proxy (Nginx) for unified domain
- Environment-specific GraphQL endpoints

### Docker Deployment
```yaml
# docker-compose.yml (updated)
version: '3.8'
services:
  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    environment:
      - VITE_API_URL=http://backend:4000/api/graphql
    depends_on:
      - backend
  
  backend:
    # ... existing backend config
```

---

This integration allows the frontend to gradually transition from JSON-based data to a dynamic, database-driven system with real-time capabilities and user management.
