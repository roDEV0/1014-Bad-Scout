import { drizzle } from 'drizzle-orm/neon-http';

// @ts-ignore
const db = drizzle(process.env.DATABASE_URL);