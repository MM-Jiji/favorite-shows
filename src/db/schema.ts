import {
  pgTable,
  serial,
  text,
  uuid,
  integer,
  timestamp,
  unique,
} from "drizzle-orm/pg-core";

export const shows = pgTable("shows", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  imageUrl: text("image_url").notNull(),
  description: text("description").notNull(),
});

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const favorites = pgTable(
  "favorites",
  {
    id: serial("id").primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id),
    showId: integer("show_id")
      .notNull()
      .references(() => shows.id),
  },
  (table) => [unique().on(table.userId, table.showId)]
);

export const top3 = pgTable(
  "top3",
  {
    id: serial("id").primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id),
    showId: integer("show_id")
      .notNull()
      .references(() => shows.id),
    rank: integer("rank").notNull(),
    month: text("month").notNull(), // format: "2026-05"
  },
  (table) => [unique().on(table.userId, table.month, table.rank)]
);
