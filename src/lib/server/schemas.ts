import { integer, pgTable, varchar, text, timestamp, boolean } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    email: varchar('email', {length: 256}).notNull().unique(),
    passwordHashed: text('passwordHashed').notNull(),
    firstName: varchar('firstname', {length: 256}).notNull(),
    lastInitial: varchar('lastInitial', {length: 1}).notNull(),
    score: integer('score').default(0).notNull(),
		verified: boolean().default(false).notNull()
});

export const sessionsTable = pgTable("sessions", {
    id: text('id').primaryKey(),
    userID: integer('userID').references(() => usersTable.id).notNull(),
    expiresAt: timestamp('expiresAt').notNull(),
});