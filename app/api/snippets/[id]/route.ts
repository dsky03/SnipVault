import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Snippet from "@/models/Snippet";
import { getCurrentUser } from "@/lib/auth";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await connectDB();

    const { id } = await params;

    const snippet = await Snippet.findById(id);

    if (!snippet) {
      return NextResponse.json(
        { message: "존재하지 않는 스니펫 " },
        { status: 404 },
      );
    }

    return NextResponse.json(snippet, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "서버 에러" }, { status: 500 });
  }
}

// 업데이트
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await connectDB();

    const { id } = await params;

    const userId = await getCurrentUser();

    if (!userId) {
      return NextResponse.json({ message: "로그인 필요" }, { status: 401 });
    }

    const body = await req.json();
    const { title, category, code, description } = body;

    if (!title || !code) {
      return NextResponse.json({ message: "필수값 누락" }, { status: 400 });
    }

    const updated = await Snippet.findByIdAndUpdate(
      {
        _id: id,
        userId,
      },
      {
        title,
        category,
        code,
        description,
      },
      {
        new: true, // 수정 후 값 반환
        runValidators: true, // 스키마 validation 적용
      },
    );

    if (!updated) {
      return NextResponse.json(
        { message: "존재하지 않는 스니펫" },
        { status: 404 },
      );
    }

    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "서버 에러" }, { status: 500 });
  }
}

// 삭제
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await connectDB();

    const { id } = await params;

    const userId = await getCurrentUser();

    if (!userId) {
      return NextResponse.json({ message: "로그인 필요" }, { status: 401 });
    }

    const deleted = await Snippet.findByIdAndDelete({ _id: id, userId });

    if (!deleted) {
      return NextResponse.json(
        { message: "존재하지 않는 스니펫" },
        { status: 404 },
      );
    }

    return NextResponse.json({ message: "삭제 완료" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "서버 에러" }, { status: 500 });
  }
}
