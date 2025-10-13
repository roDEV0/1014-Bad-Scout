import { hash, verify } from "@node-rs/argon2";
import { form, getRequestEvent, query } from "$app/server";
import { type } from "arktype";
import { db } from "./db";
import { sessionsTable, usersTable } from "./schemas";
import { eq } from "drizzle-orm";
import { fail, redirect, type RequestEvent } from "@sveltejs/kit";
import { encodeBase64url, encodeHexLowerCase } from "@oslojs/encoding";
import { sha256 } from "@oslojs/crypto/sha2";

const DAY_IN_MS = 1000 * 60 * 60 * 24;

async function generateSession(userID: number, event: RequestEvent) {
  const bytes = crypto.getRandomValues(new Uint8Array(18));
  const token = encodeBase64url(bytes);

  const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
  const expiresAt = new Date(Date.now() + DAY_IN_MS * 30);
  const session: typeof sessionsTable.$inferSelect = {
    id: sessionId,
    userID,
    expiresAt,
  };

  await db.insert(sessionsTable).values(session);

  event.cookies.set("session", token, {
    expires: expiresAt,
    path: "/",
  });
}

export const login = form(
  type({
    email: "string",
    password: "string",
    "redirect_url?": "string",
  }),
  async ({ email, password, redirect_url }) => {
    // If the schema is not correct at this point, Svelte will return a 400 error. The only cases where we would get this is either us passing wrong data, or someone trying to exploit, where we wouldn't want to give away information.
    const event = getRequestEvent();
    const user = (
      await db.select().from(usersTable).where(eq(usersTable.email, email))
    )[0];

    if (!user) return fail(400, "Invalid username or password.");

    // Hashes the previous password using the salt and paramters, then compares the two.
    const validPassword = await verify(user.passwordHashed, password, {
      memoryCost: 19456,
      timeCost: 3,
      outputLen: 32,
      parallelism: 1,
    });

    if (!validPassword) return fail(400, "Invalid username or password.");
    // Login sucessful
    await generateSession(user.id, event);

    return redirect(302, redirect_url ?? "/");
  },
);

export const signUp = form(
  type({
    // email that ends with dublinstudents.net
    email: "string.email <= 256 & /^[a-zA-Z0-9._%+-]+@dublinstudents.net$/",
    password: "string <= 256", // Add max limit so that they can't send GBs worth of data and crash the server. If someone tries to exploit the endpoint in order to create an insure password, who are we to stop them?
    firstName: "string <= 256",
    lastInitial: "string == 1",
    "redirect_url?": "string",
  }),
  async ({ email, password, firstName, lastInitial, redirect_url }) => {
    const event = getRequestEvent();
    const passwordHashed = await hash(password, {
      // recommended minimum parameters
      memoryCost: 19456,
      timeCost: 3,
      outputLen: 32,
      parallelism: 1,
    });

    const existingUser = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email));
    if (existingUser[0]) return fail(400, "User already exists!");

    const user = await db
      .insert(usersTable)
      .values({ email, firstName, lastInitial, passwordHashed })
      .returning();
    await generateSession(user[0].id, event);
		return redirect(302, redirect_url ?? "/")
  },
);

// TODO: Add so you can choose what specific arguments you want and a default
export const verifySessionAndGetUser = query(async () => {
  const event = getRequestEvent();
	const token = event.cookies.get("session");
	if (!token) return { user: null};
	const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
  const [result] = await db
    .select({
      user: {  firstName: usersTable.firstName, lastInitial: usersTable.lastInitial, email: usersTable.email, },
      session: sessionsTable,
    })
    .from(sessionsTable)
    .innerJoin(usersTable, eq(sessionsTable.userID, usersTable.id))
    .where(eq(sessionsTable.id, sessionId));

  if (!result) {
    return { user: null };
  }
  const { session, user } = result;

  const sessionExpired = Date.now() >= session.expiresAt.getTime();
  if (sessionExpired) {
    await db.delete(sessionsTable).where(eq(sessionsTable, session.id));
    return { user: null };
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

	return user
})