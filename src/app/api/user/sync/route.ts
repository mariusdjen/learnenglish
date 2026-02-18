import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";

export async function POST(req: NextRequest) {
  const { userId, progress, notebook, chat } = await req.json();

  if (!userId || typeof userId !== "string") {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });
  }

  const user = db.prepare("SELECT id FROM users WHERE id = ?").get(userId);
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const now = new Date().toISOString();

  db.prepare(
    `INSERT INTO user_state (user_id, progress_json, notebook_json, chat_json, updated_at)
     VALUES (?, ?, ?, ?, ?)
     ON CONFLICT(user_id) DO UPDATE SET
       progress_json = excluded.progress_json,
       notebook_json = excluded.notebook_json,
       chat_json = excluded.chat_json,
       updated_at = excluded.updated_at`,
  ).run(
    userId,
    progress ? JSON.stringify(progress) : "{}",
    notebook ? JSON.stringify(notebook) : "{}",
    chat ? JSON.stringify(chat) : "{}",
    now,
  );

  db.prepare("UPDATE users SET last_seen_at = ? WHERE id = ?").run(now, userId);

  return NextResponse.json({ success: true });
}

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });
  }

  const state = db
    .prepare(
      "SELECT progress_json, notebook_json, chat_json FROM user_state WHERE user_id = ?",
    )
    .get(userId) as
    | { progress_json: string; notebook_json: string; chat_json: string }
    | undefined;

  if (!state) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json({
    progress: JSON.parse(state.progress_json),
    notebook: JSON.parse(state.notebook_json),
    chat: JSON.parse(state.chat_json),
  });
}
