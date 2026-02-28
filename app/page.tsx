"use client";

import SnippetCard from "./components/SnippetCard";
import Header from "./components/header";
import { CodeXml, Plus } from "lucide-react";
import { Snippet } from "@/app/types/snippet";
import api from "@/lib/axios";
import { motion, AnimatePresence } from "motion/react";
import {
  keepPreviousData,
  useInfiniteQuery,
  useQuery,
} from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

//redux
import { useAppSelector, useAppDispatch } from "./util/hook";
import {
  setCreateSnippetModal,
  setUpdateSnippetModal,
} from "./util/modalSlice";

// modal
import Modal from "./modal/modal";
import CreateSnippet from "./modal/CreateSnippet";
import UpdateSnippet from "./modal/UpdateSnippet";
import { setUserId } from "./util/userSlice";
import toast from "react-hot-toast";

interface SnippetResponse {
  snippets: Snippet[];
  counts: Record<string, number>;
  nextCursor: string | null;
}

const PAGE_SIZE = 12;

// tailwind v3으로 동작함
// const mockSnippets: Snippet[] = [
//   {
//     _id: "1",
//     title: "Gradient Button",
//     category: "버튼",
//     code: `
// export default function App() {
//   return (
//     <div className="min-h-screen flex items-center justify-center bg-zinc-900">
//       {/* React + Tailwind 코드 입력 */}
//       <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-indigo-500 text-white">
//         Click me
//       </button>
//     </div>
//   );
// }
//     `,
//   },
//   {
//     _id: "2",
//     title: "Glass Card",
//     category: "카드",
//     code: `
// export default function App() {
//   return (
//     <div className=" flex justify-center p-6 rounded-xl bg-white/10 backdrop-blur-md text-white">
//       Glass Effect
//     </div>
//   );
// }
//     `,
//   },
//   {
//     _id: "3",
//     title: "Centered Layout",
//     category: "레이아웃",
//     code: `
// export default function App() {
//   return (
//     <div className="flex items-center justify-center h-screen w-screen bg-black text-white">
//       Centered
//     </div>
//   );
// }
//     `,
//   },
// ];

export default function Home() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const isCreateSnippetModal = useAppSelector(
    (state) => state.modal.createSnippetModal,
  );
  const isUpdateSnippetModal = useAppSelector(
    (state) => state.modal.updateSnippetModal,
  );

  const selectedCategory = useAppSelector((state) => state.category.selected);
  const search = useAppSelector((state) => state.search.search);

  const [debouncedSearch, setDebouncedSearch] = useState(search);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  const { data: user, isLoading: authLoading } = useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      const res = await api.get("/auth/me");
      console.log(res.data.user.userId);
      dispatch(setUserId(res.data.user.userId));
      return res.data.user;
    },
    staleTime: 1000 * 60 * 5,
  });

  // useEffect(() => {
  //   console.log(user);
  //   if (!authLoading && !user) {
  //     router.replace("/login");
  //   }
  // }, [user, authLoading]);

  const {
    data,
    isLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    isError,
  } = useInfiniteQuery<SnippetResponse>({
    queryKey: ["snippets", selectedCategory, debouncedSearch],
    queryFn: async ({ pageParam }) => {
      const res = await api.get("/snippets", {
        params: {
          ...(selectedCategory !== "all" && {
            category: selectedCategory,
          }),
          ...(debouncedSearch && { search: debouncedSearch }),
          limit: PAGE_SIZE,
          ...(pageParam ? { cursor: pageParam } : {}),
        },
      });
      return res.data;
    },
    placeholderData: keepPreviousData,
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    refetchOnWindowFocus: false,
  });

  const pages = data?.pages ?? [];
  const snippets = pages.flatMap((p) => p.snippets);
  const counts = pages[0]?.counts; // 첫 페이지 기준

  return (
    <>
      <div className="min-h-screen flex flex-col bg-black">
        <Header counts={counts} />
        <main className="flex-1 flex flex-col p-6">
          {isLoading ? (
            <AnimatePresence>
              <motion.div
                className="flex flex-1 items-center justify-center"
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="flex space-x-2">
                  {[0, 1, 2].map((i) => (
                    <motion.span
                      key={i}
                      className="w-3 h-3 bg-violet-500 rounded-full"
                      animate={{
                        y: [0, -6, 0],
                        opacity: [0.3, 1, 0.3],
                      }}
                      transition={{
                        duration: 0.6,
                        repeat: Infinity,
                        delay: i * 0.2,
                      }}
                    />
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          ) : isError ? (
            <p className="text-red-500">에러 발생</p>
          ) : snippets && snippets.length === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#212127]">
                <CodeXml className="h-8 w-8 text-muted" />
              </div>
              <h2 className="text-lg text-white font-semibold">
                스니펫이 없습니다
              </h2>
              <p className="mt-1 mb-4 text-muted text-sm">
                UI 컴포넌트 코드를 저장하고 라이브 프리뷰로 확인하세요.
              </p>
              <button
                className="flex items-center font-medium text-white gap-1 px-3 py-1.5 text-sm rounded-md bg-violet-500 hover:bg-violet-600 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/20"
                onClick={() => {
                  if (!user) {
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
          ) : (
            <div className="flex flex-wrap gap-6">
              {snippets?.map((s) => {
                return <SnippetCard key={s._id} snippet={s} />;
              })}
            </div>
          )}
          {hasNextPage && (
            <div className="mt-8 flex justify-center">
              <button
                className="px-4 py-2 rounded-lg bg-[#212127] text-white hover:bg-[#2a2a30]"
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
              >
                {isFetchingNextPage ? "불러오는 중..." : "더 불러오기"}
              </button>
            </div>
          )}
        </main>
      </div>
      <Modal
        isOpen={isCreateSnippetModal}
        onClose={() => dispatch(setCreateSnippetModal(false))}
      >
        <CreateSnippet />
      </Modal>
      <Modal
        isOpen={isUpdateSnippetModal}
        onClose={() =>
          dispatch(setUpdateSnippetModal({ open: false, snippetId: "" }))
        }
      >
        <UpdateSnippet />
      </Modal>
    </>
  );
}
