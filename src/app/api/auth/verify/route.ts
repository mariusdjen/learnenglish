import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { code } = await req.json();
  const accessCode = process.env.APP_ACCESS_CODE;

  if (!accessCode) {
    return NextResponse.json({ success: true });
  }

  if (code === accessCode) {
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ success: false, error: "Code incorrect" }, { status: 401 });
}
