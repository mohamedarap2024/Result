"use client";

import { forwardRef } from "react";
import { LOGO_SRC } from "@/components/brand-logo";
import type { Student } from "@/lib/api";
import { cn } from "@/lib/utils";

const LOGO_ALT =
  "Schools Joint Exam Center Mogadishu — امتحان مشترك لمدارس مقديشو";

type ResultSheetProps = {
  student: Pick<Student, "student_id" | "name" | "subjects" | "total" | "grade">;
  className?: string;
};

export const ResultSheet = forwardRef<HTMLDivElement, ResultSheetProps>(
  function ResultSheet({ student, className }, ref) {
    const subjects = Object.entries(student.subjects || {}).filter(
      ([key]) => key.toLowerCase() !== "average"
    );

    return (
      <div
        ref={ref}
        className={cn(
          "result-pdf-sheet mx-auto w-full max-w-[210mm] bg-white text-slate-900",
          className
        )}
      >
        <div className="border-b border-slate-200 px-4 py-5 text-center sm:px-8 sm:py-6">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={LOGO_SRC}
            alt={LOGO_ALT}
            className="mx-auto h-auto w-full max-h-28 object-contain sm:max-h-36"
            crossOrigin="anonymous"
          />
        </div>

        <div className="border-b border-slate-200 px-4 py-5 text-center sm:px-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
            Student Information
          </p>
          <h2 className="mt-2 break-words text-xl font-bold text-slate-900 sm:text-2xl">
            {student.name}
          </h2>
          <p className="mt-1 font-mono text-lg font-semibold text-emerald-700">
            {student.student_id}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 border-b border-slate-200 bg-slate-50 px-4 py-4 sm:px-8">
          <div className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-center">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Total Score
            </p>
            <p className="mt-1 text-3xl font-black tabular-nums text-slate-900 sm:text-4xl">
              {student.total}
            </p>
          </div>
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-center">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Final Grade
            </p>
            <p className="mt-1 text-3xl font-black text-emerald-700 sm:text-4xl">
              {student.grade}
            </p>
          </div>
        </div>

        <div className="px-4 py-5 sm:px-8 sm:py-6">
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
            Subject Marks
          </p>
          {subjects.length > 0 ? (
            <div className="space-y-2">
              {subjects.map(([subject, score]) => (
                <div
                  key={subject}
                  className="result-subject-row flex items-center justify-between gap-4 rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5"
                >
                  <span className="min-w-0 flex-1 break-words font-medium capitalize text-slate-800">
                    {subject}
                  </span>
                  <span className="shrink-0 text-lg font-bold tabular-nums text-slate-900">
                    {score}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-500">No subject data</p>
          )}
        </div>

        <div className="border-t border-slate-200 px-4 py-3 text-center text-[10px] text-slate-400 sm:px-8">
          Schools Joint Exam Center — Mogadishu · Official Result
        </div>
      </div>
    );
  }
);
