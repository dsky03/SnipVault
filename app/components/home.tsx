"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { keepPreviousData, useInfiniteQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "motion/react";
import { CodeXml, Plus } from "lucide-react";
import toast from "react-hot-toast";
import api from "@/lib/axios";
import { Snippet } from "@/app/types/snippet";
import type { SnippetPageData } from "@/lib/snippets";
import SnippetCard from "../components/SnippetCard";
import { useAppDispatch, useAppSelector } from "../util/hook";
import {
  setCreateSnippetModal,
  setUpdateSnippetModal,
} from "../util/modalSlice";
import { setCounts } from "../util/categorySlice";
import { setUserId } from "../util/userSlice";
import Modal from "../modal/modal";

const CreateSnippet = dynamic(() => import("../modal/CreateSnippet"), {
  ssr: false,
});

const UpdateSnippet = dynamic(() => import("../modal/UpdateSnippet"), {
  ssr: false,
});

interface SnippetResponse {
  snippets: Snippet[];
  counts: Record<string, number>;
  nextCursor: string | null;
}

interface HomeProps {
  initialPage: SnippetPageData;
  initialUserId: string | null;
}

const PAGE_SIZE = 12;

export default function Home({ initialPage, initialUserId }: HomeProps) {
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
  const currentUserId = useAppSelector((state) => state.user.userId);

  const [debouncedSearch, setDebouncedSearch] = useState(search);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    if (initialUserId) {
      dispatch(setUserId(initialUserId));
    }
  }, [dispatch, initialUserId]);

  const shouldUseInitialData =
    selectedCategory === "all" && debouncedSearch.length === 0;
  const resolvedUserId = currentUserId || initialUserId || "";

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
    staleTime: 1000 * 30,
    initialData: shouldUseInitialData
      ? {
          pages: [initialPage],
          pageParams: [undefined],
        }
      : undefined,
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (data?.pages?.[0]?.counts) {
      dispatch(setCounts(data.pages[0].counts));
    }
  }, [data, dispatch]);

  const pages = data?.pages ?? [];
  const snippets = pages.flatMap((page) => page.snippets);
  const showInitialLoading = isLoading && snippets.length === 0;

  return (
    <>
      <main className="flex flex-1 flex-col p-6">
        {showInitialLoading ? (
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
                    className="h-3 w-3 rounded-full bg-violet-500"
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
          <p className="text-red-500">에러가 발생했습니다.</p>
        ) : snippets.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#212127]">
              <CodeXml className="h-8 w-8 text-muted" />
            </div>

            <h2 className="text-lg font-semibold text-white">
              스니펫이 없습니다
            </h2>

            <p className="mb-4 mt-1 text-sm text-muted">
              UI 컴포넌트 코드를 저장하고 라이브 프리뷰로 확인해보세요.
            </p>

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
        ) : (
          <div className="flex flex-wrap gap-6">
            {snippets.map((snippet) => (
              <SnippetCard
                key={snippet._id}
                snippet={snippet}
                currentUserId={resolvedUserId}
              />
            ))}
          </div>
        )}

        {hasNextPage && (
          <div className="mt-8 flex justify-center">
            <button
              className="rounded-lg bg-[#212127] px-4 py-2 text-white hover:bg-[#2a2a30]"
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
            >
              {isFetchingNextPage ? "불러오는 중..." : "더 불러오기"}
            </button>
          </div>
        )}
      </main>

      <Modal
        isOpen={isCreateSnippetModal}
        onClose={() => dispatch(setCreateSnippetModal(false))}
      >
        {isCreateSnippetModal && <CreateSnippet />}
      </Modal>

      <Modal
        isOpen={isUpdateSnippetModal}
        onClose={() =>
          dispatch(setUpdateSnippetModal({ open: false, snippetId: "" }))
        }
      >
        {isUpdateSnippetModal && <UpdateSnippet />}
      </Modal>
    </>
  );
}
