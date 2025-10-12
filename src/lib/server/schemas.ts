import { integer, pgTable, varchar, text, timestamp } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    email: varchar('email', {length: 256}).notNull().unique(),
    passwordHashed: text('passwordHashed').notNull(),
    firstname: varchar('firstname', {length: 256}).notNull(),
    lastInitial: varchar('lastInitial', {length: 1}).notNull(),
    score: integer('score').default(0),
});

export const sessionsTable = pgTable("sessions", {
    id: integer('id').primaryKey(),
    userID: integer('userID').references(() => usersTable.id).notNull(),
    secretKey: text('secretKey').notNull(),
    dateCreated: timestamp('dateCreated').defaultNow().notNull(),
    expiresAt: timestamp('expiresAt').notNull(),
    token: text('token').notNull(),
});