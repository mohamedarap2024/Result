"use client";

import { Suspense, useEffect, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { api, Student, uploadStudentCsv } from "@/lib/api";
import {
  getNormalizedSubjectKeys,
  getSubjectScore,
} from "@/lib/subjects";
import { useNotice } from "@/components/plain-notice";
import { MSG, getApiMessage } from "@/lib/messages";
import {
  Plus,
  Upload,
  Trash2,
  Edit,
  Search,
  Users,
  FileSpreadsheet,
  Award,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AdminShell,
  AdminCard,
  GradePill,
} from "@/components/admin/admin-shell";
import type { AdminTab } from "@/lib/analytics";
import {
  OverviewCharts,
  ExamReportsPanel,
} from "@/components/admin/dashboard-charts";
import { overallAverageScore } from "@/lib/analytics";
import { cn } from "@/lib/utils";

function StudentForm({
  initialData,
  onSubmit,
  buttonText,
}: {
  initialData?: Student;
  onSubmit: (data: Partial<Student>) => void;
  buttonText: string;
}) {
  const notify = useNotice();
  const [formData, setFormData] = useState<Partial<Student>>(initialData || {});
  const [subjectList, setSubjectList] = useState<
    { name: string; score: string }[]
  >(() => {
    if (initialData?.subjects) {
      return Object.entries(initialData.subjects).map(([name, score]) => ({
        name,
        score: String(score),
      }));
    }
    return [{ name: "", score: "" }];
  });

  const scores = subjectList
    .map((s) => parseInt(s.score, 10))
    .filter((v) => !isNaN(v));
  const total = scores.reduce((sum, v) => sum + v, 0);
  const average = scores.length > 0 ? total / scores.length : 0;
  let grade = "F";
  if (scores.length > 0) {
    if (average >= 90) grade = "A";
    else if (average >= 80) grade = "B";
    else if (average >= 70) grade = "C";
    else if (average >= 60) grade = "D";
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (subjectList.some((s) => !s.name.trim())) {
      notify(MSG.save.failure);
      return;
    }
    const subjectsObj: Record<string, string> = {};
    subjectList.forEach((s) => {
      subjectsObj[s.name.trim()] = s.score;
    });
    onSubmit({ ...formData, subjects: subjectsObj, total, grade });
  };

  const fieldClass =
    "border-white/10 bg-[#0a0f14] text-slate-100 placeholder:text-slate-600";

  return (
    <form onSubmit={handleSubmit} className="mt-4 max-h-[min(70vh,32rem)] space-y-4 overflow-y-auto pr-1 sm:max-h-[70vh]">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-300">Student ID</label>
          <Input
            required
            className={fieldClass}
            value={formData.student_id || ""}
            onChange={(e) =>
              setFormData({ ...formData, student_id: e.target.value })
            }
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-300">Full name</label>
          <Input
            required
            className={fieldClass}
            value={formData.name || ""}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>
      </div>

      <div className="space-y-2 border-t border-white/10 pt-4">
        <div className="flex items-center justify-between">
          <label className="text-sm font-semibold text-slate-300">Subjects</label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="border-white/10 text-slate-300"
            disabled={subjectList.length >= 12}
            onClick={() =>
              setSubjectList([...subjectList, { name: "", score: "" }])
            }
          >
            <Plus className="mr-1 h-3.5 w-3.5" /> Add
          </Button>
        </div>
        {subjectList.map((subject, index) => (
          <div key={index} className="grid grid-cols-[1fr_5rem_2.5rem] gap-2 sm:grid-cols-12">
            <Input
              className={cn("sm:col-span-7", fieldClass)}
              placeholder="Subject"
              required
              value={subject.name}
              onChange={(e) => {
                const u = [...subjectList];
                u[index].name = e.target.value;
                setSubjectList(u);
              }}
            />
            <Input
              className={cn("sm:col-span-4", fieldClass)}
              type="number"
              min={0}
              max={100}
              placeholder="Mark"
              required
              value={subject.score}
              onChange={(e) => {
                const u = [...subjectList];
                u[index].score = e.target.value;
                setSubjectList(u);
              }}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="shrink-0 text-destructive sm:col-span-1"
              onClick={() => {
                const u = subjectList.filter((_, i) => i !== index);
                setSubjectList(u.length ? u : [{ name: "", score: "" }]);
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 border-t border-white/10 pt-4 sm:grid-cols-2">
        <div>
          <label className="text-xs text-slate-500">Total (auto)</label>
          <Input disabled value={total} className={cn("mt-1 font-semibold", fieldClass)} />
        </div>
        <div>
          <label className="text-xs text-slate-500">Grade (auto)</label>
          <Input disabled value={grade} className={cn("mt-1 font-semibold", fieldClass)} />
        </div>
      </div>

      <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500">
        {buttonText}
      </Button>
    </form>
  );
}

function DashboardSkeleton() {
  return (
    <div className="animate-pulse space-y-5">
      <div className="grid gap-4 sm:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-24 rounded-xl bg-white/5" />
        ))}
      </div>
      <div className="h-80 rounded-xl bg-white/5" />
    </div>
  );
}

function StatCard({
  label,
  value,
  icon: Icon,
  accent,
}: {
  label: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  accent: "blue" | "green" | "amber";
}) {
  const accents = {
    blue: "text-sky-400",
    green: "text-emerald-400",
    amber: "text-amber-400",
  };
  const iconBg = {
    blue: "bg-sky-500/10 text-sky-400",
    green: "bg-emerald-500/10 text-emerald-400",
    amber: "bg-amber-500/10 text-amber-400",
  };
  return (
    <AdminCard className="flex items-center gap-3 p-4 sm:gap-4 sm:p-5">
      <div
        className={cn(
          "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl",
          iconBg[accent]
        )}
      >
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
          {label}
        </p>
        <p className={cn("text-xl font-bold tabular-nums sm:text-2xl", accents[accent])}>
          {value}
        </p>
      </div>
    </AdminCard>
  );
}

const dialogClass =
  "max-h-[90dvh] overflow-y-auto sm:max-w-lg border-white/10 bg-[#0f1419] text-slate-100 [&_label]:text-slate-300";

export default function AdminDashboard() {
  return (
    <Suspense
      fallback={
        <AdminShell onLogout={() => {}} activeTab="overview">
          <DashboardSkeleton />
        </AdminShell>
      }
    >
      <AdminDashboardContent />
    </Suspense>
  );
}

function useAdminTab(): AdminTab {
  const params = useSearchParams();
  const t = params.get("tab");
  if (t === "records" || t === "reports") return t;
  return "overview";
}

function AdminDashboardContent() {
  const notify = useNotice();
  const router = useRouter();
  const activeTab = useAdminTab();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!localStorage.getItem("admin_token")) {
      router.push("/admin/login");
      return;
    }
    fetchStudents();
  }, [router]);

  const fetchStudents = async () => {
    try {
      const res = await api.get("/admin/students");
      setStudents(res.data.data || []);
    } catch (err: unknown) {
      const axiosErr = err as {
        response?: { data?: { error?: string } };
        message?: string;
      };
      notify(getApiMessage(err, MSG.backend.operationFailed));
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    router.push("/admin/login");
  };

  const q = search.trim().toLowerCase();
  const filteredStudents = students.filter(
    (s) =>
      !q ||
      s.name?.toLowerCase().includes(q) ||
      s.student_id?.toLowerCase().includes(q) ||
      s.student_id?.toLowerCase().replace(/[^a-z0-9]/g, "").includes(
        q.replace(/[^a-z0-9]/g, "")
      )
  );

  const subjectKeys = getNormalizedSubjectKeys(filteredStudents);
  const avgGrade = (() => {
    if (!students.length) return "—";
    const map: Record<string, number> = { A: 4, B: 3, C: 2, D: 1, F: 0 };
    const sum = students.reduce(
      (acc, s) => acc + (map[(s.grade || "F").toUpperCase()] ?? 0),
      0
    );
    const avg = sum / students.length;
    if (avg >= 3.5) return "A";
    if (avg >= 2.5) return "B";
    if (avg >= 1.5) return "C";
    if (avg >= 0.5) return "D";
    return "F";
  })();
  const totalPages = Math.ceil(filteredStudents.length / rowsPerPage) || 1;
  const currentRows = filteredStudents.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  if (loading) {
    return (
      <AdminShell onLogout={handleLogout} activeTab={activeTab}>
        <DashboardSkeleton />
      </AdminShell>
    );
  }

  const avgScore = overallAverageScore(students);

  return (
    <AdminShell onLogout={handleLogout} activeTab={activeTab}>
      {(activeTab === "overview" || activeTab === "reports") && (
        <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Total Students"
            value={students.length.toLocaleString()}
            icon={Users}
            accent="blue"
          />
          <StatCard
            label="Subjects tracked"
            value={subjectKeys.length || "—"}
            icon={FileSpreadsheet}
            accent="green"
          />
          <StatCard
            label="Average Grade"
            value={avgGrade}
            icon={Award}
            accent="amber"
          />
          <StatCard
            label="Mean subject score"
            value={avgScore ? `${avgScore}%` : "—"}
            icon={FileSpreadsheet}
            accent="blue"
          />
        </div>
      )}

      {activeTab === "overview" && <OverviewCharts students={students} />}

      {activeTab === "reports" && <ExamReportsPanel students={students} />}

      {activeTab === "records" && (
        <>
      <AdminCard className="mb-4 flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 sm:max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input
            placeholder="Search name or ID…"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="h-10 w-full rounded-lg border border-white/10 bg-[#0a0f14] pl-10 pr-3 text-sm text-slate-100 placeholder:text-slate-600 focus:border-emerald-500/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          />
        </div>
        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:flex-wrap">
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            className="hidden"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              try {
                const res = await uploadStudentCsv(file);
                await fetchStudents();
                notify(res.data.message || MSG.upload.success);
              } catch (err: unknown) {
                notify(getApiMessage(err, MSG.upload.failure));
              }
              e.target.value = "";
            }}
          />
          <Button
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            className="w-full border-white/10 bg-transparent text-slate-300 hover:bg-white/5 hover:text-white sm:w-auto"
          >
            <Upload className="mr-2 h-4 w-4" />
            Upload CSV
          </Button>
          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger
              render={
                <Button className="w-full bg-emerald-600 text-white shadow-lg shadow-emerald-900/30 hover:bg-emerald-500 sm:w-auto" />
              }
            >
              <Plus className="mr-2 h-4 w-4" />
              Add student
            </DialogTrigger>
            <DialogContent className={dialogClass}>
              <DialogHeader>
                <DialogTitle>Add new student</DialogTitle>
              </DialogHeader>
              <StudentForm
                onSubmit={async (data) => {
                  try {
                    await api.post("/admin/students", data);
                    notify(MSG.register.success);
                    setIsAddOpen(false);
                    fetchStudents();
                  } catch (err: unknown) {
                    notify(getApiMessage(err, MSG.register.failure));
                  }
                }}
                buttonText="Save student"
              />
            </DialogContent>
          </Dialog>
        </div>
      </AdminCard>

      <p className="mb-3 text-xs text-slate-600">
        CSV columns:{" "}
        <span className="font-mono text-slate-500">
          student_id, name, Math, English, Chemistry…
        </span>
        {" · "}
        <a
          href="/sample_students.csv"
          download
          className="text-emerald-500/90 underline-offset-2 hover:text-emerald-400 hover:underline"
        >
          Download sample CSV
        </a>
      </p>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className={dialogClass}>
          <DialogHeader>
            <DialogTitle>Edit student</DialogTitle>
          </DialogHeader>
          {editingStudent && (
            <StudentForm
              initialData={editingStudent}
              onSubmit={async (data) => {
                try {
                  await api.put(`/admin/students/${editingStudent.id}`, data);
                  notify(MSG.update.success);
                  setIsEditOpen(false);
                  setEditingStudent(null);
                  fetchStudents();
                } catch (err: unknown) {
                  notify(getApiMessage(err, MSG.update.failure));
                }
              }}
              buttonText="Save changes"
            />
          )}
        </DialogContent>
      </Dialog>

      <AdminCard className="overflow-hidden">
        <div className="border-b border-white/[0.06] px-4 py-3">
          <h2 className="text-sm font-semibold text-white">Student records</h2>
          <p className="text-xs text-slate-500">
            Showing {(currentPage - 1) * rowsPerPage + 1}–
            {Math.min(currentPage * rowsPerPage, filteredStudents.length)} of{" "}
            {filteredStudents.length}
          </p>
        </div>
        <div className="table-responsive">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/[0.06] text-left text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                <th className="px-4 py-3">Student ID</th>
                <th className="px-4 py-3">Name</th>
                {subjectKeys.map((key) => (
                  <th key={key} className="px-4 py-3 whitespace-nowrap">
                    {key}
                  </th>
                ))}
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Grade</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentRows.length > 0 ? (
                currentRows.map((student, idx) => (
                  <tr
                    key={student.id}
                    className={cn(
                      "border-b border-white/[0.04] transition-colors hover:bg-emerald-500/[0.04]",
                      idx % 2 === 1 && "bg-white/[0.02]"
                    )}
                  >
                    <td className="px-4 py-3 font-mono text-sm font-semibold text-emerald-400">
                      {student.student_id}
                    </td>
                    <td className="px-4 py-3 font-medium whitespace-nowrap text-slate-200">
                      {student.name}
                    </td>
                    {subjectKeys.map((key) => (
                      <td
                        key={key}
                        className="px-4 py-3 tabular-nums text-slate-400"
                      >
                        {getSubjectScore(student.subjects, key)}
                      </td>
                    ))}
                    <td className="px-4 py-3 font-semibold tabular-nums text-white">
                      {student.total}
                    </td>
                    <td className="px-4 py-3">
                      <GradePill grade={student.grade} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-0.5">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-slate-500 hover:bg-emerald-500/10 hover:text-emerald-400"
                          onClick={() => {
                            setEditingStudent(student);
                            setIsEditOpen(true);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-slate-500 hover:bg-red-500/10 hover:text-red-400"
                          onClick={async () => {
                            if (!confirm("Delete this student?")) return;
                            try {
                              await api.delete(`/admin/students/${student.id}`);
                              notify(MSG.delete.success);
                              fetchStudents();
                            } catch {
                              notify(MSG.delete.failure);
                            }
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5 + subjectKeys.length}
                    className="px-4 py-14 text-center text-slate-500"
                  >
                    No students yet — upload a CSV or add one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.06] px-4 py-3">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <span>Rows per page</span>
            <select
              className="rounded-md border border-white/10 bg-[#0a0f14] px-2 py-1 text-slate-200"
              value={rowsPerPage}
              onChange={(e) => {
                setRowsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
            >
              {[10, 20, 50].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-500">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              className="border-white/10 text-slate-400 hover:bg-white/5 hover:text-white"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => p - 1)}
            >
              Prev
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-white/10 text-slate-400 hover:bg-white/5 hover:text-white"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      </AdminCard>
        </>
      )}
    </AdminShell>
  );
}
