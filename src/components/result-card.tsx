"use client";

import { BrandLogo } from "@/components/brand-logo";
import type { Student } from "@/lib/api";
import { cn } from "@/lib/utils";

type ResultCardProps = {
  student: Pick<Student, "student_id" | "name" | "subjects" | "total" | "grade">;
  className?: string;
};

/** On-screen result — dark theme, stacked layout (no overlap on mobile) */
export function ResultCard({ student, className }: ResultCardProps) {
  const subjects = Object.entries(student.subjects || {}).filter(
    ([key]) => key.toLowerCase() !== "average"
  );

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-white/10 bg-[#0c1219]/95 shadow-2xl shadow-black/40",
        className
      )}
    >
      <div className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-emerald-600 via-emerald-400 to-transparent" />

      <div className="border-b border-white/10 px-4 py-5 text-center sm:px-8 sm:py-6">
        <BrandLogo variant="header" framed className="mx-auto max-w-lg" />
        <p className="mt-5 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
          Student Information
        </p>
        <h2 className="mt-2 break-words text-2xl font-bold text-white sm:text-3xl">
          {student.name}
        </h2>
        <p className="mt-1 font-mono text-lg text-emerald-400">{student.student_id}</p>
      </div>

      <div className="space-y-4 px-4 py-5 sm:px-8 sm:py-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
          Subject Marks
        </p>
        <div className="space-y-2">
          {subjects.length > 0 ? (
            subjects.map(([subject, score]) => (
              <div
                key={subject}
                className="subject-item flex items-center justify-between gap-3 rounded-xl px-4 py-3"
              >
                <span className="min-w-0 flex-1 break-words font-medium capitalize text-slate-200">
                  {subject}
                </span>
                <span className="shrink-0 text-xl font-bold tabular-nums text-white">
                  {score}
                </span>
              </div>
            ))
          ) : (
            <p className="text-sm text-slate-500">No subject data</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3 pt-2">
          <div className="performance-container rounded-2xl px-4 py-5 text-center">
            <p className="text-xs text-slate-500">Total Score</p>
            <p className="mt-1 text-4xl font-black tabular-nums text-white sm:text-5xl">
              {student.total}
            </p>
          </div>
          <div className="performance-container flex flex-col items-center justify-center rounded-2xl px-4 py-5 text-center">
            <p className="text-xs text-slate-500">Final Grade</p>
            <div className="grade-badge mt-2 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground sm:h-16 sm:w-16">
              {student.grade}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
