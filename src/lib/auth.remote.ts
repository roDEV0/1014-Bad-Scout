import { form, getRequestEvent } from "$app/server";
import { hash, verify } from "@node-rs/argon2";
import { sha256 } from "@oslojs/crypto/sha2";
import { encodeBase64url, encodeHexLowerCase } from "@oslojs/encoding";
import { error, invalid, redirect, type RequestEvent } from "@sveltejs/kit";
import { type } from "arktype";
import { eq } from "drizzle-orm";
import { db } from "./server/db";
import { adminCommand, adminQuery, guardedForm } from "./server/guarded";
import { sessionsTable, unverifiedUsers, usersTable } from "./server/schemas";

const DAY_IN_MS = 1000 * 60 * 60 * 24;

function convertToken(token: string) {
  return encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
}

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
  }),
  async ({ email, password }) => {
    // If the schema is not correct at this point, Svelte will return a 400 error. The only cases where we would get this is either us passing wrong data, or someone trying to exploit, where we wouldn't want to give away information.
    const event = getRequestEvent();
    if (event.locals.user) return redirect(303, "/");

    const user = (
      await db.select().from(usersTable).where(eq(usersTable.email, email))
    )[0];

    if (!user) return error(400, "Invalid username or password.");

    // Hashes the previous password using the salt and paramters, then compares the two.
    const validPassword = await verify(user.passwordHashed, password, {
      memoryCost: 19456,
      timeCost: 3,
      outputLen: 32,
      parallelism: 1,
    });

    if (!validPassword) return error(400, "Invalid username or password.");
    // Login sucessful
    await generateSession(user.id, event);

    return redirect(302, "/"); // dont allow mallicious redirect urls
  },
);

export const signUp = form(
  type({
    // email that ends with dublinstudents.net
    email: "string.email <= 256 & /^[a-zA-Z0-9._%+-]+@dublinstudents.net$/",
    password: type(
      "string <= 256",
      "&",
      /^(?=(?:[^a-z]*[a-z]){1})(?=(?:[^0-9]*[0-9]){1})(?=.*[!-\/:-@\[-`{-~]).{8,}$/i,
    ), // Password must have atleast 8 characters, one special character, 1 number, and one letter.

    firstName: "string <= 256",
    lastName: "string <= 256",
  }),
  async ({ email, password, firstName, lastName }) => {
    const event = getRequestEvent();
    if (event.locals.user) return redirect(303, "/");

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
    if (existingUser[0]) return error(400, "User already exists!");

    const user = await db
      .insert(usersTable)
      .values({ email, firstName, lastName, passwordHashed })
      .returning();

    await db.insert(unverifiedUsers).values({ userId: user[0].id });

    await generateSession(user[0].id, event);

    return redirect(302, "/");
  },
);

export const logOut = guardedForm(async ({ event }) => {
  const token = event.cookies.get("session");
  if (!token) return error(401);

  await db
    .delete(sessionsTable)
    .where(eq(sessionsTable.id, convertToken(token)));

  event.cookies.delete("session", {
    path: "/",
  });

  return redirect(302, "/");
});

export const getUnverifiedUsers = adminQuery(async (e) => {
  return await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.verified, false))
    .leftJoin(unverifiedUsers, eq(unverifiedUsers.userId, usersTable.id));
});

export const generateVerificationCode = adminCommand(
  type("number"),
  async (userId) => {
    const values = crypto.getRandomValues(new Uint8Array(4));
    let code = Buffer.from(values).toString("hex");

    await db
      .update(unverifiedUsers)
      .set({ code })
      .where(eq(unverifiedUsers.userId, userId));
  },
);

export const verifyUserCode = guardedForm(
  type({ code: "string" }),
  async ({ code }, { user }) => {
    const [result] = await db
      .select()
      .from(usersTable)
      .innerJoin(unverifiedUsers, eq(unverifiedUsers.userId, usersTable.id))
      .where(eq(usersTable.id, user.id));

    if (result.unverified_users.code === code) {
      await db
        .update(usersTable)
        .set({ verified: true })
        .where(eq(usersTable.id, result.unverified_users.userId));
      await db
        .delete(unverifiedUsers)
        .where(eq(unverifiedUsers.userId, result.users.id));
      return redirect(303, "/");
    } else {
      return invalid("Invalid code. Please try again.");
    }
  },
);
