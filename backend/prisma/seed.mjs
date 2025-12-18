import 'dotenv/config';
import { PrismaClient } from '../.prisma/client/client.js';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import bcrypt from 'bcrypt';

const connectionString = process.env.DATABASE_URL;
// Parse connection string manually to avoid URL parsing issues
const url = new URL(connectionString);
const pool = new Pool({
  host: url.hostname,
  port: parseInt(url.port),
  database: url.pathname.slice(1), // Remove leading slash
  user: url.username,
  password: decodeURIComponent(url.password), // Decode URL-encoded password
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  // Hash passwords
  const adminPassword = await bcrypt.hash('adminpassword', 10);
  const userPassword = await bcrypt.hash('userpassword', 10);

  // Create admin user
  const admin = await prisma.user.create({
    data: {
      email: 'admin@example.com',
      password: adminPassword,
      role: 'admin'
    }
  });

  // Create normal user
  const user = await prisma.user.create({
    data: {
      email: 'user@example.com',
      password: userPassword,
      role: 'user'
    }
  });

  // Create sample tasks
  await prisma.task.create({
    data: {
      title: 'Complete project setup',
      description: 'Set up the initial project structure and dependencies',
      status: 'completed',
      createdBy: admin.id,
      assignedTo: user.id
    }
  });

  await prisma.task.create({
    data: {
      title: 'Implement user authentication',
      description: 'Add login and registration functionality',
      status: 'in_progress',
      createdBy: admin.id,
      assignedTo: user.id
    }
  });

  await prisma.task.create({
    data: {
      title: 'Design database schema',
      description: 'Create and validate the database models',
      status: 'pending',
      createdBy: user.id,
      assignedTo: admin.id
    }
  });

  console.log('Seeding completed successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });