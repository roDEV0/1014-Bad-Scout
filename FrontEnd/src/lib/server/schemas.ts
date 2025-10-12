import { drizzle } from 'drizzle-orm/neon-http';
import { integer, pgTable, varchar, text } from "drizzle-orm/pg-core";

const db = drizzle(process.env.DATABASE_URL!);

export const usersTable = pgTable("users", {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    email: varchar('email', {length: 256}).notNull().unique(),
    passwordHashed: text('passwordHashed').notNull(),
    firstname: varchar('firstname', {length: 256}).notNull(),
    lastInitial: varchar('lastInitial', {length: 1}).notNull(),
    score: integer('score').default(0),
});