import { Plus, Sparkles, Search } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../util/hook";
import { setCreateSnippetModal } from "../util/modalSlice";
import { setCategory } from "../util/categorySlice";
import { setSearch } from "../util/searchSlice";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { setUserId } from "../util/userSlice";

interface HeaderProps {
  counts?: Record<string, number>;
}

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

const Header = ({ counts }: HeaderProps) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const queryclient = useQueryClient();
  const selected = useAppSelector((state) => state.category.selected);
  const search = useAppSelector((state) => state.search.search);
  const userId = useAppSelector((state) => state.user.userId);

  const handleAuthBtn = async () => {
    if (!userId) {
      router.push("/login");
      return;
    }

    await api.post("/auth/logout");
    queryclient.invalidateQueries({ queryKey: ["me"] });
    queryclient.invalidateQueries({ queryKey: ["snippets"] });
    dispatch(setUserId(""));
    router.push("/");
  };

  return (
    <header className="flex flex-col w-full p-5 border-b border-[#212127] bg-linear-to-br from-primary/5 via-transparent to-[#25D09C]/5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 md:h-15 md:w-15 items-center justify-center rounded-xl bg-[#7738EF]/10 ">
            <Sparkles className="w-5 h-5 md:w-8 md:h-8 text-primary" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
              SnipVault
            </h1>
            <p className="text-2xs text-muted hidden md:inline">
              라이브 프리뷰와 함께하는 UI 스니펫 저장소
            </p>
            <p className="text-xs text-muted md:hidden">UI 스니펫 저장소</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            className="flex items-center font-medium text-muted gap-1 px-3 py-1.5 text-xs md:text-sm rounded-md hover:bg-gray-900"
            onClick={handleAuthBtn}
          >
            {userId ? "로그아웃" : "로그인"}
          </button>
          <button
            className="flex items-center font-medium text-white gap-1 px-3 py-1.5 text-sm rounded-md bg-violet-500 hover:bg-violet-600 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/20"
            onClick={() => {
              if (!userId) {
                toast.error("로그인이 필요합니다");
                router.push("/login");
                return;
              }
              dispatch(setCreateSnippetModal(true));
            }}
          >
            <Plus className="w-4 h-4" />
            <span className="hidden md:inline">스니펫 추가</span>
          </button>
        </div>
      </div>
      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1 max-w-lg">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            type="text"
            placeholder="스니펫 검색"
            value={search}
            onChange={(e) => dispatch(setSearch(e.target.value))}
            className="h-8 md:h-10 text-xs md:text-md w-full text-white rounded-md border border-[#212127] bg-transparent px-3 pl-9 py-2 placeholder:text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
          />
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {CATEGORIES.map((cat) => {
          return (
            <button
              key={cat.value}
              onClick={() => dispatch(setCategory(cat.value))}
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all ${selected === cat.value ? "bg-violet-500 text-white" : "bg-[#212127] text-muted hover:text-white"}`}
            >
              {cat.label}
              <span>{counts?.[cat.value] ?? 0}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};

export default Header;
