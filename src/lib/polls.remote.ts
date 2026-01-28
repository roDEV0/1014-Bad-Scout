import { getRequestEvent, prerender, query } from "$app/server";
import {
  pollSubmissionsTable,
  questionSubmissionsTable,
  questionsTable,
} from "$lib/server/schemas.ts";
import { error } from "@sveltejs/kit";
import { type } from "arktype";
import { eq, inArray } from "drizzle-orm";
import { db } from "./server/db";
import { guardedForm, guardedQuery } from "./server/guarded";

// This might be the worst code I've ever written
export const getQuestionProperties = query.batch(
  type("number"),
  async (questions) => {
    const event = getRequestEvent();
    if (!event.locals.user) return error(403);

    const questionReturn = await db
      .select()
      .from(questionsTable)
      .where(inArray(questionsTable.id, questions));

    const mappedQuestions = new Map(questionReturn.map((q) => [q.id, q]));

    return (question) => mappedQuestions.get(question);
  },
);

export const createQuestionSubmission = guardedForm(
  type({ "[string]": type("string | string[]") }),
  async (submissionRequest, { user }) => {
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
        submissionLink: pollSubmission[0].id,
      }));

    if (submissionList.length === 0) {
      await db
        .delete(pollSubmissionsTable)
        .where(eq(pollSubmissionsTable.id, pollSubmission[0].id));
      return [];
    }

    return db
      .insert(questionSubmissionsTable)
      .values(submissionList)
      .returning();
  },
);

export const getQuestions = guardedQuery(async () => {
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
