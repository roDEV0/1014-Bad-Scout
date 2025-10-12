import { drizzle } from 'drizzle-orm/neon-http';
import { DATABASE_URL } from '$env/static/private';

<<<<<<< HEAD
export const db = drizzle(DATABASE_URL);
=======
// @ts-ignore
export const db = drizzle(process.env.DATABASE_URL);
>>>>>>> d16d17badebdd4533a7f07538d8383b97a78f43c
