import {
  boolean,
  date,
  integer,
  pgTable,
  primaryKey,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  email: varchar("email", { length: 256 }).notNull().unique(),
  passwordHashed: text("passwordHashed").notNull(),
  firstName: varchar("firstname", { length: 256 }).notNull(),
  lastName: varchar("lastName", { length: 256 }).notNull(),
  score: integer("score").default(0).notNull(),
  verified: boolean().default(false).notNull(),
  admin: boolean().default(false).notNull(),
});

export const sessionsTable = pgTable("sessions", {
  id: text("id").primaryKey(),
  userID: integer("userID")
    .references(() => usersTable.id, { onDelete: "cascade" })
    .notNull(),
  expiresAt: timestamp("expiresAt").notNull(),
});

export const pollSubmissionsTable = pgTable("submissions", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  author: integer("author")
    .references(() => usersTable.id, { onDelete: "cascade" })
    .notNull(),
  submitted: date("submitted").notNull(),
});

export const questionSubmissionsTable = pgTable(
  "question_submissions",
  {
    questionAnswer: text("questionAnswer").notNull(),
    questionID: integer("questionID")
      .references(() => questionsTable.id, { onDelete: "cascade" })
      .notNull(),
    submissionLink: integer("submissionLink")
      .references(() => pollSubmissionsTable.id, {
        onDelete: "cascade",
      })
      .notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.questionID, table.submissionLink] }),
  ],
);

export const questionsTable = pgTable("questions", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  year: integer("year").notNull(),
  questionText: text("questionText").notNull(),
  answerFormat: varchar("answerFormat", { length: 256 }).notNull(),
});

export const unverifiedUsers = pgTable("unverified_users", {
  userId: integer("user_id")
    .references(() => usersTable.id, { onDelete: "cascade" })
    .primaryKey(),
  code: text(),
});
