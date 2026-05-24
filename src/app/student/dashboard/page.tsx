"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FileText, LogOut, GraduationCap } from "lucide-react";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { Button } from "@/components/ui/button";
import { BrandLogo } from "@/components/brand-logo";
import type { Student } from "@/lib/api";
import { useNotice } from "@/components/plain-notice";
import { MSG } from "@/lib/messages";

export default function StudentDashboardPage() {
  const router = useRouter();
  const notify = useNotice();
  const [student, setStudent] = useState<Student | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const token = localStorage.getItem("student_token");
    const raw = localStorage.getItem("student_profile");
    if (!token || !raw) {
      router.push("/student/login");
      return;
    }
    try {
      setStudent(JSON.parse(raw) as Student);
    } catch {
      router.push("/student/login");
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("student_token");
    localStorage.removeItem("student_profile");
    router.push("/student/login");
  };

  const handleDownloadPdf = async () => {
    if (!resultRef.current || !student) return;
    try {
      const canvas = await html2canvas(resultRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
      });
      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      pdf.addImage(canvas.toDataURL("image/png"), "PNG", 0, 0, imgWidth, imgHeight);
      pdf.save(`${student.student_id}-result.pdf`);
      notify(MSG.save.success);
    } catch {
      notify(MSG.save.failure);
    }
  };

  if (!student) return null;

  const subjects = Object.entries(student.subjects || {});

  return (
    <main className="page-mesh min-h-screen">
      <header className="mx-auto flex max-w-4xl flex-col items-stretch gap-3 px-4 py-4 safe-pad-x sm:flex-row sm:items-center sm:justify-between">
        <BrandLogo variant="header" framed className="max-w-[min(100%,420px)] self-center sm:self-auto" />
        <Button variant="ghost" onClick={handleLogout} className="w-full shrink-0 gap-2 sm:w-auto">
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </header>

      <div className="mx-auto w-full max-w-4xl px-4 pb-16 safe-pad-x">
        <div ref={resultRef} className="glass-panel rounded-2xl p-4 sm:p-6 md:p-8">
          <div className="mb-6 flex justify-center border-b border-border pb-6">
            <BrandLogo variant="header" framed className="mx-auto max-w-xl" />
          </div>
          <div className="mb-6 flex flex-wrap items-start justify-between gap-4 border-b border-border pb-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Student Information
              </p>
              <h1 className="mt-1 break-words text-2xl font-bold sm:text-3xl">{student.name}</h1>
              <p className="mt-1 font-mono text-lg text-primary">
                {student.student_id}
              </p>
            </div>
            <div className="grid grid-cols-3 gap-3 text-center sm:flex sm:gap-6">
              <div>
                <p className="text-xs text-muted-foreground">GPA (4.0)</p>
                <p className="text-2xl font-bold text-primary sm:text-3xl">
                  {student.gpa?.toFixed(1) ?? "—"}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Grade</p>
                <p className="text-2xl font-bold sm:text-3xl">{student.grade}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Average</p>
                <p className="text-2xl font-bold tabular-nums sm:text-3xl">
                  {student.average != null ? `${student.average}%` : "—"}
                </p>
              </div>
            </div>
          </div>

          <p className="mb-3 flex items-center gap-2 text-sm font-semibold text-muted-foreground">
            <GraduationCap className="h-4 w-4" />
            Subject Marks
          </p>
          <div className="grid gap-2 sm:grid-cols-2">
            {subjects.map(([subject, score]) => (
              <div
                key={subject}
                className="subject-item flex justify-between rounded-xl px-4 py-3"
              >
                <span>{subject}</span>
                <span className="font-bold tabular-nums">{score}</span>
              </div>
            ))}
          </div>

          <div className="mt-8 flex items-center justify-between border-t border-border pt-6">
            <div>
              <p className="text-sm text-muted-foreground">Total Score</p>
              <p className="text-3xl font-black tabular-nums sm:text-4xl">{student.total}</p>
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button onClick={handleDownloadPdf} className="w-full gap-2 sm:w-auto">
            <FileText className="h-4 w-4" />
            Download result report
          </Button>
          <Link href="/" className="w-full sm:w-auto">
            <Button variant="outline" className="w-full">Public portal</Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
