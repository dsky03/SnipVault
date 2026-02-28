"use client";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
import dynamic from "next/dynamic";
import { AnimatePresence, motion } from "motion/react";
import formatDate from "@/app/util/formatDate";

const SnippetPlayground = dynamic(() => import("./SnippetPlayground"), {
  ssr: false,
});

export default function SnippetDetail({ id }: { id: string }) {
  const {
    data: snippet,
    isFetching,
    isError,
  } = useQuery({
    queryKey: ["snippet", id],
    queryFn: async () => {
      const res = await api.get(`/snippets/${id}`);
      return res.data;
    },
    refetchOnWindowFocus: false,
  });

  if (isFetching) {
    return (
      <div className="flex min-h-screen bg-zinc-950 text-white">
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
      </div>
    );
  }

  if (isError) {
    return <p className="text-red-500">에러 발생</p>;
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-6xl mx-auto px-6 py-16">
        {/* Header Section */}
        <div className="mb-6 md:mb-14">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <h1 className="text-4xl font-bold tracking-tight wrap-break-word min-w-0">
              {snippet.title}
            </h1>

            <span className="px-4 py-1.5 text-sm rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400">
              {snippet.category}
            </span>
          </div>

          <div className="mt-6 flex justify-end gap-8 text-xs md:text-sm text-zinc-500">
            <p>
              <span className="text-zinc-400">Created · </span>
              {formatDate(snippet.createdAt)}
            </p>
            <p>
              <span className="text-zinc-400">Updated · </span>
              {formatDate(snippet.updatedAt)}
            </p>
          </div>
          <p className="mt-6 flex justify-end text-xs md:text-sm text-zinc-500">
            <span className="text-zinc-400 mr-1">Author · </span>
            {snippet.userId}
          </p>
        </div>

        {/* Playground Card */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 backdrop-blur-sm md:p-6 shadow-xl mb-6 md:mb-16">
          <SnippetPlayground code={snippet.code} />
        </div>

        {/* Description Section */}
        <div className="max-w-6xl">
          <h2 className="text-2xl font-semibold mb-6 tracking-tight">설명</h2>

          <div className="rounded-xl bg-zinc-900/60 border border-zinc-800 p-6 text-zinc-300 leading-relaxed min-w-0 wrap-break-word">
            {snippet.description}
          </div>
        </div>
      </div>
    </div>
  );
}
