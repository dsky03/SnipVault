import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Snippet from "@/models/Snippet";
import { getCurrentUser } from "@/lib/auth";

// 목록 조회
export async function GET(req: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const search = searchParams.get("search");

    const limit = Math.min(Number(searchParams.get("limit")) || 12, 50);
    const cursor = searchParams.get("cursor");

    const userId = await getCurrentUser();

    const listFilter: any = {};

    if (category && category === "my") {
      if (!userId) {
        return NextResponse.json(
          { message: "로그인이 필요합니다." },
          { status: 401 },
        );
      }
      listFilter.userId = userId;
    } else if (category && category !== "all") {
      listFilter.category = category;
    }

    if (search && search.trim() !== "") {
      listFilter.title = {
        $regex: search,
        $options: "i",
      };
    }

    if (cursor) {
      const cursorDate = new Date(cursor);
      if (!Number.isNaN(cursorDate.getTime())) {
        listFilter.createdAt = { $lt: cursorDate };
      }
    }

    // 목록 가져오기
    const snippets = await Snippet.find(listFilter)
      .sort({ createdAt: -1 })
      .limit(limit);

    const nextCursor =
      snippets.length === limit
        ? snippets[snippets.length - 1].createdAt
        : null;

    // 카테고리별 개수
    const countBaseFilter: any = {};

    if (search && search.trim() !== "") {
      countBaseFilter.title = {
        $regex: search,
        $options: "i",
      };
    }

    const countsAgg = await Snippet.aggregate([
      { $match: countBaseFilter },
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
        },
      },
    ]);

    const counts: Record<string, number> = {
      all: await Snippet.countDocuments(countBaseFilter),
    };

    countsAgg.forEach((c) => {
      counts[c._id] = c.count;
    });

    if (userId) {
      counts.my = await Snippet.countDocuments({
        ...countBaseFilter,
        userId,
      });
    } else {
      counts.my = 0;
    }

    return NextResponse.json({ snippets, counts, nextCursor }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "서버 에러" }, { status: 500 });
  }
}

// 생성
export async function POST(req: Request) {
  try {
    await connectDB();

    const userId = await getCurrentUser();

    if (!userId) {
      return NextResponse.json({ message: "로그인 필요" }, { status: 401 });
    }

    const body = await req.json();

    const { title, description, category, code } = body;

    if (!title || !code) {
      return NextResponse.json({ message: "필수값 누락" }, { status: 400 });
    }

    const snippet = await Snippet.create({
      title,
      description,
      category,
      code,
      userId,
    });

    return NextResponse.json(snippet, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "서버 에러" }, { status: 500 });
  }
}
