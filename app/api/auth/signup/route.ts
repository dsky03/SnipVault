import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(req: Request) {
  try {
    await connectDB();

    const { userId, password } = await req.json();

    if (!userId || !password) {
      return NextResponse.json(
        { message: "아이디와 비밀번호를 입력하세요" },
        { status: 400 },
      );
    }

    const existingUser = await User.findOne({ userId });
    if (existingUser) {
      return NextResponse.json(
        { message: "이미 존재하는 아이디입니다." },
        { status: 409 },
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      userId,
      password: hashedPassword,
    });

    return NextResponse.json({ message: "회원가입 성공" }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "서버 에러" }, { status: 500 });
  }
}
