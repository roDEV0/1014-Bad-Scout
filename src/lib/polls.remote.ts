import { pollSubmissionsTable, questionSubmissionsTable, questionsTable, usersTable } from "$lib/server/schemas.ts";
import { db } from "./server/db";
import { query, form, getRequestEvent } from '$app/server';
import { error } from '@sveltejs/kit'
import { verifyUserExists, verifyUser } from './auth.remote.ts';
import { type } from 'arktype';
import { eq } from 'drizzle-orm'
import { randomUUID } from 'crypto';

export const getQuestionProperties = query(type("string.integer"), async (QID) => {
    verifyUser();

    const question = (await db.select().from(questionsTable).where(eq(questionsTable.id, Number(QID))));
    if (!question) return null;

    return {
        year: question[0].year,
        question: question[0].question,
        answerFormat: question[0].answerFormat,
    };
})

// Turns out these have to be queries, not forms... That's for future me though

export const createPollSubmission = form(
    type({
        id: "number",
        author: "number",
        submitted: "string.date",
    }),
    async ({ id, author, submitted}) => {
        verifyUser();

        const user = (await db.select().from(usersTable).where(eq(usersTable.id, author)));

        if (!user) return error(400, "Invalid author for poll submission");

        const date = new Date(Date.now()).toISOString().split("T")[0];
        const submission = await db.insert(pollSubmissionsTable).values({
            author: author,
            submitted: date
        }).returning();

        return submission[0];
    });

export const createQuestionSubmission = form(type({
        id: "number",
        questionAnswer: "string",
        question: "number",
        submissionID: "number",
    }),
    async ({ id, questionAnswer, question, submissionID }) => {
        verifyUser();

        let parsedAnswer;
        try { parsedAnswer = JSON.parse(questionAnswer) } catch (problem) { return error(400, "Invalid format for question answer"); }
        if (!(await db.select().from(questionsTable).where(eq(questionsTable.id, question)))) return error(400, "Invalid question ID");
        if (!(await db.select().from(questionSubmissionsTable).where(eq(questionSubmissionsTable.id, submissionID)))) return error(400, "Invalid submission ID");

        const submission = await db.insert(questionSubmissionsTable).values({
            questionAnswer: parsedAnswer,
            question: question,
            submissionID: submissionID
        }).returning();

        return submission[0];
    }
)