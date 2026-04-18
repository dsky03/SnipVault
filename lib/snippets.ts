import { Snippet as SnippetItem } from "@/app/types/snippet";
import Snippet from "@/models/Snippet";
import { connectDB } from "@/lib/mongodb";

export interface SnippetPageData {
  snippets: SnippetItem[];
  counts: Record<string, number>;
  nextCursor: string | null;
}

interface GetSnippetPageParams {
  category?: string;
  search?: string;
  limit?: number;
  cursor?: string;
  userId?: string | null;
}

export async function getSnippetPage({
  category = "all",
  search = "",
  limit = 12,
  cursor,
  userId,
}: GetSnippetPageParams): Promise<SnippetPageData> {
  await connectDB();

  const safeLimit = Math.min(limit, 50);
  const listFilter: Record<string, unknown> = {};

  if (category === "my") {
    if (!userId) {
      return {
        snippets: [],
        counts: { all: 0, my: 0 },
        nextCursor: null,
      };
    }
    listFilter.userId = userId;
  } else if (category !== "all") {
    listFilter.category = category;
  }

  if (search.trim() !== "") {
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

  const snippetDocs = await Snippet.find(listFilter)
    .sort({ createdAt: -1 })
    .limit(safeLimit);

  const snippets: SnippetItem[] = snippetDocs.map((snippet) => ({
    _id: snippet._id.toString(),
    userId: snippet.userId,
    title: snippet.title,
    category: snippet.category,
    code: snippet.code,
  }));

  const lastSnippet = snippetDocs[snippetDocs.length - 1];
  const nextCursor =
    snippetDocs.length === safeLimit && lastSnippet?.createdAt
      ? lastSnippet.createdAt.toISOString()
      : null;

  const countBaseFilter: Record<string, unknown> = {};

  if (search.trim() !== "") {
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

  countsAgg.forEach((countItem: { _id: string; count: number }) => {
    counts[countItem._id] = countItem.count;
  });

  counts.my = userId
    ? await Snippet.countDocuments({
        ...countBaseFilter,
        userId,
      })
    : 0;

  return {
    snippets,
    counts,
    nextCursor,
  };
}
