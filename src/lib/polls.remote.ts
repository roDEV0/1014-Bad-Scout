import { pollSubmissionsTable, questionSubmissionsTable, questionsTable, usersTable } from "$lib/server/schemas.ts";
import { db } from "./server/db";
import { query, form, getRequestEvent } from '$app/server';
import { error } from '@sveltejs/kit'
import { verifyUser } from './auth.remote.ts';
import { type } from 'arktype';
import { eq } from 'drizzle-orm'
import { randomUUID } from 'crypto';

export const getQuestionProperties = query(type("string.integer"), async (QID) => {
    const question = (await db.select().from(questionsTable).where(eq(questionsTable.id, Number(QID))));
    if (!question) return null;

    return {
        year: question[0].year,
        question: question[0].question,
        answerFormat: question[0].answerFormat,
    };
})

export const createPollSubmission = form(
    type({
        id: "number",
        author: "number",
        submitted: "string.date",
    }),
    async ({ id, author, submitted}) => {
        const user = (await db.select().from(usersTable).where(eq(usersTable.id, author)));

        if (!user) return error(400, "Invalid author for poll submission");

        const date = new Date(Date.now()).toISOString().split("T")[0];
        const submission = await db.insert(pollSubmissionsTable).values({
            author: author,
            submitted: date
        }).returning();

        return submission[0];
    });

// TODO: Weird issue where it doesn't like passing in JSON objects

// export const createQuestionSubmission = form(
//     type({
//         id: "number",
//         questionAnswer: "object",
//         question: "number",
//         submissionID: "number",
//     }),
//     async ({ id, questionAnswer, question, submissionID}) => {
//         const questionReference = (await db.select().from(questionsTable).where(eq(questionsTable.id, Number(question))));
//         const submissionReference = (await db.select().from(pollSubmissionsTable).where(eq(pollSubmissionsTable.id, Number(submissionID))));
//
//         if (!questionReference || !questionReference[0] || !submissionReference || !submissionReference[0])
//             return error(400, "Invalid Submission ID or Question ID");
//
//         const questionSubmission = await db.insert(questionSubmissionsTable).values({
//             questionAnswer: questionAnswer,
//             question: question,
//             submissionID: submissionID
//         }).returning();
//
//         return questionSubmission[0];
//     }
// );