"use client";

import { forwardRef } from "react";
import { BrandLogo } from "@/components/brand-logo";
import type { Student } from "@/lib/api";
import { GRADING_SCALE, getPassFailStatus } from "@/lib/grades";
import { cn } from "@/lib/utils";

type ResultSheetProps = {
  student: Pick<Student, "student_id" | "name" | "subjects" | "total" | "grade">;
  className?: string;
};

/** Official white result document — screen + print */
export const ResultSheet = forwardRef<HTMLDivElement, ResultSheetProps>(
  function ResultSheet({ student, className }, ref) {
    const subjects = Object.entries(student.subjects || {}).filter(
      ([key]) => key.toLowerCase() !== "average"
    );
    const passFail = getPassFailStatus(student.grade);
    const passed = passFail.status === "PASS";

    return (
      <div
        ref={ref}
        className={cn(
          "result-pdf-sheet mx-auto w-full max-w-[210mm] bg-white text-slate-900",
          className
        )}
      >
        <div className="result-sheet-logo-bar border-b border-slate-200 px-4 py-5 text-center sm:px-6 sm:py-6">
          <BrandLogo variant="result" />
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

        <div className="grid grid-cols-3 gap-2 border-b border-slate-200 bg-slate-50 px-4 py-4 sm:gap-3 sm:px-8">
          <div className="rounded-lg border border-slate-200 bg-white px-2 py-3 text-center sm:px-4">
            <p className="text-[10px] font-medium uppercase tracking-wide text-slate-500 sm:text-xs">
              Total Score
            </p>
            <p className="mt-1 text-2xl font-black tabular-nums text-slate-900 sm:text-3xl">
              {student.total}
            </p>
          </div>
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-2 py-3 text-center sm:px-4">
            <p className="text-[10px] font-medium uppercase tracking-wide text-slate-500 sm:text-xs">
              Final Grade
            </p>
            <p className="mt-1 text-2xl font-black text-emerald-700 sm:text-3xl">
              {student.grade}
            </p>
          </div>
          <div
            className={cn(
              "rounded-lg border px-2 py-3 text-center sm:px-4",
              passed
                ? "border-emerald-300 bg-emerald-50"
                : "border-rose-300 bg-rose-50"
            )}
          >
            <p className="text-[10px] font-medium uppercase tracking-wide text-slate-500 sm:text-xs">
              Result Status
            </p>
            <p
              className={cn(
                "mt-1 text-xl font-black uppercase sm:text-2xl",
                passed ? "text-emerald-700" : "text-rose-700"
              )}
            >
              {passFail.label}
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

        <div className="border-t border-slate-200 px-4 py-4 sm:px-8">
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
            Grading System
          </p>
          <div className="overflow-hidden rounded-lg border border-slate-200 text-xs">
            <div className="grid grid-cols-3 bg-slate-100 px-3 py-2 font-semibold text-slate-600">
              <span>Grade</span>
              <span>Marks range</span>
              <span>Remark</span>
            </div>
            {GRADING_SCALE.map((row) => (
              <div
                key={row.grade}
                className="grid grid-cols-3 border-t border-slate-200 px-3 py-1.5 text-slate-700"
              >
                <span className="font-bold">{row.grade}</span>
                <span>{row.range}</span>
                <span>{row.remark}</span>
              </div>
            ))}
          </div>
          <p className="mt-2 text-center text-[10px] text-slate-500">
            Pass: Grade C or above · Failed: Grade D or F
          </p>
        </div>

        <div className="border-t border-slate-200 px-4 py-3 text-center text-[10px] text-slate-400 sm:px-8">
          Schools Joint Exam Center — Mogadishu · Official Result
        </div>
      </div>
    );
  }
);
