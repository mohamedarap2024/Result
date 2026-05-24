"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ArrowLeft, FileText } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { api, Student } from "@/lib/api";
import { PortalHero } from "@/components/portal-hero";
import { ResultCard } from "@/components/result-card";
import { ResultSheet } from "@/components/result-sheet";
import { useNotice } from "@/components/plain-notice";
import { MSG, getApiMessage } from "@/lib/messages";
import { exportElementToPdf } from "@/lib/pdf-export";

export default function Home() {
  const notify = useNotice();
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<Student | null>(null);
  const [loading, setLoading] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);
  const printRef = useRef<HTMLDivElement | null>(null);

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
    if (!printRef.current || !result || pdfLoading) return;
    setPdfLoading(true);
    try {
      await exportElementToPdf(
        printRef.current,
        `${result.student_id}-result.pdf`
      );
      notify(MSG.save.success);
    } catch {
      notify(MSG.save.failure);
    } finally {
      setPdfLoading(false);
    }
  };

  return (
    <main className="page-mesh relative min-h-screen">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-0 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-primary/10 blur-[100px]" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-3xl px-4 pb-16 pt-6 safe-pad-x sm:px-6 sm:pt-10">
        {!result && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="flex flex-col items-center"
          >
            <PortalHero />

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.4 }}
              className="w-full max-w-xl"
            >
              <div className="home-search-hero rounded-2xl border border-primary/20 bg-gradient-to-b from-white/[0.06] to-transparent p-4 shadow-2xl shadow-black/30 sm:p-5">
                <p className="mb-3 text-center text-xs font-medium text-muted-foreground sm:text-sm">
                  Search by Student ID
                </p>
                <form
                  onSubmit={handleSearch}
                  className="flex flex-col gap-3 sm:flex-row sm:items-stretch"
                >
                  <div className="relative min-w-0 flex-1">
                    <Search className="pointer-events-none absolute left-4 top-1/2 z-10 h-5 w-5 -translate-y-1/2 text-primary" />
                    <Input
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Enter your Student ID"
                      inputMode="numeric"
                      autoComplete="off"
                      className="h-14 rounded-xl border border-white/15 bg-black/30 pl-12 pr-4 text-base font-medium shadow-inner placeholder:text-muted-foreground/70 focus-visible:border-primary/50 focus-visible:ring-2 focus-visible:ring-primary/25"
                      autoFocus
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={loading}
                    size="lg"
                    className="h-14 w-full rounded-xl bg-primary px-8 text-base font-semibold text-primary-foreground shadow-lg shadow-primary/35 transition-transform active:scale-[0.98] sm:min-w-[10rem] sm:w-auto"
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
              className="mt-2"
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
                  disabled={pdfLoading}
                  className="w-full gap-2 border-primary/25 bg-primary/10 text-primary hover:bg-primary/15 sm:w-auto"
                >
                  <FileText className="h-4 w-4" />
                  {pdfLoading ? "Preparing PDF…" : "Download PDF"}
                </Button>
              </div>

              <ResultCard student={result} />

              {/* Printable copy for PDF (off-screen, html2canvas) */}
              <div
                className="pdf-capture-host pointer-events-none fixed left-0 top-0 w-[794px] opacity-[0.01]"
                aria-hidden
              >
                <ResultSheet ref={printRef} student={result} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
