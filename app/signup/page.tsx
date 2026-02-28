"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import api from "@/lib/axios";
import toast from "react-hot-toast";
import { AxiosError } from "axios";

const SignupPage = () => {
  const router = useRouter();
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const signupMutation = useMutation({
    mutationFn: async () => {
      const res = await api.post("/auth/signup", {
        userId,
        password,
      });
      return res.data;
    },
    onSuccess: () => {
      toast.success("회원가입 완료");
      router.push("/login");
    },
    onError: (error) => {
      const err = error as AxiosError<{ message: string }>;

      toast.error(err.response?.data?.message ?? "회원가입 실패");
    },
  });

  const handleSubmit = (e: React.SubmitEvent) => {
    e.preventDefault();
    if (!userId || !password || !confirmPassword) {
      toast.error("모든 값을 입력하세요");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("비밀번호가 일치하지 않습니다");
      return;
    }

    if (userId.length < 3) {
      toast.error("아이디는 3자 이상이어야 합니다");
      return;
    }

    if (password.length < 6) {
      toast.error("비밀번호는 6자 이상이어야 합니다");
      return;
    }

    signupMutation.mutate();
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
            회원가입
          </h1>
          <p className="text-sm text-muted">
            계정을 생성하고 스니펫을 저장하세요
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

          <input
            type="password"
            placeholder="비밀번호 확인"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="h-11 w-full rounded-lg border border-[#212127] bg-[#141419] px-4 text-white placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
          />
        </div>

        <button
          type="submit"
          disabled={signupMutation.isPending}
          className="h-11 w-full rounded-lg bg-violet-500 font-medium text-white transition hover:bg-violet-600 disabled:opacity-60"
        >
          {signupMutation.isPending ? "가입 중..." : "회원가입"}
        </button>

        <div className="text-center text-sm text-gray-400">
          이미 계정이 있으신가요?{" "}
          <span
            onClick={() => router.push("/login")}
            className="cursor-pointer text-violet-400 hover:text-violet-300 transition"
          >
            로그인
          </span>
        </div>
      </form>
    </div>
  );
};

export default SignupPage;
