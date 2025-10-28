import { pollSubmissionsTable, questionSubmissionsTable, questionsTable, usersTable } from "$lib/server/schemas.ts";
import { db } from "./server/db";
import { query, form, getRequestEvent, prerender } from '$app/server';
import { error } from '@sveltejs/kit'
import { getUser, verifyUser } from './auth.remote.ts';
import { type } from 'arktype';
import { eq, inArray } from 'drizzle-orm'

// This might be the worst code I've ever written
export const getQuestionProperties = query.batch(type("number"), async (questions) => {
    await verifyUser();

    const questionReturn = await db.select().from(questionsTable).where(inArray(questionsTable.id, questions));

    const mappedQuestions = new Map(questionReturn.map(q => [q.id, q]))

    return (question) => mappedQuestions.get(question)
})

export const createQuestionSubmission = form(type({
        submissions: [{
            questionAnswer: "string",
            questionID: "number",
    }]}),
    async (submissionRequest) => {
        console.log("Submitting!!!!")

        verifyUser();

        // I know the object can be null, it checks on the next line
        const userColumn = await db.select().from(usersTable).where(eq(usersTable.email, (await getUser()).email))
        if (!userColumn) return error(400, "Invalid email for poll submission");

        const pollSubmission = await db.insert(pollSubmissionsTable).values({
            author: userColumn[0].id,
            submitted: new Date(Date.now()).toISOString().split("T")[0]
        }).returning();

        let submissionList = [];
        for (const submission of Object.values(submissionRequest.submissions)) {
            if (!(await db.select().from(questionsTable).where(eq(questionsTable.id, submission.questionID)))) return error(400, "Invalid question ID");

            submissionList.push({
                questionAnswer: submission.questionAnswer,
                questionID: submission.questionID,
                submissionLink: pollSubmission[0].id
            })
        }

        return db.insert(questionSubmissionsTable).values(submissionList).returning();
    }
)

// Use prerender since questions won't change all that much, just remember to redeploy if questions are changed. <--- This could be an issue in deployment
export const getQuestions = prerender(async () => {
	return db.select().from(questionsTable)
})