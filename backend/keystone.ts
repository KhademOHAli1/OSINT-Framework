import { config } from '@keystone-6/core';
import { lists } from './schema';
import { withAuth, session } from './auth';
import { extendedSchema } from './src/graphql-extensions';

const databaseURL = process.env.DATABASE_URL || 'postgresql://username:password@localhost:5432/osint_framework';

export default withAuth(
  config({
    db: {
      provider: 'postgresql',
      url: databaseURL,
      onConnect: async context => {
        console.log('Connected to database');
      },
      // Enable logging in development
      enableLogging: process.env.NODE_ENV === 'development',
      // Database connection pooling
      prismaClientPath: './node_modules/.prisma/client'
    },
    lists,
    session,
    extendGraphqlSchema: extendedSchema,
    server: {
      cors: {
        origin: [
          'http://localhost:3000',
          'http://localhost:5173',
          'https://khademohali1.github.io',
          process.env.FRONTEND_URL || 'http://localhost:3000'
        ],
        credentials: true,
      },
      port: process.env.PORT ? parseInt(process.env.PORT) : 4000,
      maxFileSize: 200 * 1024 * 1024, // 200MB
    },
    graphql: {
      playground: process.env.NODE_ENV === 'development',
      apolloConfig: {
        introspection: process.env.NODE_ENV === 'development',
      },
    },
    ui: {
      isAccessAllowed: (context) => !!context.session?.data,
    },
    images: {
      upload: 'local',
      local: {
        storagePath: 'public/images',
        baseUrl: '/images',
      },
    },
  })
);
