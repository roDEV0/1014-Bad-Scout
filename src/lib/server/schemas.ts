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
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    questionAnswer: json('answer').notNull(),
    question: integer('question').references(() => questionsTable.id).notNull(),
    submissionID: integer('submissionID').references(() => pollSubmissionsTable.id).notNull(),
});

export const questionsTable = pgTable("questions", {
    id: integer('id').notNull().primaryKey(),
    year: integer('year').notNull(),
    question: text('question').notNull(),
    answerFormat: varchar('answer_format', {length: 256}).notNull(),
});