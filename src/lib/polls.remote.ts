import { pollSubmissionsTable, questionSubmissionsTable, questionsTable, usersTable } from "$lib/server/schemas.ts";
import { db } from "./server/db";
import { query, form, getRequestEvent } from '$app/server';
import { error } from '@sveltejs/kit'
import { verifyUserExists, verifyUser } from './auth.remote.ts';
import { type } from 'arktype';
import { eq, inArray } from 'drizzle-orm'

// This might be the worst code I've ever written
export const getQuestionProperties = query.batch(type("number"), async (questions) => {
    verifyUser();

    let questionArray = questions.map(Number);

    const questionReturn = await db.select().from(questionsTable).where(inArray(questionsTable.id, questionArray));
    const mappedQuestions = new Map(questionReturn.map(q => [q.id, q]))

    return (question) => mappedQuestions.get(question)
})

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
        submissions: {
            id: "number",
            questionAnswer: "string",
            question: "number",
            submissionID: "number",
    }}),
    async (submissionRequest) => {
        verifyUser();

        let submissionList = [];
        for (const submission of [submissionRequest.submissions]) {
            let parsedAnswer;
            try { parsedAnswer = JSON.parse(submission.questionAnswer) } catch (problem) { return error(400, "Invalid format for question answer"); }
            if (!(await db.select().from(questionsTable).where(eq(questionsTable.id, submission.question)))) return error(400, "Invalid question ID");
            if (!(await db.select().from(questionSubmissionsTable).where(eq(questionSubmissionsTable.id, submission.submissionID)))) return error(400, "Invalid submission ID");

            submissionList.push({
                questionAnswer: parsedAnswer,
                question: submission.question,
                submissionID: submission.submissionID,
            })
        }

        return db.insert(questionSubmissionsTable).values(submissionList).returning();
    }
)