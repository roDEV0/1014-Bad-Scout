import { form, getRequestEvent } from "$app/server";
import { hash, verify } from "@node-rs/argon2";
import { sha256 } from "@oslojs/crypto/sha2";
import { encodeBase64url, encodeHexLowerCase } from "@oslojs/encoding";
import { error, invalid, redirect, type RequestEvent } from "@sveltejs/kit";
import { type } from "arktype";
import { eq } from "drizzle-orm";
import { validRefUrls } from "./server/config";
import { db } from "./server/db";
import { adminCommand, guardedForm, guardedQuery } from "./server/guarded";
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
    "redirect_url?": "string",
  }),
  async ({ email, password, redirect_url }) => {
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

    return redirect(
      302,
      redirect_url && Object.values(validRefUrls).includes(redirect_url)
        ? redirect_url
        : "/",
    ); // dont allow mallicious redirect urls
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
      .values({ email, firstName, lastInitial, passwordHashed })
      .returning();

    await generateSession(user[0].id, event);

    return redirect(
      302,
      redirect_url && Object.values(validRefUrls).includes(redirect_url)
        ? redirect_url
        : "/",
    );
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

  return redirect(302, "/login");
});

// export const verifyUserExists = query(async () => {
//     const user = await getUser();
//     return user ?? redirect(302, "/login");
// });

// export const verifyUser = query(async () => {
//     const user = await verifyUserExists();
//     return user.verified ? user : redirect(302, "/unverified");
// });

// export const getUser = query(async () => {
//     const result = await verifyUserSession();
//     if (!result) return null;

//     const { passwordHashed, ...rest } = result.user;
//     return rest;
// });

// export const verifyUserAdmin = query(async () => {
//     const user = await verifyUser();
//     return user.admin ? user : error(403);
// });
//
//
//

export const getUnverifiedUsers = guardedQuery(async (e) => {
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

    try {
      await db.insert(unverifiedUsers).values({ userId, code });
    } catch (e) {
      return await db
        .select()
        .from(unverifiedUsers)
        .where(eq(unverifiedUsers.userId, userId));
    }
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
