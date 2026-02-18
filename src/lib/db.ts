import Database from "better-sqlite3";
import { existsSync, mkdirSync } from "fs";
import { join } from "path";

const DB_DIR = join(process.cwd(), "data");
const DB_PATH = join(DB_DIR, "marius.db");

if (!existsSync(DB_DIR)) {
  mkdirSync(DB_DIR, { recursive: true });
}

const db = new Database(DB_PATH);

db.pragma("journal_mode = WAL");

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    name_normalized TEXT NOT NULL,
    created_at TEXT NOT NULL,
    last_seen_at TEXT NOT NULL,
    UNIQUE(name_normalized)
  );

  CREATE TABLE IF NOT EXISTS user_state (
    user_id TEXT PRIMARY KEY REFERENCES users(id),
    progress_json TEXT NOT NULL DEFAULT '{}',
    notebook_json TEXT NOT NULL DEFAULT '{}',
    chat_json TEXT NOT NULL DEFAULT '{}',
    updated_at TEXT NOT NULL
  );
`);

export default db;
