import { db } from "@/db";
import { favorites } from "@/db/schema";
import { getOrCreateUserId } from "@/lib/session";
import { eq, and } from "drizzle-orm";
import type { NextRequest } from "next/server";

export async function DELETE(
  _req: NextRequest,
  ctx: RouteContext<"/api/favorites/[showId]">
) {
  const userId = await getOrCreateUserId();
  const { showId } = await ctx.params;

  await db
    .delete(favorites)
    .where(
      and(eq(favorites.userId, userId), eq(favorites.showId, Number(showId)))
    );

  return Response.json({ success: true });
}
