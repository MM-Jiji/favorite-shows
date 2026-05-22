import "server-only";
import { cookies } from "next/headers";
import { db } from "@/db";
import { users } from "@/db/schema";

const COOKIE_NAME = "session_id";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 year

export async function getOrCreateUserId(): Promise<string> {
  const cookieStore = await cookies();
  const existingSession = cookieStore.get(COOKIE_NAME);

  if (existingSession?.value) {
    return existingSession.value;
  }

  // Create new user in DB
  const [newUser] = await db.insert(users).values({}).returning({ id: users.id });

  // Set cookie
  cookieStore.set(COOKIE_NAME, newUser.id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: COOKIE_MAX_AGE,
    path: "/",
  });

  return newUser.id;
}
