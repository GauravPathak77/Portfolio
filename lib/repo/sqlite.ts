import fs from "fs";
import path from "path";
import { randomUUID } from "crypto";
import { DatabaseSync } from "node:sqlite";
import type { CollectionName, Doc, Repo, SortMode } from "./types";

// Documents are stored as JSON in a single table, mirroring the MongoDB document model.

const PROFILE_COLLECTION = "profile";
const PROFILE_ID = "profile";

declare global {
  // eslint-disable-next-line no-var
  var _sqliteDb: DatabaseSync | undefined;
}

function getDb(): DatabaseSync {
  if (global._sqliteDb) return global._sqliteDb;

  const dbPath = process.env.SQLITE_PATH || path.join(process.cwd(), "data", "portfolio.db");
  fs.mkdirSync(path.dirname(dbPath), { recursive: true });

  const db = new DatabaseSync(dbPath);
  db.exec(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS docs (
      id TEXT PRIMARY KEY,
      collection TEXT NOT NULL,
      data TEXT NOT NULL,
      sort_order INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_docs_collection ON docs (collection, sort_order, created_at);
  `);

  global._sqliteDb = db;
  return db;
}

interface Row {
  id: string;
  data: string;
  created_at: string;
  updated_at: string;
}

function toDoc(row: Row): Doc {
  return {
    ...JSON.parse(row.data),
    _id: row.id,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function stripMeta(data: Record<string, unknown>) {
  const { _id: _a, createdAt: _b, updatedAt: _c, __v: _d, ...rest } = data;
  return rest;
}

function getById(id: string): Doc | null {
  const row = getDb().prepare("SELECT * FROM docs WHERE id = ?").get(id) as Row | undefined;
  return row ? toDoc(row) : null;
}

function insert(collection: string, id: string, data: Record<string, unknown>): Doc {
  const now = new Date().toISOString();
  const clean = stripMeta(data);
  getDb()
    .prepare(
      "INSERT INTO docs (id, collection, data, sort_order, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)"
    )
    .run(id, collection, JSON.stringify(clean), Number(clean.order ?? 0), now, now);
  return getById(id)!;
}

function patch(id: string, data: Record<string, unknown>): Doc | null {
  const existing = getById(id);
  if (!existing) return null;
  const merged = { ...stripMeta(existing), ...stripMeta(data) };
  getDb()
    .prepare("UPDATE docs SET data = ?, sort_order = ?, updated_at = ? WHERE id = ?")
    .run(JSON.stringify(merged), Number(merged.order ?? 0), new Date().toISOString(), id);
  return getById(id);
}

export const sqliteRepo: Repo = {
  async list(collection: CollectionName, sort: SortMode = "order") {
    const orderBy =
      sort === "newest" ? "created_at DESC, rowid DESC" : "sort_order ASC, created_at ASC, rowid ASC";
    const rows = getDb()
      .prepare(`SELECT * FROM docs WHERE collection = ? ORDER BY ${orderBy}`)
      .all(collection) as unknown as Row[];
    return rows.map(toDoc);
  },

  async create(collection, data) {
    return insert(collection, randomUUID(), data);
  },

  async update(collection, id, data) {
    const existing = getDb()
      .prepare("SELECT id FROM docs WHERE id = ? AND collection = ?")
      .get(id, collection);
    return existing ? patch(id, data) : null;
  },

  async remove(collection, id) {
    getDb().prepare("DELETE FROM docs WHERE id = ? AND collection = ?").run(id, collection);
  },

  async upsertByField(collection, field, value, data) {
    const rows = await this.list(collection);
    const match = rows.find((doc) => doc[field] === value);
    if (match) patch(match._id, data);
    else insert(collection, randomUUID(), { ...data, [field]: value });
  },

  async getProfile() {
    return getById(PROFILE_ID);
  },

  async saveProfile(data) {
    return getById(PROFILE_ID) ? patch(PROFILE_ID, data)! : insert(PROFILE_COLLECTION, PROFILE_ID, data);
  },
};
