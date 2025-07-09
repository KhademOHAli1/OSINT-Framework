import { getContext } from '@keystone-6/core/context';
import config from '../keystone';
import * as PrismaModule from '@prisma/client';

async function createAdminUser() {
  const context = getContext(config, PrismaModule);
  
  try {
    // Check if any users exist
    const existingUsers = await context.query.User.findMany();
    
    if (existingUsers.length > 0) {
      console.log('Users already exist in the database');
      console.log('Existing users:', existingUsers.map(u => ({ name: u.name, email: u.email })));
      return;
    }

    // Create admin user with Keystone's proper password hashing
    const adminUser = await context.query.User.createOne({
      data: {
        name: 'Admin User',
        email: 'admin@osintframework.com',
        password: 'admin123',
        role: 'admin',
        isActive: true,
      },
    });

    console.log('Admin user created successfully:', {
      name: adminUser.name,
      email: adminUser.email,
      role: adminUser.role
    });
    
    console.log('\nYou can now sign in with:');
    console.log('Email: admin@osintframework.com');
    console.log('Password: admin123');
    
  } catch (error) {
    console.error('Error creating admin user:', error);
  }
}

createAdminUser()
  .then(() => {
    console.log('Script completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Script failed:', error);
    process.exit(1);
  });
