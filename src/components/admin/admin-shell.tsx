"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Users,
  FileSpreadsheet,
  LogOut,
  ExternalLink,
  Bell,
  PanelLeftClose,
  PanelLeft,
  Menu,
  X,
} from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { AdminTab } from "@/lib/analytics";

const NAV: { tab: AdminTab; label: string; icon: typeof LayoutDashboard }[] = [
  { tab: "overview", label: "Dashboard", icon: LayoutDashboard },
  { tab: "records", label: "Student Records", icon: Users },
  { tab: "reports", label: "Exam Results", icon: FileSpreadsheet },
];

const TITLES: Record<AdminTab, string> = {
  overview: "Dashboard",
  records: "Student Records",
  reports: "Exam Results",
};

export function AdminShell({
  children,
  onLogout,
  activeTab = "overview",
}: {
  children: React.ReactNode;
  onLogout: () => void;
  activeTab?: AdminTab;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("admin_sidebar_collapsed");
    if (saved === "1") setCollapsed(true);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const toggleCollapsed = () => {
    setCollapsed((c) => {
      const next = !c;
      localStorage.setItem("admin_sidebar_collapsed", next ? "1" : "0");
      return next;
    });
  };

  return (
    <div className="flex min-h-screen">
      {mobileOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={() => setMobileOpen(false)}
          aria-label="Close menu"
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-[min(100vw,280px)] flex-col border-r border-white/[0.06] bg-[#060a10] transition-transform duration-300 ease-in-out lg:w-[280px]",
          collapsed && "lg:w-[72px]",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div
          className={cn(
            "flex items-center border-b border-white/[0.06]",
            collapsed ? "justify-center px-2 py-3 lg:py-4" : "justify-between gap-2 px-3 py-3"
          )}
        >
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <BrandLogo variant="sidebar" />
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileOpen(false)}
            className="shrink-0 text-slate-400 hover:text-white lg:hidden"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleCollapsed}
            className="hidden shrink-0 text-slate-400 hover:text-white lg:flex"
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? (
              <PanelLeft className="h-4 w-4" />
            ) : (
              <PanelLeftClose className="h-4 w-4" />
            )}
          </Button>
        </div>

        {!collapsed && (
          <div className="flex items-center gap-3 border-b border-white/[0.06] px-4 py-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 text-sm font-bold text-white">
              SJ
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-white">Exam Admin</p>
              <p className="truncate text-xs text-slate-500">SJEC Mogadishu</p>
            </div>
          </div>
        )}

        <nav className="flex-1 space-y-1 p-2">
          {NAV.map((item) => {
            const active = activeTab === item.tab;
            const Icon = item.icon;
            const href =
              item.tab === "overview"
                ? "/admin/dashboard"
                : `/admin/dashboard?tab=${item.tab}`;
            return (
              <Link
                key={item.tab}
                href={href}
                onClick={() => setMobileOpen(false)}
                title={collapsed ? item.label : undefined}
                className={cn(
                  "relative flex items-center rounded-lg py-2.5 text-sm font-medium transition-colors",
                  collapsed ? "justify-center px-2" : "gap-3 px-3",
                  active
                    ? "bg-emerald-500/10 text-emerald-400"
                    : "text-slate-500 hover:bg-white/[0.04] hover:text-slate-300"
                )}
              >
                {active && (
                  <span className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-emerald-500" />
                )}
                <Icon className="h-4 w-4 shrink-0" />
                {!collapsed && item.label}
              </Link>
            );
          })}
        </nav>

        <div className="space-y-2 border-t border-white/[0.06] p-2">
          <Link
            href="/"
            title={collapsed ? "Public portal" : undefined}
            className={cn(
              "flex items-center rounded-lg text-xs text-slate-500 transition hover:bg-white/[0.04] hover:text-slate-300",
              collapsed ? "justify-center p-2.5" : "gap-2 px-3 py-2"
            )}
          >
            <ExternalLink className="h-3.5 w-3.5 shrink-0" />
            {!collapsed && "Public result portal"}
          </Link>
          {!collapsed && (
            <p className="px-3 text-[10px] text-slate-600">v2.1.0</p>
          )}
        </div>
      </aside>

      <div
        className={cn(
          "flex min-h-screen min-w-0 flex-1 flex-col transition-[padding] duration-300",
          "max-lg:pl-0",
          collapsed ? "lg:pl-[72px]" : "lg:pl-[280px]"
        )}
      >
        <header className="sticky top-0 z-20 flex min-h-[56px] flex-wrap items-center justify-between gap-2 border-b border-white/[0.06] bg-[#080c12]/80 px-3 py-2 backdrop-blur-xl safe-pad-x sm:min-h-[60px] sm:px-6 sm:py-0">
          <div className="flex min-w-0 flex-1 items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="shrink-0 text-slate-400 lg:hidden"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </Button>
            <h1 className="truncate text-base font-semibold tracking-tight text-white sm:text-xl">
              {TITLES[activeTab]}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="hidden text-slate-500 hover:text-slate-300 sm:flex"
              onClick={toggleCollapsed}
            >
              <PanelLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-slate-500 hover:text-slate-300"
            >
              <Bell className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onLogout}
              className="text-slate-400 hover:text-white"
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </header>

        <main className="min-w-0 flex-1 overflow-x-hidden p-3 sm:p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

export function GradePill({ grade }: { grade: string }) {
  const g = grade.toUpperCase();
  const styles: Record<string, string> = {
    A: "bg-emerald-500/20 text-emerald-400 ring-emerald-500/30",
    B: "bg-teal-500/20 text-teal-400 ring-teal-500/30",
    C: "bg-amber-500/20 text-amber-400 ring-amber-500/30",
    D: "bg-orange-500/20 text-orange-400 ring-orange-500/30",
    F: "bg-red-500/20 text-red-400 ring-red-500/30",
  };
  return (
    <span
      className={cn(
        "inline-flex min-w-[1.75rem] items-center justify-center rounded-full px-2.5 py-0.5 text-xs font-bold ring-1",
        styles[g] ?? styles.F
      )}
    >
      {grade}
    </span>
  );
}

export function AdminCard({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "rounded-xl border border-white/[0.08] bg-[#0f1419] shadow-xl shadow-black/20",
        className
      )}
    >
      {children}
    </div>
  );
}
