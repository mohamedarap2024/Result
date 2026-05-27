import { jsPDF } from "jspdf";
import { LOGO_SRC_RESULT, LOGO_VERSION } from "@/components/brand-logo";
import { getPassFailStatus } from "@/lib/grades";
import type { Student } from "@/lib/api";

const MARGIN = 14;
const PAGE_W = 210;
const CONTENT_W = PAGE_W - MARGIN * 2;

type ResultStudent = Pick<
  Student,
  "student_id" | "name" | "subjects" | "total" | "grade"
>;

async function loadLogoForPdf(): Promise<{
  dataUrl: string;
  aspect: number;
} | null> {
  try {
    const base =
      typeof window !== "undefined"
        ? new URL(LOGO_SRC_RESULT, window.location.origin).href
        : LOGO_SRC_RESULT;
    const url = `${base}?v=${LOGO_VERSION}`;
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return null;
    const blob = await res.blob();
    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(blob);
    });

    const aspect = await new Promise<number>((resolve) => {
      const img = new Image();
      img.onload = () =>
        resolve(
          img.naturalWidth > 0 ? img.naturalHeight / img.naturalWidth : 0.25
        );
      img.onerror = () => resolve(0.25);
      img.src = dataUrl;
    });

    return { dataUrl, aspect };
  } catch {
    return null;
  }
}

function savePdf(doc: jsPDF, filename: string) {
  const name = filename.endsWith(".pdf") ? filename : `${filename}.pdf`;
  doc.save(name);
}

function drawCenteredLines(
  doc: jsPDF,
  lines: string[],
  x: number,
  y: number,
  lineHeight: number
) {
  lines.forEach((line, i) => {
    doc.text(line, x, y + i * lineHeight, { align: "center" });
  });
  return y + lines.length * lineHeight;
}

/** Build official A4 result PDF directly (no html2canvas — reliable on mobile) */
export async function exportStudentResultPdf(
  student: ResultStudent,
  filename: string
): Promise<void> {
  const subjects = Object.entries(student.subjects || {}).filter(
    ([key]) => key.toLowerCase() !== "average"
  );
  const passFail = getPassFailStatus(student.grade);
  const passed = passFail.status === "PASS";

  const doc = new jsPDF({ orientation: "p", unit: "mm", format: "a4" });
  let y = MARGIN;

  const logo = await loadLogoForPdf();
  if (logo) {
    let logoW = CONTENT_W;
    let logoH = logoW * logo.aspect;
    const maxLogoH = 32;
    if (logoH > maxLogoH) {
      logoH = maxLogoH;
      logoW = logoH / logo.aspect;
    }
    const logoX = MARGIN + (CONTENT_W - logoW) / 2;

    doc.addImage(
      logo.dataUrl,
      "PNG",
      logoX,
      y,
      logoW,
      logoH,
      undefined,
      "FAST"
    );
    y += logoH + 10;
  } else {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.setTextColor(15, 23, 42);
    y = drawCenteredLines(
      doc,
      doc.splitTextToSize(
        "Schools Joint Exam Center — Mogadishu",
        CONTENT_W
      ),
      PAGE_W / 2,
      y + 4,
      6
    );
    y += 4;
  }

  doc.setDrawColor(226, 232, 240);
  doc.line(MARGIN, y, PAGE_W - MARGIN, y);
  y += 10;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.text("STUDENT INFORMATION", PAGE_W / 2, y, { align: "center" });
  y += 7;

  doc.setFontSize(16);
  doc.setTextColor(15, 23, 42);
  const nameLines = doc.splitTextToSize(student.name, CONTENT_W);
  y = drawCenteredLines(doc, nameLines, PAGE_W / 2, y, 7);
  y += 2;

  doc.setFontSize(12);
  doc.setTextColor(5, 150, 105);
  doc.text(String(student.student_id), PAGE_W / 2, y, { align: "center" });
  y += 12;

  doc.line(MARGIN, y, PAGE_W - MARGIN, y);
  y += 10;

  const boxGap = 3;
  const boxW = (CONTENT_W - boxGap * 2) / 3;
  const boxH = 22;
  const boxXs = [
    MARGIN,
    MARGIN + boxW + boxGap,
    MARGIN + (boxW + boxGap) * 2,
  ];

  doc.setDrawColor(226, 232, 240);
  doc.setFillColor(255, 255, 255);
  for (const x of boxXs) {
    doc.roundedRect(x, y, boxW, boxH, 2, 2, "FD");
  }
  doc.setFillColor(236, 253, 245);
  doc.roundedRect(boxXs[1], y, boxW, boxH, 2, 2, "F");
  doc.setFillColor(passed ? 236 : 254, passed ? 253 : 242, passed ? 245 : 242);
  doc.roundedRect(boxXs[2], y, boxW, boxH, 2, 2, "F");

  doc.setFontSize(7);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(100, 116, 139);
  doc.text("TOTAL SCORE", boxXs[0] + boxW / 2, y + 6, { align: "center" });
  doc.text("FINAL GRADE", boxXs[1] + boxW / 2, y + 6, { align: "center" });
  doc.text("RESULT STATUS", boxXs[2] + boxW / 2, y + 6, { align: "center" });

  doc.setFontSize(16);
  doc.setTextColor(15, 23, 42);
  doc.text(String(student.total), boxXs[0] + boxW / 2, y + 16, {
    align: "center",
  });
  doc.setTextColor(4, 120, 87);
  doc.text(String(student.grade), boxXs[1] + boxW / 2, y + 16, {
    align: "center",
  });
  doc.setTextColor(passed ? 4 : 190, passed ? 120 : 18, passed ? 87 : 60);
  doc.text(passFail.label.toUpperCase(), boxXs[2] + boxW / 2, y + 16, {
    align: "center",
  });

  y += boxH + 10;

  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(100, 116, 139);
  doc.text("SUBJECT MARKS", MARGIN, y);
  y += 8;

  const tableBottom = 279; // footer on one page
  const subjectCount = Math.max(subjects.length, 1);
  const slot = (tableBottom - y) / subjectCount;
  const rowH = Math.max(7.2, Math.min(10, slot - 1.2));
  const rowGap = Math.max(0.8, slot - rowH);
  const rowFontSize = rowH < 8.5 ? 9 : 10;
  let rowTextY = y + rowH * 0.62;
  doc.setFont("helvetica", "normal");

  if (subjects.length === 0) {
    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139);
    doc.text("No subject data", MARGIN, y + 4);
  } else {
    for (const [subject, score] of subjects) {
      doc.setDrawColor(226, 232, 240);
      doc.setFillColor(248, 250, 252);
      doc.roundedRect(MARGIN, y, CONTENT_W, rowH, 1.5, 1.5, "FD");

      doc.setFontSize(rowFontSize);
      doc.setTextColor(30, 41, 59);
      const label =
        subject.charAt(0).toUpperCase() + subject.slice(1).replace(/_/g, " ");
      const labelLines = doc.splitTextToSize(label, CONTENT_W - 40);
      doc.text(labelLines, MARGIN + 4, rowTextY);

      doc.setFont("helvetica", "bold");
      doc.text(String(score), PAGE_W - MARGIN - 4, rowTextY, {
        align: "right",
      });
      doc.setFont("helvetica", "normal");

      y += rowH + rowGap;
      rowTextY = y + rowH * 0.62;
    }
  }

  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(148, 163, 184);
  doc.text(
    "Schools Joint Exam Center — Mogadishu · Official Result",
    PAGE_W / 2,
    287,
    { align: "center" }
  );

  savePdf(doc, filename);
}
