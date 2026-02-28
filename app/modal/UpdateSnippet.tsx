"use client";
import { useState, useEffect, useMemo } from "react";
import CustomDropdown from "../components/CustomDropdown";
import { getSandpackFiles } from "../util/sandpack";
import {
  SandpackLayout,
  SandpackPreview,
  SandpackProvider,
} from "@codesandbox/sandpack-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import toast from "react-hot-toast";
import { useAppDispatch, useAppSelector } from "../util/hook";
import {
  setCreateSnippetModal,
  setUpdateSnippetModal,
} from "../util/modalSlice";
import { AnimatePresence, motion } from "motion/react";

const MAX_TITLE = 40;
const MAX_DESCRIPTION = 160;
const MAX_CODE = 8000;

const UpdateSnippet = () => {
  const categoryOptions = [
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

  const id = useAppSelector((state) => state.modal.updateSnippetId);

  const { data: snippet, isPending } = useQuery({
    queryKey: ["snippet", id],
    queryFn: async () => {
      const res = await api.get(`/snippets/${id}`);
      return res.data;
    },
    enabled: !!id,
    refetchOnWindowFocus: false,
  });

  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [code, setCode] = useState("");

  useEffect(() => {
    if (!snippet) return;

    setTitle(snippet.title ?? "");
    setDescription(snippet.description ?? "");
    setCategory(snippet.category ?? "");
    setCode(snippet.code ?? "");
  }, [snippet]);

  const files = useMemo(() => getSandpackFiles(code), [code]);

  const clamp =
    (max: number) =>
    (v: string): string =>
      v.length > max ? v.slice(0, max) : v;

  const updateSnippetMutation = useMutation({
    mutationFn: async () => {
      const res = await api.put(`/snippets/${id}`, {
        title: title.trim(),
        description: description.trim(),
        category,
        code: code.trim(),
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["snippets"] });
      queryClient.invalidateQueries({ queryKey: ["snippet", id] });
      toast.success("수정 완료");
      dispatch(setUpdateSnippetModal({ open: false, snippetId: "" }));
    },
    onError: () => {
      toast.error("수정 실패");
    },
  });

  const handleSubmit = () => {
    const trimmedTitle = title.trim();
    const trimmedDesc = description.trim();
    const trimmedCode = code.trim();

    if (!trimmedTitle || !trimmedDesc || !category || !trimmedCode) {
      toast.error("모든 내용을 채워주세요.");
      return;
    }

    if (trimmedTitle.length > MAX_TITLE) {
      toast.error(`제목은 최대 ${MAX_TITLE}자까지 가능합니다.`);
      return;
    }

    if (trimmedDesc.length > MAX_DESCRIPTION) {
      toast.error(`설명은 최대 ${MAX_DESCRIPTION}자까지 가능합니다.`);
      return;
    }

    if (trimmedCode.length > MAX_CODE) {
      toast.error(`코드는 최대 ${MAX_CODE.toLocaleString()}자까지 가능합니다.`);
      return;
    }

    updateSnippetMutation.mutate();
  };

  const counterClass = (len: number, max: number) =>
    len > max
      ? "text-red-400"
      : len >= max * 0.9
        ? "text-amber-300"
        : "text-zinc-400";

  return (
    <div className="w-[80vw] h-[60vh] max-h-2xl max-w-2xl rounded-2xl flex p-2  flex-col gap-5 overflow-auto scrollbar-hidden">
      {isPending ? (
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
      ) : (
        <>
          <h2 className="text-xl font-semibold tracking-tight">스니펫 수정</h2>
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-end">
              <label className="text-sm text-zinc-300">제목</label>
              <span
                className={`text-xs ${counterClass(title.length, MAX_TITLE)}`}
              >
                {title.length}/{MAX_TITLE}
              </span>
            </div>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(clamp(MAX_TITLE)(e.target.value))}
              maxLength={MAX_TITLE}
              placeholder="예: Primary Button UI"
              className="bg-zinc-800 placeholder:text-zinc-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary transition"
            />
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-end">
              <label className="text-sm text-zinc-300">설명</label>
              <span
                className={`text-xs ${counterClass(
                  description.length,
                  MAX_DESCRIPTION,
                )}`}
              >
                {description.length}/{MAX_DESCRIPTION}
              </span>
            </div>
            <textarea
              rows={3}
              value={description}
              onChange={(e) =>
                setDescription(clamp(MAX_DESCRIPTION)(e.target.value))
              }
              maxLength={MAX_DESCRIPTION}
              placeholder="간단한 설명을 입력하세요"
              className="bg-zinc-800 placeholder:text-zinc-300 rounded-lg px-3 py-2 outline-none resize-none focus:ring-2 focus:ring-primary transition"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm text-zinc-300">카테고리</label>
            <CustomDropdown
              options={categoryOptions}
              value={category}
              onChange={setCategory}
              placeholder="카테고리 선택"
            />
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-end">
              <label className="text-sm text-zinc-300">코드</label>
              <span
                className={`text-xs ${counterClass(code.length, MAX_CODE)}`}
              >
                {code.length.toLocaleString()}/{MAX_CODE.toLocaleString()}
              </span>
            </div>
            <textarea
              rows={10}
              value={code}
              spellCheck={false}
              onChange={(e) => setCode(clamp(MAX_CODE)(e.target.value))}
              maxLength={MAX_CODE}
              className="font-mono resize-none custom-scroll text-sm bg-black rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-primary transition"
            />
          </div>

          {/* 미리보기 */}
          <div className="flex flex-col gap-2">
            <label className="text-sm text-zinc-300">미리보기</label>

            <div className="rounded-xl overflow-hidden border border-zinc-800">
              <SandpackProvider
                template="react"
                theme="dark"
                files={files}
                options={{
                  externalResources: ["https://cdn.tailwindcss.com"],
                }}
              >
                <SandpackLayout>
                  <SandpackPreview
                    showOpenInCodeSandbox={false}
                    showNavigator={false}
                    showRefreshButton={true}
                    style={{ height: 200 }}
                  />
                </SandpackLayout>
              </SandpackProvider>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              className="px-4 py-2 rounded-lg bg-zinc-700 hover:bg-zinc-600 transition"
              onClick={() =>
                dispatch(setUpdateSnippetModal({ open: false, snippetId: "" }))
              }
              disabled={updateSnippetMutation.isPending}
            >
              취소
            </button>
            <button
              className="px-4 py-2 rounded-lg transition font-medium bg-violet-500 hover:bg-violet-600"
              onClick={handleSubmit}
              disabled={updateSnippetMutation.isPending}
            >
              {updateSnippetMutation.isPending ? "저장 중..." : "저장하기"}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default UpdateSnippet;
