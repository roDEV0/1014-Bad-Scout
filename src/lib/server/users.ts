import 'dotenv/config';
import { and, eq } from 'drizzle-orm';
import { usersTable } from "./schemas.ts";
import { db } from "./db.ts";

import argon2 from 'argon2';

export async function createUserObject(email: string, password: string, firstname: string, lastInitial: string) {
    const newUser: typeof usersTable.$inferInsert = {
        email: email,
        passwordHashed: await argon2.hash(password),
        firstname: firstname.charAt(0).toUpperCase() + firstname.slice(1).toLowerCase(),
        lastInitial: lastInitial.toUpperCase(),
        score: 0,
    }
}

export async function insertUser(user: typeof usersTable.$inferInsert) {
    return db.insert(usersTable).values(user);
}

export async function deleteUser(filters: Record<string, any>) {
    const conditions = Object.entries(filters).map(([key, value]) => {
        const column = (usersTable as any)[key];
        return eq(column, value);
    });

    const where = and(...conditions);

    return db.delete(usersTable).where(where);

}

export async function getUsers(filters: Record<string, any>) {
    let conditions = null;

    if (filters) {
         conditions = Object.entries(filters).map(([key, value]) => {
            const column = (usersTable as any)[key];
            return eq(column, value);
        });
    }

    const query = db.select().from(usersTable);
    if (conditions) {
        return conditions.length > 0 ? query.where(and(...conditions)) : query;
    }

}