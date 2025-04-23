import { drizzle } from 'drizzle-orm/neon-serverless';
import { migrate } from 'drizzle-orm/neon-serverless/migrator';
import { Pool, neonConfig } from '@neondatabase/serverless';
import ws from 'ws';
import * as schema from '../shared/schema';

// This script programmatically initializes the database schema
async function main() {
  neonConfig.webSocketConstructor = ws;

  if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL environment variable is not set. Please set it before running migrations.');
    process.exit(1);
  }

  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const db = drizzle(pool);
  
  console.log('Creating database schema...');
  
  try {
    // Create tables directly without using migrations
    await db.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        credits INTEGER NOT NULL DEFAULT 1,
        subscription_expires_at TIMESTAMP
      );
      
      CREATE TABLE IF NOT EXISTS purchases (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        bundle_id INTEGER NOT NULL,
        amount INTEGER NOT NULL,
        date TIMESTAMP NOT NULL DEFAULT NOW(),
        status TEXT NOT NULL DEFAULT 'completed'
      );
      
      CREATE TABLE IF NOT EXISTS gradings (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        essay_text TEXT NOT NULL,
        rubric_id INTEGER NOT NULL,
        scores TEXT NOT NULL,
        feedback TEXT NOT NULL,
        recommendations TEXT NOT NULL,
        date TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `);
    
    console.log('Database schema created successfully!');
  } catch (error) {
    console.error('Error creating database schema:', error);
    process.exit(1);
  }
  
  await pool.end();
}

main().catch((err) => {
  console.error('Error in migration script:', err);
  process.exit(1);
});