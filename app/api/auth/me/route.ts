import { getCurrentUser } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
  const userId = await getCurrentUser();
  if (!userId) {
    return NextResponse.json({ user: null }, { status: 200 });
  }

  return NextResponse.json({ user: { userId } }, { status: 200 });
}
