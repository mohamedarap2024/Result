const SUBJECT_LABELS: Record<string, string> = {
  math: "Math",
  english: "English",
  science: "Science",
  history: "History",
  chemistry: "Chemistry",
  chemistary: "Chemistry",
  geography: "Geography",
  geografy: "Geography",
  physics: "Physics",
  biology: "Biology",
};

function formatLabel(key: string): string {
  const lower = key.trim().toLowerCase();
  if (SUBJECT_LABELS[lower]) return SUBJECT_LABELS[lower];
  return key
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .replace(/^\w/, (c) => c.toUpperCase());
}

/** Merge subject keys case-insensitively (fixes duplicate Math/math columns). */
export function getNormalizedSubjectKeys(
  students: { subjects?: Record<string, string> }[]
): string[] {
  const canonical = new Map<string, string>();

  for (const student of students) {
    for (const key of Object.keys(student.subjects || {})) {
      const lower = key.trim().toLowerCase();
      if (!lower) continue;
      if (!canonical.has(lower)) {
        canonical.set(lower, formatLabel(key));
      }
    }
  }

  return Array.from(canonical.values()).sort((a, b) => a.localeCompare(b));
}

export function getSubjectScore(
  subjects: Record<string, string> | undefined,
  columnKey: string
): string {
  if (!subjects) return "—";
  const lower = columnKey.toLowerCase();
  const entry = Object.entries(subjects).find(
    ([k]) => formatLabel(k).toLowerCase() === lower || k.toLowerCase() === lower
  );
  const val = entry?.[1];
  return val !== undefined && val !== "" ? val : "—";
}
