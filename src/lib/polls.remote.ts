import {
  pollSubmissionsTable,
  questionSubmissionsTable,
  questionsTable,
  usersTable,
} from "$lib/server/schemas.ts";
import { db } from "./server/db";
import { query, form, getRequestEvent, prerender } from "$app/server";
import { error } from "@sveltejs/kit";
import { getUser, verifyUser } from "./auth.remote.ts";
import { type } from "arktype";
import { eq, inArray } from "drizzle-orm";

// This might be the worst code I've ever written
export const getQuestionProperties = query.batch(
  type("number"),
  async (questions) => {
    await verifyUser();

    const questionReturn = await db
      .select()
      .from(questionsTable)
      .where(inArray(questionsTable.id, questions));

    const mappedQuestions = new Map(questionReturn.map((q) => [q.id, q]));

    return (question) => mappedQuestions.get(question);
  },
);

export const createQuestionSubmission = form(
    type({"[string]": type("string | string[]"),}),
  async (submissionRequest) => {
    const user = await verifyUser();

    const pollSubmission = await db
      .insert(pollSubmissionsTable)
      .values({
        author: user.id,
        submitted: new Date(Date.now()).toISOString().split("T")[0],
      })
      .returning();

    let questions = await getQuestionsId();

		// takes submissions, includes ones with valid question ids, then adds the submission id to them
  let submissionList = Object.entries(submissionRequest)
      .filter(([id]) => Object.keys(questions).map(Number).includes(+id))
      .map(([id, answer]) => ({
          questionAnswer: Array.isArray(answer) ? answer.join(",") : answer,
          questionID: +id,
          submissionLink: pollSubmission[0].id
      }));

	if (submissionList.length === 0) {
		await db.delete(pollSubmissionsTable).where(eq(pollSubmissionsTable.id, pollSubmission[0].id));
		return [];
	}

    return db
      .insert(questionSubmissionsTable)
      .values(submissionList)
      .returning();
  },
);

// Use prerender since questions won't change all that much, just remember to redeploy if questions are changed. <--- This could be an issue in deployment
export const getQuestions = prerender(async () => {
  return db.select().from(questionsTable);
});

export const getQuestionsId = prerender(async () => {
  const elements = await getQuestions();
  return elements.reduce((acc: { [e: number]: any }, cur) => {
    let { id: _, ...obj } = cur;
    acc[cur.id] = obj;
    return acc;
  }, {}) as { [id: number]: Omit<(typeof elements)[number], "id"> };
});
