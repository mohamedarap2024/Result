"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User, Lock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { useNotice } from "@/components/plain-notice";
import { MSG, getApiMessage } from "@/lib/messages";

export default function StudentLoginPage() {
  const router = useRouter();
  const notify = useNotice();
  const [studentId, setStudentId] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/students/login", {
        student_id: studentId.trim(),
        password: password || undefined,
      });
      localStorage.setItem("student_token", res.data.token);
      localStorage.setItem(
        "student_profile",
        JSON.stringify(res.data.student)
      );
      notify(res.data.message || MSG.login.success);
      router.push("/student/dashboard");
    } catch (err: unknown) {
      notify(getApiMessage(err, MSG.login.failure));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="page-mesh flex min-h-screen flex-col items-center justify-center px-4 py-8 safe-pad-x sm:py-10">
      <div className="w-full max-w-md">
        <div className="glass-panel rounded-2xl p-5 sm:p-8">
          <h1 className="text-center text-xl font-bold text-foreground">
            Student Login
          </h1>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            Sign in with your Student ID to view results and GPA
          </p>
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div className="relative">
              <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                required
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                placeholder="Student ID"
                className="h-11 w-full rounded-lg border border-border bg-background/50 pl-10 pr-3 text-sm"
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password (if set by school)"
                className="h-11 w-full rounded-lg border border-border bg-background/50 pl-10 pr-3 text-sm"
              />
            </div>
            <Button type="submit" disabled={loading} className="h-11 w-full">
              {loading ? "Signing in…" : "Sign In"}
              {!loading && <ArrowRight className="ml-2 h-4 w-4" />}
            </Button>
          </form>
          <p className="mt-6 text-center text-sm text-muted-foreground">
            <Link href="/" className="text-primary hover:underline">
              Quick search without login
            </Link>
            {" · "}
            <Link href="/admin/login" className="text-primary hover:underline">
              Admin
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
