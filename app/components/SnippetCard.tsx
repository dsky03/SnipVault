"use client";

import {
  SandpackLayout,
  SandpackPreview,
  SandpackProvider,
} from "@codesandbox/sandpack-react";
import { useState } from "react";
import {
  Code2,
  Eye,
  MoreHorizontal,
  Maximize2,
  Check,
  Copy,
  Pencil,
  Trash2,
} from "lucide-react";
import { Snippet } from "@/app/types/snippet";
import toast from "react-hot-toast";
import { getSandpackFiles } from "../util/sandpack";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAppDispatch, useAppSelector } from "../util/hook";
import { setUpdateSnippetModal } from "../util/modalSlice";

interface Props {
  snippet: Snippet;
}

const SnippetCard = ({ snippet }: Props) => {
  const [showPreview, setShowPreview] = useState(true);
  const [showOption, setShowOption] = useState(false);
  const [copied, setCopied] = useState(false);
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector((state) => state.user.userId);
  const files = getSandpackFiles(snippet.code);
  const router = useRouter();
  const queryClient = useQueryClient();

  const isAuthor = currentUser === snippet.userId;

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (copied) {
      return;
    }
    await navigator.clipboard.writeText(snippet.code);
    setCopied(true);
    toast.success("코드가 클립보드에 복사되었습니다.");
    setTimeout(() => setCopied(false), 2000);
  };

  const goSnippetDetail = () => {
    router.push(`/Snippet/${snippet._id}`);
  };

  const handleModify = () => {
    dispatch(setUpdateSnippetModal({ open: true, snippetId: snippet._id }));
  };

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/snippets/${id}`);
    },
    onSuccess: () => {
      toast.success("삭제 완료");
      queryClient.invalidateQueries({ queryKey: ["snippets"] });
    },
    onError: () => {
      toast.error("삭제 실패");
    },
  });

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-xl border hover:border-[#7738EF]/20 hover:shadow-lg hover:shadow-[#7738EF]/20">
      <div className="relative overflow-hidden h-40 w-68 md:w-80">
        {showPreview ? (
          <SandpackProvider
            template="react"
            theme={"dark"}
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
                style={{
                  height: "100%",
                  width: "100%",
                }}
              />
            </SandpackLayout>
          </SandpackProvider>
        ) : (
          <pre className="custom-scroll h-full w-full bg-[#0f1117] p-4 text-xs font-mono text-gray-300 overflow-auto rounded-t-xl">
            <code>{snippet.code}</code>
          </pre>
        )}
        {showOption ? (
          <div className="absolute inset-0 flex items-center justify-center gap-2 bg-[#212127]/20 backdrop-blur-sm transition-opacity">
            <button
              className="flex items-center justify-center h-8 w-8 rounded-full bg-[#212127] text-white hover:bg-[#30303a]"
              onClick={goSnippetDetail}
            >
              <Maximize2 className="h-3.5 w-3.5" />
            </button>
            <button
              className={`flex items-center justify-center h-8 w-8 rounded-full bg-[#212127] text-white ${copied ? "bg-green-500" : "hover:bg-[#30303a]"}`}
              onClick={handleCopy}
            >
              {copied ? (
                <Check className="h-3.5 w-3.5" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
            </button>
            <button
              disabled={!isAuthor}
              className={`flex items-center justify-center h-8 w-8 rounded-full ${
                isAuthor
                  ? "bg-[#212127] text-white hover:bg-[#30303a]"
                  : "bg-zinc-800 text-zinc-500 cursor-not-allowed"
              }`}
              onClick={handleModify}
            >
              <Pencil className="h-3.5 w-3.5" />
            </button>
            <button
              disabled={!isAuthor}
              className={`flex items-center justify-center h-8 w-8 rounded-full ${
                isAuthor
                  ? "bg-red-500 text-white hover:bg-red-400"
                  : "bg-zinc-800 text-zinc-500 cursor-not-allowed"
              }`}
              onClick={() => deleteMutation.mutate(snippet._id)}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        ) : (
          <></>
        )}

        <button
          className="absolute right-2 top-2 z-10 rounded-md p-1 bg-black text-muted hover:text-white"
          onClick={() => setShowPreview(!showPreview)}
        >
          {showPreview ? (
            <Code2 className="h-3.5 w-3.5" />
          ) : (
            <Eye className="h-3.5 w-3.5" />
          )}
        </button>

        <button
          className="absolute right-9 top-2 z-10 rounded-md p-1 bg-black text-muted hover:text-white"
          onClick={() => setShowOption(!showOption)}
        >
          <MoreHorizontal className="h-3.5 w-3.5" />
        </button>
      </div>
      <div className="flex flex-col justify-between p-4 gap-2">
        <h3 className="truncate max-w-65 text-xl text-white font-semibold">
          {snippet.title}
        </h3>
        <div className="flex justify-between">
          <span className="text-sm text-muted">{snippet.category}</span>
          <span className="inline-block truncate max-w-20 text-sm text-muted">
            {snippet.userId}
          </span>
        </div>
      </div>
    </div>
  );
};

export default SnippetCard;
