import { sha256 } from "@oslojs/crypto/sha2";
import { encodeHexLowerCase } from "@oslojs/encoding";
import { eq } from "drizzle-orm";
import { db } from "../server/db";
import { sessionsTable, usersTable } from "../server/schemas";

export async function getUserSession(sessionToken: string) {
  if (!sessionToken) return null;
  const sessionId = encodeHexLowerCase(
    sha256(new TextEncoder().encode(sessionToken)),
  );

  const [result] = await db
    .select({
      user: usersTable,
      session: sessionsTable,
    })
    .from(sessionsTable)
    .innerJoin(usersTable, eq(sessionsTable.userID, usersTable.id))
    .where(eq(sessionsTable.id, sessionId));

  return result ?? null;

  // const sessionExpired = Date.now() >= session.expiresAt.getTime();
  // if (sessionExpired) {
  //     await db.delete(sessionsTable).where(eq(sessionsTable, session.id));
  //     return null;
  // }

  // const renewSession =
  //     Date.now() >= session.expiresAt.getTime() - DAY_IN_MS * 15;

  // if (renewSession) {
  //     session.expiresAt = new Date(Date.now() + DAY_IN_MS * 30);
  //     await db
  //         .update(sessionsTable)
  //         .set({ expiresAt: session.expiresAt })
  //         .where(eq(sessionsTable.id, session.id));
  // }

  // return { session, user };
}
