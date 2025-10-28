import { integer, pgTable, varchar, text, timestamp, boolean, json, date } from "drizzle-orm/pg-core";
import { relations } from 'drizzle-orm';

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

export const pollSubmissionsTable = pgTable("submissions", {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    author: integer('author').references(() => usersTable.id).notNull(),
    submitted: date('submitted').notNull(),
});

export const questionSubmissionsTable = pgTable("question_submissions", {
    questionAnswer: text('questionAnswer').notNull(),
    questionID: integer('questionID').references(() => questionsTable.id).notNull(),
    submissionLink: integer('submissionLink').references(() => pollSubmissionsTable.id).notNull(),
});

export const questionsTable = pgTable("questions", {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    year: integer('year').notNull(),
    questionText: text('questionText').notNull(),
    answerFormat: varchar('answerFormat', {length: 256}).notNull(),
});