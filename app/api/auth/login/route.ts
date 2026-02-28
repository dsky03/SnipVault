import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
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

    const user = await User.findOne({ userId });

    if (!user) {
      return NextResponse.json(
        { message: "아이디 또는 비밀번호가 틀렸습니다" },
        { status: 401 },
      );
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return NextResponse.json(
        { message: "아이디 또는 비밀번호가 틀렸습니다" },
        { status: 401 },
      );
    }

    const token = jwt.sign(
      { userId: user.userId },
      process.env.JWT_SECRET as string,
      { expiresIn: "1h" },
    );

    (await cookies()).set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // https 할 때는 true\
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60,
    });

    return NextResponse.json({ message: "로그인 성공" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "서버 에러" }, { status: 500 });
  }
}
