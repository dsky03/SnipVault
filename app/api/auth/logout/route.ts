import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  (await cookies()).delete("token");

  return NextResponse.json({ message: "로그아웃 완료" }, { status: 200 });
}
