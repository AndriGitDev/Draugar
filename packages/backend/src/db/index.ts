import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';

// Create connection pool with DATABASE_URL from environment
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is required');
}

const pool = new Pool({
  connectionString,
});

// Create Drizzle ORM instance with schema for type-safe queries
export const db = drizzle(pool, { schema });

// Re-export schema for convenience
export * from './schema';
