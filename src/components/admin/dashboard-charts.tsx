"use client";

import type { Student } from "@/lib/api";
import {
  gradeDistribution,
  subjectAverages,
  topStudentsByTotal,
  passFailStats,
} from "@/lib/analytics";
import { AdminCard } from "@/components/admin/admin-shell";
import { cn } from "@/lib/utils";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const tooltipStyle = {
  contentStyle: {
    background: "#0f1419",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 8,
    color: "#e2e8f0",
  },
  labelStyle: { color: "#94a3b8" },
};

function ChartCard({
  title,
  subtitle,
  children,
  className,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <AdminCard className={cn("min-w-0", className)}>
      <div className="border-b border-white/[0.06] px-3 py-2.5 sm:px-4 sm:py-3">
        <h3 className="text-sm font-semibold text-white">{title}</h3>
        {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
      </div>
      <div className="h-[220px] p-3 sm:h-[260px] sm:p-4 lg:h-[280px]">{children}</div>
    </AdminCard>
  );
}

export function OverviewCharts({ students }: { students: Student[] }) {
  const grades = gradeDistribution(students);
  const subjects = subjectAverages(students).slice(0, 6);

  return (
    <div className="mb-6 grid gap-4 lg:grid-cols-2">
      <ChartCard title="Grade distribution" subtitle="All registered students">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={grades}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
            <XAxis dataKey="grade" stroke="#64748b" fontSize={11} tick={{ fontSize: 11 }} />
            <YAxis stroke="#64748b" fontSize={11} allowDecimals={false} width={32} />
            <Tooltip {...tooltipStyle} />
            <Bar dataKey="count" radius={[6, 6, 0, 0]}>
              {grades.map((entry) => (
                <Cell key={entry.grade} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Subject averages" subtitle="Mean mark per subject">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={subjects} layout="vertical" margin={{ left: 8 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
            <XAxis type="number" domain={[0, 100]} stroke="#64748b" fontSize={12} />
            <YAxis
              type="category"
              dataKey="subject"
              width={72}
              stroke="#64748b"
              fontSize={11}
            />
            <Tooltip {...tooltipStyle} />
            <Bar dataKey="average" fill="#34d399" radius={[0, 6, 6, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
}

export function ExamReportsPanel({ students }: { students: Student[] }) {
  const grades = gradeDistribution(students);
  const subjects = subjectAverages(students);
  const top = topStudentsByTotal(students);
  const passFail = passFailStats(students);

  return (
    <div className="space-y-4">
      <div className="grid gap-4 lg:grid-cols-2">
        <ChartCard title="Grades overview" subtitle="Count by letter grade">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={grades}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis dataKey="grade" stroke="#64748b" />
              <YAxis stroke="#64748b" allowDecimals={false} />
              <Tooltip {...tooltipStyle} />
              <Legend />
              <Bar dataKey="count" name="Students" radius={[6, 6, 0, 0]}>
                {grades.map((entry) => (
                  <Cell key={entry.grade} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Pass rate" subtitle="C and above vs D/F">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={passFail}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={90}
                paddingAngle={3}
              >
                {passFail.map((entry) => (
                  <Cell key={entry.name} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip {...tooltipStyle} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <ChartCard
          title="Average by subject"
          subtitle="Across all students with marks"
          className="lg:col-span-1"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={subjects}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis
                dataKey="subject"
                stroke="#64748b"
                fontSize={10}
                angle={-25}
                textAnchor="end"
                height={56}
              />
              <YAxis domain={[0, 100]} stroke="#64748b" />
              <Tooltip {...tooltipStyle} />
              <Bar dataKey="average" fill="#38bdf8" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Top students" subtitle="Highest total scores">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={top}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis dataKey="name" stroke="#64748b" fontSize={10} />
              <YAxis stroke="#64748b" />
              <Tooltip {...tooltipStyle} />
              <Bar dataKey="total" fill="#a78bfa" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
}
