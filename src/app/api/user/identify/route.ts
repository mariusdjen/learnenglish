import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import db from "@/lib/db";

export async function POST(req: NextRequest) {
  const { name } = await req.json();

  if (!name || typeof name !== "string" || name.trim().length < 2) {
    return NextResponse.json(
      { error: "Le nom doit contenir au moins 2 caracteres" },
      { status: 400 },
    );
  }

  const trimmed = name.trim();
  const normalized = trimmed.toLowerCase();
  const now = new Date().toISOString();

  // Try to find existing user
  const existing = db
    .prepare("SELECT id, name FROM users WHERE name_normalized = ?")
    .get(normalized) as { id: string; name: string } | undefined;

  if (existing) {
    db.prepare("UPDATE users SET last_seen_at = ? WHERE id = ?").run(
      now,
      existing.id,
    );

    const state = db
      .prepare(
        "SELECT progress_json, notebook_json, chat_json FROM user_state WHERE user_id = ?",
      )
      .get(existing.id) as
      | { progress_json: string; notebook_json: string; chat_json: string }
      | undefined;

    return NextResponse.json({
      userId: existing.id,
      name: existing.name,
      isReturning: true,
      state: state
        ? {
            progress: JSON.parse(state.progress_json),
            notebook: JSON.parse(state.notebook_json),
            chat: JSON.parse(state.chat_json),
          }
        : null,
    });
  }

  // Create new user
  const userId = randomUUID();

  db.prepare(
    "INSERT INTO users (id, name, name_normalized, created_at, last_seen_at) VALUES (?, ?, ?, ?, ?)",
  ).run(userId, trimmed, normalized, now, now);

  db.prepare(
    "INSERT INTO user_state (user_id, progress_json, notebook_json, chat_json, updated_at) VALUES (?, ?, ?, ?, ?)",
  ).run(userId, "{}", "{}", "{}", now);

  return NextResponse.json({
    userId,
    name: trimmed,
    isReturning: false,
    state: null,
  });
}
