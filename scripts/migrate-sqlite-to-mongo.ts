import dotenv from "dotenv";
import path from "path";
import mongoose from "mongoose";

dotenv.config({ path: path.join(process.cwd(), ".env.local") });

import { sqliteRepo } from "../lib/repo/sqlite";
import { mongoRepo } from "../lib/repo/mongo";
import type { CollectionName } from "../lib/repo";

// Copies every document from the local SQLite database into MongoDB.
// Collections that already hold data in MongoDB are skipped, so re-running never duplicates.

const collections: CollectionName[] = ["projects", "certificates", "timeline", "reviews", "messages"];

function withoutMeta(doc: Record<string, unknown>) {
  const { _id: _a, createdAt: _b, updatedAt: _c, ...rest } = doc;
  return rest;
}

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri || uri.includes("<db_password>")) {
    throw new Error("Set a real MONGODB_URI in .env.local first.");
  }

  const profile = await sqliteRepo.getProfile();
  if (profile) {
    if (await mongoRepo.getProfile()) console.log("profile       skipped (already in MongoDB)");
    else {
      await mongoRepo.saveProfile(withoutMeta(profile));
      console.log("profile       copied");
    }
  }

  for (const name of collections) {
    const source = await sqliteRepo.list(name);
    const existing = await mongoRepo.list(name);
    if (existing.length > 0) {
      console.log(`${name.padEnd(13)} skipped (${existing.length} already in MongoDB)`);
      continue;
    }
    for (const doc of source) await mongoRepo.create(name, withoutMeta(doc));
    console.log(`${name.padEnd(13)} copied ${source.length}`);
  }

  await mongoose.disconnect();
}

main().catch(async (err) => {
  console.error(err);
  await mongoose.disconnect();
  process.exit(1);
});
