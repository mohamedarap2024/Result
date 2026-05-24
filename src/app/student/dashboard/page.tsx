"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FileText, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BrandLogo } from "@/components/brand-logo";
import { ResultSheet } from "@/components/result-sheet";
import type { Student } from "@/lib/api";
import { useNotice } from "@/components/plain-notice";
import { MSG } from "@/lib/messages";
import { exportElementToPdf } from "@/lib/pdf-export";

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
      await exportElementToPdf(
        resultRef.current,
        `${student.student_id}-result.pdf`
      );
      notify(MSG.save.success);
    } catch {
      notify(MSG.save.failure);
    }
  };

  if (!student) return null;

  return (
    <main className="page-mesh min-h-screen">
      <header className="mx-auto flex max-w-4xl flex-col items-stretch gap-3 px-4 py-4 safe-pad-x sm:flex-row sm:items-center sm:justify-between">
        <BrandLogo variant="header" className="max-w-[min(100%,420px)] self-center sm:self-auto" />
        <Button variant="ghost" onClick={handleLogout} className="w-full shrink-0 gap-2 sm:w-auto">
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </header>

      <div className="mx-auto w-full max-w-4xl px-4 pb-16 safe-pad-x">
        <ResultSheet ref={resultRef} student={student} />

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button onClick={handleDownloadPdf} className="w-full gap-2 sm:w-auto">
            <FileText className="h-4 w-4" />
            Download result report
          </Button>
          <Link href="/" className="w-full sm:w-auto">
            <Button variant="outline" className="w-full">
              Public portal
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
