import { drizzle } from 'drizzle-orm/neon-http';

// @ts-ignore
export const db = drizzle(process.env.DATABASE_URL);