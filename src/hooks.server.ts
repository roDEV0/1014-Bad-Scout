import { getUserSession } from "$lib/server/auth";
import { db } from "$lib/server/db";
import { sessionsTable } from "$lib/server/schemas";
import type { Handle, HandleValidationError } from "@sveltejs/kit";
import { eq } from "drizzle-orm";

const DAY_IN_MS = 1000 * 60 * 60 * 24;

export const handle: Handle = async ({ event, resolve }) => {
  const token = event.cookies.get("session");
  if (!token) return resolve(event);

  const result = await getUserSession(token);
  if (!result) return resolve(event);

  const { session, user } = result;

  const sessionExpired = Date.now() >= session.expiresAt.getTime();
  if (sessionExpired) {
    await db.delete(sessionsTable).where(eq(sessionsTable, session.id));
    return resolve(event);
  }

  const renewSession =
    Date.now() >= session.expiresAt.getTime() - DAY_IN_MS * 15;

  if (renewSession) {
    session.expiresAt = new Date(Date.now() + DAY_IN_MS * 30);
    await db
      .update(sessionsTable)
      .set({ expiresAt: session.expiresAt })
      .where(eq(sessionsTable.id, session.id));
  }

  event.locals.user = {
    id: user.id,
    email: user.email,
    name: user.firstName,
    lastName: user.lastName,
    score: user.score,
    verified: user.verified,
    admin: user.admin,
  };

  return resolve(event);
};

export const handleValidationError: HandleValidationError = ({
  event,
  issues,
}) => {
  console.log(event);
  return {
    message: "Nice try, hacker!",
  };
};
