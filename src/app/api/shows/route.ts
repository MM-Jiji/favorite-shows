import { db } from "@/db";
import { shows } from "@/db/schema";

export async function GET() {
  const allShows = await db.select().from(shows);
  return Response.json(allShows);
}
