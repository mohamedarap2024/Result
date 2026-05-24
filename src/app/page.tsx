"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ArrowLeft, FileText, Sparkles } from "lucide-react";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { api, Student } from "@/lib/api";
import { BrandLogo } from "@/components/brand-logo";
import { useNotice } from "@/components/plain-notice";
import { MSG, getApiMessage } from "@/lib/messages";
export default function Home() {
  const notify = useNotice();
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<Student | null>(null);
  const [loading, setLoading] = useState(false);
  const resultRef = useRef<HTMLDivElement | null>(null);

  const subjectEntries = result ? Object.entries(result.subjects || {}) : [];

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    try {
      const res = await api.get(
        `/students/search/${encodeURIComponent(query.trim())}`
      );
      setResult(res.data.data);
      notify(res.data.message || MSG.search.found);
    } catch (err: unknown) {
      setResult(null);
      notify(getApiMessage(err, MSG.search.notFound));
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPdf = async () => {
    if (!resultRef.current || !result) return;
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
      pdf.save(`${result.student_id}-result.pdf`);
      notify(MSG.save.success);
    } catch {
      notify(MSG.save.failure);
    }
  };

  return (
    <main className="page-mesh relative min-h-screen">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-0 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-primary/10 blur-[100px]" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-3xl px-4 pb-16 pt-4 text-center safe-pad-x sm:px-6 sm:pt-8">
        {!result && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="flex flex-col items-center"
          >
            <BrandLogo variant="header" className="mb-5 px-2 sm:mb-6" />

            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              Official Results Portal
            </div>

            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl">
              <span className="text-gradient">Student Result</span>{" "}
              <span className="text-foreground">Portal</span>
            </h1>

            <p className="mx-auto mt-3 max-w-lg px-1 text-sm leading-relaxed text-muted-foreground sm:text-lg">
              Enter your Student ID to view exam marks instantly — secure,
              accurate, and official.
            </p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.4 }}
              className="mx-auto mt-6 w-full max-w-xl sm:mt-7"
            >
              <div className="glass-panel home-search-panel rounded-2xl border border-primary/15 p-3 shadow-xl shadow-black/25 sm:p-2.5">
                <form
                  onSubmit={handleSearch}
                  className="flex flex-col gap-3 sm:flex-row sm:items-stretch sm:gap-2"
                >
                  <div className="relative min-w-0 flex-1">
                    <Search className="pointer-events-none absolute left-4 top-1/2 z-10 h-5 w-5 -translate-y-1/2 text-primary/70" />
                    <Input
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Enter your Student ID"
                      inputMode="numeric"
                      autoComplete="off"
                      className="h-14 rounded-xl border border-white/10 bg-black/20 pl-12 pr-4 text-base shadow-inner shadow-black/20 placeholder:text-muted-foreground/80 focus-visible:border-primary/40 focus-visible:ring-2 focus-visible:ring-primary/30 sm:h-14"
                      autoFocus
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={loading}
                    size="lg"
                    className="h-14 w-full shrink-0 rounded-xl px-8 text-base font-semibold shadow-lg shadow-primary/30 transition-transform active:scale-[0.98] sm:h-14 sm:min-w-[9.5rem] sm:w-auto"
                  >
                    {loading ? "Searching…" : "Search"}
                  </Button>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}

        <AnimatePresence mode="wait">
          {result && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="mt-4 text-left"
            >
              <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
                <Button
                  variant="ghost"
                  onClick={() => setResult(null)}
                  className="w-full justify-center gap-2 text-muted-foreground sm:w-auto sm:justify-start"
                >
                  <ArrowLeft className="h-4 w-4" />
                  New search
                </Button>
                <Button
                  variant="outline"
                  onClick={handleDownloadPdf}
                  className="w-full gap-2 border-primary/25 bg-primary/10 text-primary hover:bg-primary/15 sm:w-auto"
                >
                  <FileText className="h-4 w-4" />
                  Download PDF
                </Button>
              </div>

              <div
                ref={resultRef}
                className="glass-panel overflow-hidden rounded-2xl p-4 sm:p-6 md:p-8"
              >
                <div className="absolute left-0 top-0 h-1 w-full card-top-gradient" />

                <div className="mb-6 border-b border-border pb-6 text-center sm:mb-8 sm:pb-8">
                  <BrandLogo variant="header" className="mx-auto mb-4 max-w-xl px-2 sm:mb-6" />
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                    Student Information
                  </p>
                  <h2 className="mt-2 break-words text-2xl font-bold sm:text-3xl">{result.name}</h2>
                  <p className="mt-1 font-mono text-base text-primary sm:text-lg">
                    {result.student_id}
                  </p>
                </div>

                <div className="grid gap-6 md:grid-cols-2 md:gap-8">
                  <div>
                    <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                      Subject Marks
                    </p>
                    <div className="space-y-2">
                      {subjectEntries.length > 0 ? (
                        subjectEntries.map(([subject, score]) => (
                          <div
                            key={subject}
                            className="subject-item flex items-center justify-between rounded-xl px-4 py-3"
                          >
                            <span className="font-medium">{subject}</span>
                            <span className="text-xl font-bold tabular-nums">
                              {score}
                            </span>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-muted-foreground">
                          No subject data
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="performance-container flex flex-col items-center justify-center rounded-2xl p-6 text-center sm:p-8">
                    <p className="text-sm text-muted-foreground">Total Score</p>
                    <p className="mt-1 text-5xl font-black tabular-nums sm:text-6xl">
                      {result.total}
                    </p>
                    <div className="my-6 h-px w-full performance-divider" />
                    <p className="text-sm text-muted-foreground">Final Grade</p>
                    <div className="grade-badge mt-3 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
                      {result.grade}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
