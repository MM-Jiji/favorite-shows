import { db } from "@/db";
import { favorites, shows } from "@/db/schema";
import { getOrCreateUserId } from "@/lib/session";
import { eq, and } from "drizzle-orm";

export async function GET() {
  const userId = await getOrCreateUserId();

  const userFavorites = await db
    .select({
      id: shows.id,
      name: shows.name,
      imageUrl: shows.imageUrl,
      description: shows.description,
    })
    .from(favorites)
    .innerJoin(shows, eq(favorites.showId, shows.id))
    .where(eq(favorites.userId, userId));

  return Response.json(userFavorites);
}

export async function POST(request: Request) {
  const userId = await getOrCreateUserId();
  const { showId } = await request.json();

  if (!showId) {
    return Response.json({ error: "showId is required" }, { status: 400 });
  }

  await db
    .insert(favorites)
    .values({ userId, showId })
    .onConflictDoNothing();

  return Response.json({ success: true });
}
