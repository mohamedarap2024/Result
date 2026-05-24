import type { Student } from "@/lib/api";
import {
  getNormalizedSubjectKeys,
  getSubjectScore,
} from "@/lib/subjects";

export type AdminTab = "overview" | "records" | "reports";

export function gradeDistribution(students: Student[]) {
  const grades = ["A", "B", "C", "D", "F"] as const;
  const counts: Record<string, number> = { A: 0, B: 0, C: 0, D: 0, F: 0 };
  for (const s of students) {
    const g = (s.grade || "F").toUpperCase();
    if (g in counts) counts[g]++;
    else counts.F++;
  }
  return grades.map((grade) => ({
    grade,
    count: counts[grade],
    fill:
      grade === "A"
        ? "#34d399"
        : grade === "B"
          ? "#2dd4bf"
          : grade === "C"
            ? "#fbbf24"
            : grade === "D"
              ? "#fb923c"
              : "#f87171",
  }));
}

export function subjectAverages(students: Student[]) {
  const keys = getNormalizedSubjectKeys(students);
  return keys.map((subject) => {
    let sum = 0;
    let n = 0;
    for (const s of students) {
      const raw = getSubjectScore(s.subjects, subject);
      if (raw === "—") continue;
      const v = parseInt(raw, 10);
      if (!isNaN(v)) {
        sum += v;
        n++;
      }
    }
    return {
      subject,
      average: n > 0 ? Math.round(sum / n) : 0,
      students: n,
    };
  });
}

export function topStudentsByTotal(students: Student[], limit = 8) {
  return [...students]
    .sort((a, b) => (b.total ?? 0) - (a.total ?? 0))
    .slice(0, limit)
    .map((s) => ({
      name: s.name.length > 18 ? `${s.name.slice(0, 16)}…` : s.name,
      total: s.total ?? 0,
      grade: s.grade,
    }));
}

export function passFailStats(students: Student[]) {
  let pass = 0;
  let fail = 0;
  for (const s of students) {
    const g = (s.grade || "F").toUpperCase();
    if (g === "F" || g === "D") fail++;
    else pass++;
  }
  return [
    { name: "Pass (C+)", value: pass, fill: "#34d399" },
    { name: "Needs support", value: fail, fill: "#f87171" },
  ];
}

export function overallAverageScore(students: Student[]) {
  if (!students.length) return 0;
  const subjects = subjectAverages(students);
  const withData = subjects.filter((s) => s.students > 0);
  if (!withData.length) return 0;
  return Math.round(
    withData.reduce((a, s) => a + s.average, 0) / withData.length
  );
}
