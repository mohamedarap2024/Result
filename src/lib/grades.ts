/** Letter grades and pass/fail — matches backend grading rules */

export const GRADING_SCALE = [
  { grade: "A", range: "90 – 100", remark: "Excellent" },
  { grade: "B", range: "80 – 89", remark: "Very Good" },
  { grade: "C", range: "70 – 79", remark: "Good" },
  { grade: "D", range: "60 – 69", remark: "Satisfactory" },
  { grade: "F", range: "Below 60", remark: "Fail" },
] as const;

export type PassFailStatus = "PASS" | "FAIL";

export function getPassFailStatus(grade: string): {
  status: PassFailStatus;
  label: "Pass" | "Failed";
} {
  const g = (grade || "F").toUpperCase();
  if (g === "D" || g === "F") {
    return { status: "FAIL", label: "Failed" };
  }
  return { status: "PASS", label: "Pass" };
}
