"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import toast from "react-hot-toast";
import { AxiosError } from "axios";

const LoginPage = () => {
  const router = useRouter();
  const queryclient = useQueryClient();
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");

  const loginMutation = useMutation({
    mutationFn: async () => {
      const res = await api.post("/auth/login", {
        userId,
        password,
      });
      return res.data;
    },
    onSuccess: () => {
      queryclient.invalidateQueries({ queryKey: ["me"] });
      router.push("/");
    },
    onError: (error) => {
      const err = error as AxiosError<{ message: string }>;

      toast.error(err.response?.data?.message ?? "로그인 실패");
    },
  });

  const handleSubmit = (e: React.SubmitEvent) => {
    e.preventDefault();
    if (!userId || !password) {
      toast.error("아이디와 비밀번호를 입력하세요");
      return;
    }
    loginMutation.mutate();
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-linear-to-br from-black via-[#0f0f13] to-black px-4">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(139,92,246,0.15),transparent_60%)]" />

      <form
        onSubmit={handleSubmit}
        className="relative z-10 w-full max-w-sm space-y-6 rounded-2xl border border-[#212127] bg-[#0f0f13]/80 p-8 backdrop-blur-xl shadow-2xl"
      >
        <div className="space-y-1 text-center">
          <h1 className="text-2xl font-semibold text-white tracking-tight">
            로그인
          </h1>
          <p className="text-sm text-muted">
            UI 스니펫을 관리하려면 로그인하세요
          </p>
        </div>

        <div className="space-y-4">
          <input
            type="text"
            placeholder="아이디"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            className="h-11 w-full rounded-lg border border-[#212127] bg-[#141419] px-4 text-white placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
          />

          <input
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-11 w-full rounded-lg border border-[#212127] bg-[#141419] px-4 text-white placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
          />
        </div>

        <button
          type="submit"
          disabled={loginMutation.isPending}
          className="h-11 w-full rounded-lg bg-violet-500 font-medium text-white transition hover:bg-violet-600 disabled:opacity-60"
        >
          {loginMutation.isPending ? "로그인 중..." : "로그인"}
        </button>

        <div className="text-center text-sm text-gray-400">
          계정이 없으신가요?{" "}
          <span
            onClick={() => router.push("/signup")}
            className="cursor-pointer text-violet-400 hover:text-violet-300 transition"
          >
            회원가입
          </span>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
