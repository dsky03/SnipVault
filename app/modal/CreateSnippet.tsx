"use client";
import { useMemo, useState } from "react";
import CustomDropdown from "../components/CustomDropdown";
import { getSandpackFiles } from "../util/sandpack";
import {
  SandpackLayout,
  SandpackPreview,
  SandpackProvider,
} from "@codesandbox/sandpack-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import toast from "react-hot-toast";
import { useAppDispatch } from "../util/hook";
import { setCreateSnippetModal } from "../util/modalSlice";

const MAX_TITLE = 40;
const MAX_DESCRIPTION = 160;
const MAX_CODE = 8000;

const CreateSnippet = () => {
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

  const dispatch = useAppDispatch();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [code, setCode] = useState(`export default function App() {
  return (
    <div className="min-h-screen bg-zinc-950 grid place-items-center p-6 overflow-x-auto">
      <div className="min-w-max">
        {/* Component */}
      </div>
    </div>
  );
}`);

  const files = useMemo(() => getSandpackFiles(code), [code]);
  const queryClient = useQueryClient();

  const createSnippetMutation = useMutation({
    mutationFn: async (newSnippet: {
      title: string;
      description: string;
      category: string;
      code: string;
    }) => {
      const res = await api.post("/snippets", newSnippet);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["snippets"] });
      toast.success("저장 완료");
      dispatch(setCreateSnippetModal(false));
    },
    onError: () => {
      toast.error("저장 실패");
    },
  });

  const clamp =
    (max: number) =>
    (v: string): string =>
      v.length > max ? v.slice(0, max) : v;

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

    createSnippetMutation.mutate({
      title: trimmedTitle,
      description: trimmedDesc,
      category,
      code: trimmedCode,
    });
  };

  const titleLen = title.length;
  const descLen = description.length;
  const codeLen = code.length;

  const counterClass = (len: number, max: number) =>
    len > max
      ? "text-red-400"
      : len >= max * 0.9
        ? "text-amber-300"
        : "text-zinc-400";

  return (
    <div className="w-[80vw] h-[60vh] max-h-2xl max-w-2xl rounded-2xl flex p-2 flex-col gap-5 overflow-auto scrollbar-hidden">
      <h2 className="text-xl font-semibold tracking-tight">새 스니펫 추가</h2>

      <div className="flex flex-col gap-2">
        <div className="flex items-end justify-between">
          <label className="text-sm text-zinc-300">제목</label>
          <span className={`text-xs ${counterClass(titleLen, MAX_TITLE)}`}>
            {titleLen}/{MAX_TITLE}
          </span>
        </div>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(clamp(MAX_TITLE)(e.target.value))}
          placeholder="예: Primary Button UI"
          className="bg-zinc-800 placeholder:text-zinc-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary transition"
          maxLength={MAX_TITLE}
        />
        <p className="text-xs text-zinc-500">
          제목은 {MAX_TITLE}자 이내로 입력하세요.
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-end justify-between">
          <label className="text-sm text-zinc-300">설명</label>
          <span className={`text-xs ${counterClass(descLen, MAX_DESCRIPTION)}`}>
            {descLen}/{MAX_DESCRIPTION}
          </span>
        </div>
        <textarea
          rows={3}
          value={description}
          onChange={(e) =>
            setDescription(clamp(MAX_DESCRIPTION)(e.target.value))
          }
          placeholder="간단한 설명을 입력하세요"
          className="bg-zinc-800 placeholder:text-zinc-300 rounded-lg px-3 py-2 outline-none resize-none focus:ring-2 focus:ring-primary transition"
          maxLength={MAX_DESCRIPTION}
        />
        <p className="text-xs text-zinc-500">
          설명은 {MAX_DESCRIPTION}자 이내로 입력하세요.
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm text-zinc-300">카테고리</label>
        <CustomDropdown
          options={categoryOptions}
          value={category}
          onChange={setCategory}
          placeholder="카테고리 선택"
        />
        {!category && (
          <p className="text-xs text-zinc-500">
            카테고리를 선택해야 저장할 수 있어요.
          </p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-end justify-between">
          <label className="text-sm text-zinc-300">코드</label>
          <span className={`text-xs ${counterClass(codeLen, MAX_CODE)}`}>
            {codeLen.toLocaleString()}/{MAX_CODE.toLocaleString()}
          </span>
        </div>
        <textarea
          rows={10}
          value={code}
          spellCheck={false}
          onChange={(e) => setCode(clamp(MAX_CODE)(e.target.value))}
          className="font-mono resize-none custom-scroll text-sm bg-black rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-primary transition"
          maxLength={MAX_CODE}
        />
        <p className="text-xs text-zinc-500">
          코드는 {MAX_CODE.toLocaleString()}자 이내로 입력하세요.
        </p>
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
          onClick={() => dispatch(setCreateSnippetModal(false))}
          disabled={createSnippetMutation.isPending}
        >
          취소
        </button>

        <button
          className="px-4 py-2 rounded-lg transition font-medium bg-violet-500 hover:bg-violet-600"
          onClick={handleSubmit}
          disabled={createSnippetMutation.isPending}
        >
          {createSnippetMutation.isPending ? "저장 중..." : "저장하기"}
        </button>
      </div>
    </div>
  );
};

export default CreateSnippet;
