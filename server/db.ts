
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '../shared/schema';

// Get database connection string from environment variable
const connectionString = process.env.DATABASE_URL!;

// Create connection
const client = postgres(connectionString);
export const db = drizzle(client, { schema });
