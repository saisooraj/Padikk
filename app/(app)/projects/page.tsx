"use client";

import { usePageHeader } from "@/lib/use-page-header";
import { MONTHS, getPhase, phaseColorVars } from "@/lib/curriculum-data";
import type { ProjectStatus } from "@/lib/status-colors";
import { Card } from "@/components/ui/card";

const CURRENT_MONTH = 1;

const COLUMNS: { status: ProjectStatus; label: string }[] = [
  { status: "NOT_STARTED", label: "Not started" },
  { status: "IN_PROGRESS", label: "In progress" },
  { status: "COMPLETED", label: "Completed" },
  { status: "DEPLOYED", label: "Deployed" },
];

function projectStatus(monthNumber: number): ProjectStatus {
  if (monthNumber < CURRENT_MONTH) return "COMPLETED";
  if (monthNumber === CURRENT_MONTH) return "IN_PROGRESS";
  return "NOT_STARTED";
}

export default function ProjectsPage() {
  usePageHeader("Projects", "12 capstones, one per month");

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {COLUMNS.map((col) => {
        const monthsInColumn = MONTHS.filter((m) => projectStatus(m.number) === col.status);
        return (
          <div key={col.status}>
            <div className="mb-2.5 text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
              {col.label} · {monthsInColumn.length}
            </div>
            <div className="flex flex-col gap-2.5">
              {monthsInColumn.map((month) => {
                const phase = getPhase(month.phaseNumber);
                const vars = phaseColorVars(phase.color);
                return (
                  <Card key={month.number} className="p-3.5">
                    <span
                      className="inline-block rounded-md px-2 py-0.5 font-mono text-[10px] font-semibold"
                      style={{ color: vars.color, background: vars.soft }}
                    >
                      {phase.name}
                    </span>
                    <div className="mb-2 mt-2 text-[13px] font-semibold leading-tight text-[var(--text)]">
                      {month.project.name}
                    </div>
                    <div className="mb-2 flex flex-wrap gap-1.5">
                      {month.project.techStack.map((tech) => (
                        <span
                          key={tech}
                          className="rounded-[5px] bg-[var(--surface2)] px-1.5 py-0.5 font-mono text-[10.5px] text-[var(--muted)]"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                    <div className="text-[11.5px] text-[var(--muted)]">
                      M{month.number} · {month.project.description}
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
