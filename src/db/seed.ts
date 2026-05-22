import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { shows } from "./schema";

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

const showsData = [
  {
    name: "The Boys",
    imageUrl: "/shows/the-boys.jpg",
    description:
      "A group of vigilantes sets out to take down corrupt superheroes who abuse their superpowers.",
  },
  {
    name: "Jujutsu Kaisen",
    imageUrl: "/shows/jujutsu-kaisen.webp",
    description:
      "A boy swallows a cursed talisman and enrolls in a school of sorcerers to locate the cursed object's remaining fingers.",
  },
  {
    name: "From",
    imageUrl: "/shows/from.jpg",
    description:
      "Residents of a nightmarish town struggle to survive while searching for a way out as terrifying creatures emerge at night.",
  },
  {
    name: "The Flash",
    imageUrl: "/shows/the-flash.jpg",
    description:
      "Barry Allen, a forensic scientist with super speed, fights criminals and meta-humans terrorizing Central City.",
  },
  {
    name: "Daredevil Born Again",
    imageUrl: "/shows/daredevil-born-again.jpg",
    description:
      "Matt Murdock, a blind lawyer with extraordinary senses, fights for justice in Hell's Kitchen both in and out of the courtroom.",
  },
  {
    name: "HunterXHunter",
    imageUrl: "/shows/hunterxhunter.jpg",
    description:
      "A young boy embarks on a dangerous journey to find his absent father and become a licensed Hunter.",
  },
  {
    name: "One Piece",
    imageUrl: "/shows/one-piece.jpg",
    description:
      "Monkey D. Luffy and his pirate crew explore the Grand Line in search of the ultimate treasure, One Piece.",
  },
  {
    name: "Golden Kamui",
    imageUrl: "/shows/golden-kamui.jpg",
    description:
      "A war veteran and an Ainu girl race against others to find hidden gold in the wilderness of Hokkaido.",
  },
  {
    name: "The Punisher",
    imageUrl: "/shows/the-punisher.jpg",
    description:
      "Former Marine Frank Castle wages a one-man war against the criminal underworld to avenge his murdered family.",
  },
  {
    name: "Naruto Shippuden",
    imageUrl: "/shows/naruto-shippuden.webp",
    description:
      "Naruto Uzumaki returns from training to protect his village and bring back his friend Sasuke from the darkness.",
  },
];

async function seed() {
  console.log("🌱 Seeding shows...");

  for (const show of showsData) {
    await db
      .insert(shows)
      .values(show)
      .onConflictDoUpdate({
        target: shows.name,
        set: { imageUrl: show.imageUrl, description: show.description },
      });
  }

  console.log("✅ Seeding complete!");
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
