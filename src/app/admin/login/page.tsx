"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Lock,
  ArrowRight,
  User,
  HelpCircle,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { useNotice } from "@/components/plain-notice";
import { MSG, getApiMessage } from "@/lib/messages";
import { cn } from "@/lib/utils";

function LoginField({
  label,
  children,
  extra,
}: {
  label: string;
  children: React.ReactNode;
  extra?: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-500">
          {label}
        </label>
        {extra}
      </div>
      {children}
    </div>
  );
}

export default function AdminLogin() {
  const notify = useNotice();
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/admin/login", {
        username: username.trim(),
        password,
      });
      if (res.data.token) {
        localStorage.setItem("admin_token", res.data.token);
        notify(res.data.message || MSG.login.success);
        router.push("/admin/dashboard");
      }
    } catch (err: unknown) {
      notify(getApiMessage(err, MSG.login.failure));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col bg-[#080c12]">
      <header className="flex h-14 items-center justify-end border-b border-white/[0.06] px-4 safe-pad-x sm:px-6">
        <button
          type="button"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-slate-500 transition hover:border-white/20 hover:text-slate-300"
          aria-label="Help"
        >
          <HelpCircle className="h-4 w-4" />
        </button>
      </header>

      <div className="relative flex flex-1 flex-col items-center justify-center px-4 py-10">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-1/2 top-1/4 h-[400px] w-[400px] -translate-x-1/2 rounded-full bg-emerald-500/[0.07] blur-[100px]" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 w-full max-w-[420px]"
        >
          <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0f1419] shadow-2xl shadow-black/40">
            <div className="h-1 bg-gradient-to-r from-emerald-600 via-emerald-400 to-emerald-600" />

            <div className="p-5 sm:p-8">
              <div className="mb-8 text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 ring-1 ring-emerald-500/20">
                  <Lock className="h-6 w-6 text-emerald-500" />
                </div>
                <h1 className="text-2xl font-bold text-white">Admin Access</h1>
                <p className="mt-2 text-sm text-slate-500">
                  Sign in to manage student records and exam results
                </p>
              </div>

              <form onSubmit={handleLogin} className="space-y-5">
                <LoginField label="Username or email">
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-600" />
                    <input
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Enter your username"
                      required
                      className="h-11 w-full rounded-lg border border-white/10 bg-[#0a0f14] pl-10 pr-3 text-sm text-slate-100 placeholder:text-slate-600 focus:border-emerald-500/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                    />
                  </div>
                </LoginField>

                <LoginField
                  label="Password"
                  extra={
                    <span className="text-[10px] font-medium text-emerald-500">
                      Forgot?
                    </span>
                  }
                >
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-600" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="h-11 w-full rounded-lg border border-white/10 bg-[#0a0f14] pl-10 pr-3 text-sm text-slate-100 placeholder:text-slate-600 focus:border-emerald-500/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                    />
                  </div>
                </LoginField>

                <Button
                  type="submit"
                  disabled={loading}
                  className={cn(
                    "h-12 w-full gap-2 rounded-lg bg-emerald-600 text-base font-semibold text-white",
                    "shadow-lg shadow-emerald-900/40 hover:bg-emerald-500",
                    "transition-all hover:shadow-emerald-500/25"
                  )}
                >
                  {loading ? "Signing in…" : "Sign In"}
                  {!loading && <ArrowRight className="h-4 w-4" />}
                </Button>
              </form>

              <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-500">
                <Shield className="h-3.5 w-3.5 text-emerald-600" />
                Secure institutional gateway enabled
              </div>
            </div>
          </div>

          <p className="mt-6 text-center text-sm text-slate-600">
            <Link href="/" className="text-emerald-600/80 transition hover:text-emerald-500">
              ← Back to public portal
            </Link>
          </p>
        </motion.div>
      </div>

      <footer className="border-t border-white/[0.06] px-4 py-5 text-center safe-pad-x sm:px-6">
        <div className="flex flex-wrap justify-center gap-4 text-xs text-slate-500 sm:gap-6">
          <span className="cursor-default hover:text-slate-400">Privacy</span>
          <span className="cursor-default hover:text-slate-400">Security</span>
          <span className="cursor-default hover:text-slate-400">Support</span>
        </div>
        <p className="mt-2 text-[11px] text-slate-600">
          © {new Date().getFullYear()} Schools Joint Exam Center — Mogadishu
        </p>
      </footer>
    </main>
  );
}
