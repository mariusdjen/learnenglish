import { NextRequest, NextResponse } from "next/server";
import { sendMorningReminders, sendEveningReminders, sendPushToAll } from "@/lib/push-sender";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type, title, body: messageBody } = body;

    // Manual send with custom message
    if (title && messageBody) {
      const result = await sendPushToAll({
        title,
        body: messageBody,
        icon: "/icons/icon-192.png",
      });
      return NextResponse.json(result);
    }

    // Scheduled send by type
    if (type === "morning") {
      await sendMorningReminders();
      return NextResponse.json({ success: true, type: "morning" });
    }

    if (type === "evening") {
      await sendEveningReminders();
      return NextResponse.json({ success: true, type: "evening" });
    }

    return NextResponse.json(
      { error: "Specify type ('morning'|'evening') or title + body" },
      { status: 400 },
    );
  } catch {
    return NextResponse.json(
      { error: "Failed to send notifications" },
      { status: 500 },
    );
  }
}
