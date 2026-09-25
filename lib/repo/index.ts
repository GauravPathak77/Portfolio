import type { Repo } from "./types";

export type { CollectionName, Doc, Repo, SortMode } from "./types";

export type DbProvider = "sqlite" | "mongodb";

export function getDbProvider(): DbProvider {
  const explicit = process.env.DB_PROVIDER?.trim().toLowerCase();
  if (explicit === "sqlite" || explicit === "mongodb") return explicit;

  const uri = process.env.MONGODB_URI;
  return uri && !uri.includes("<db_password>") ? "mongodb" : "sqlite";
}

export async function getRepo(): Promise<Repo> {
  if (getDbProvider() === "mongodb") {
    return (await import("./mongo")).mongoRepo;
  }
  return (await import("./sqlite")).sqliteRepo;
}
