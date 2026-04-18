"use client";

import { useEffect } from "react";
import { Plus, Search, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import api from "@/lib/axios";
import { useAppDispatch, useAppSelector } from "../util/hook";
import { setCategory } from "../util/categorySlice";
import { setCreateSnippetModal } from "../util/modalSlice";
import { setSearch } from "../util/searchSlice";
import { setUserId } from "../util/userSlice";

const CATEGORIES = [
  { label: "전체", value: "all" },
  { label: "My", value: "my" },
  { label: "버튼", value: "button" },
  { label: "입력 필드", value: "input" },
  { label: "드롭다운", value: "dropdown" },
  { label: "체크박스 / 라디오", value: "selection" },
  { label: "카드", value: "card" },
  { label: "테이블", value: "table" },
  { label: "모달", value: "modal" },
  { label: "토글", value: "toggle" },
  { label: "배지", value: "badge" },
  { label: "기타", value: "etc" },
];

interface HeaderProps {
  initialUserId: string | null;
}

const Header = ({ initialUserId }: HeaderProps) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const queryClient = useQueryClient();
  const selected = useAppSelector((state) => state.category.selected);
  const search = useAppSelector((state) => state.search.search);
  const userId = useAppSelector((state) => state.user.userId);
  const counts = useAppSelector((state) => state.category.counts);
  const resolvedUserId = userId || initialUserId || "";

  useEffect(() => {
    if (initialUserId) {
      dispatch(setUserId(initialUserId));
    }
  }, [dispatch, initialUserId]);

  const handleAuthBtn = async () => {
    if (!resolvedUserId) {
      router.push("/login");
      return;
    }

    await api.post("/auth/logout");
    queryClient.invalidateQueries({ queryKey: ["snippets"] });
    dispatch(setUserId(""));
    router.push("/");
  };

  return (
    <header className="flex w-full flex-col border-b border-[#212127] bg-linear-to-br from-primary/5 via-transparent to-[#25D09C]/5 p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#7738EF]/10 md:h-15 md:w-15">
            <Sparkles className="h-5 w-5 text-primary md:h-8 md:w-8" />
          </div>

          <div>
            <h1 className="text-xl font-bold tracking-tight text-white md:text-2xl">
              SnipVault
            </h1>
            <p className="hidden text-2xs text-muted md:inline">
              실시간 프리뷰로 탐색하는 UI 스니펫 저장소
            </p>
            <p className="text-xs text-muted md:hidden">UI 스니펫 저장소</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            className="flex items-center gap-1 rounded-md px-3 py-1.5 text-xs font-medium text-muted hover:bg-gray-900 md:text-sm"
            onClick={handleAuthBtn}
          >
            {resolvedUserId ? "로그아웃" : "로그인"}
          </button>

          <button
            className="flex items-center gap-1 rounded-md bg-violet-500 px-3 py-1.5 text-sm font-medium text-white hover:border-primary/20 hover:bg-violet-600 hover:shadow-lg hover:shadow-primary/20"
            onClick={() => {
              if (!resolvedUserId) {
                toast.error("로그인이 필요합니다");
                router.push("/login");
                return;
              }

              dispatch(setCreateSnippetModal(true));
            }}
          >
            <Plus className="h-4 w-4" />
            <span className="hidden md:inline">스니펫 추가</span>
          </button>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative max-w-lg flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            type="text"
            placeholder="스니펫 검색"
            value={search}
            onChange={(e) => dispatch(setSearch(e.target.value))}
            className="h-8 w-full rounded-md border border-[#212127] bg-transparent px-3 py-2 pl-9 text-xs text-white placeholder:text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 disabled:cursor-not-allowed disabled:opacity-50 md:h-10 md:text-sm"
          />
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.value}
            onClick={() => dispatch(setCategory(cat.value))}
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all ${selected === cat.value ? "bg-violet-500 text-white" : "bg-[#212127] text-muted hover:text-white"}`}
          >
            {cat.label}
            <span>{counts?.[cat.value] ?? 0}</span>
          </button>
        ))}
      </div>
    </header>
  );
};

export default Header;
