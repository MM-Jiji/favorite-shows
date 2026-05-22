import { db } from "@/db";
import { top3, shows } from "@/db/schema";
import { getOrCreateUserId } from "@/lib/session";
import { eq, and, ne } from "drizzle-orm";

function getCurrentMonth(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
}

export async function GET(request: Request) {
  const userId = await getOrCreateUserId();
  const month = getCurrentMonth();
  const { searchParams } = new URL(request.url);

  if (searchParams.get("history") === "true") {
    const rows = await db
      .select({
        id: shows.id,
        name: shows.name,
        imageUrl: shows.imageUrl,
        description: shows.description,
        rank: top3.rank,
        month: top3.month,
      })
      .from(top3)
      .innerJoin(shows, eq(top3.showId, shows.id))
      .where(and(eq(top3.userId, userId), ne(top3.month, month)))
      .orderBy(top3.month, top3.rank);

    const grouped: Record<string, typeof rows> = {};
    for (const row of rows) {
      if (!grouped[row.month]) grouped[row.month] = [];
      grouped[row.month].push(row);
    }

    const history = Object.entries(grouped)
      .sort(([a], [b]) => b.localeCompare(a))
      .map(([m, items]) => ({ month: m, top3: items }));

    return Response.json({ history });
  }

  const userTop3 = await db
    .select({
      id: shows.id,
      name: shows.name,
      imageUrl: shows.imageUrl,
      description: shows.description,
      rank: top3.rank,
    })
    .from(top3)
    .innerJoin(shows, eq(top3.showId, shows.id))
    .where(and(eq(top3.userId, userId), eq(top3.month, month)))
    .orderBy(top3.rank);

  return Response.json({ month, top3: userTop3 });
}

export async function POST(request: Request) {
  const userId = await getOrCreateUserId();
  const { showIds } = await request.json();
  const month = getCurrentMonth();

  if (!Array.isArray(showIds) || showIds.length === 0 || showIds.length > 3) {
    return Response.json(
      { error: "showIds must be an array of 1 to 3 show IDs" },
      { status: 400 }
    );
  }

  // Delete existing top3 for this month
  await db
    .delete(top3)
    .where(and(eq(top3.userId, userId), eq(top3.month, month)));

  // Insert new rankings
  const values = showIds.map((showId: number, index: number) => ({
    userId,
    showId,
    rank: index + 1,
    month,
  }));

  await db.insert(top3).values(values);

  return Response.json({ success: true });
}

export async function DELETE() {
  const userId = await getOrCreateUserId();
  const month = getCurrentMonth();

  await db
    .delete(top3)
    .where(and(eq(top3.userId, userId), eq(top3.month, month)));

  return Response.json({ success: true });
}
