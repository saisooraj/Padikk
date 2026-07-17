"use client";

import { useState } from "react";

import { usePageHeader } from "@/lib/use-page-header";
import { phaseColorVars, type PhaseColorKey } from "@/lib/curriculum-data";
import { Card } from "@/components/ui/card";
import { ProgressBar } from "@/components/ui/progress-bar";
import type { RoadmapData, MonthStatus } from "@/lib/queries/roadmap";

const STATUS_LABEL: Record<MonthStatus, string> = {
  NOT_STARTED: "Not started",
  IN_PROGRESS: "In progress",
  COMPLETED: "Completed",
};

function statusColor(status: MonthStatus): string {
  switch (status) {
    case "COMPLETED":
      return "var(--brand)";
    case "IN_PROGRESS":
      return "var(--warn)";
    case "NOT_STARTED":
      return "var(--muted)";
  }
}

export function RoadmapClient({ data }: { data: RoadmapData }) {
  usePageHeader("Roadmap", "6 phases · 12 months");

  const [expandedMonth, setExpandedMonth] = useState<number | null>(null);
  const expanded = expandedMonth ? data.months.find((m) => m.number === expandedMonth) ?? null : null;

  return (
    <div>
      <div className="mb-5 flex flex-wrap gap-3.5">
        {data.phases.map((phase) => {
          const vars = phaseColorVars(phase.color as PhaseColorKey);
          return (
            <div key={phase.number} className="flex items-center gap-1.5 text-xs text-[var(--muted)]">
              <span className="h-2 w-2 rounded-full" style={{ background: vars.color }} />
              {phase.name}
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
        {data.months.map((month) => {
          const vars = phaseColorVars(month.phase.color as PhaseColorKey);
          const isExpanded = expandedMonth === month.number;

          return (
            <button
              key={month.number}
              onClick={() => setExpandedMonth((prev) => (prev === month.number ? null : month.number))}
              className="rounded-[10px] p-3.5 text-left"
              style={{
                background: vars.soft,
                border: `1px solid ${isExpanded ? vars.color : "var(--border)"}`,
              }}
            >
              <div className="mb-2 flex items-center justify-between">
                <span className="font-mono text-[11px] text-[var(--muted)]">M{month.number}</span>
                <span className="text-[10px] font-semibold" style={{ color: statusColor(month.status) }}>
                  {STATUS_LABEL[month.status]}
                </span>
              </div>
              <div className="mb-1.5 text-[13px] font-semibold leading-tight text-[var(--text)]">
                {month.title}
              </div>
              <div className="mb-2.5 truncate text-[11.5px] text-[var(--muted)]">
                {month.project?.name ?? "No project"}
              </div>
              <ProgressBar value={month.progress} colorVar={vars.color} className="h-[5px]" />
            </button>
          );
        })}
      </div>

      {expanded && (
        <Card className="mt-[22px] p-6">
          <div className="mb-4 flex items-center justify-between">
            <div className="text-[15px] font-bold text-[var(--text)]">
              Month {expanded.number} — {expanded.title}
            </div>
            <button
              onClick={() => setExpandedMonth(null)}
              className="text-xs text-[var(--muted)]"
            >
              Close ✕
            </button>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <div className="mb-2.5 text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
                Topics
              </div>
              {expanded.topics.map((topic) => (
                <div
                  key={topic.id}
                  className="border-b border-[var(--border)] py-[7px] text-[13px] text-[var(--text)] last:border-b-0"
                >
                  {topic.name}
                </div>
              ))}
            </div>
            <div>
              <div className="mb-2.5 text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
                Resources
              </div>
              {expanded.resources.map((resource) => (
                <a
                  key={resource.id}
                  href={resource.url}
                  target="_blank"
                  rel="noreferrer"
                  className="block border-b border-[var(--border)] py-[7px] text-[13px] text-[var(--text)] last:border-b-0 hover:text-[var(--brand)]"
                >
                  {resource.title}
                </a>
              ))}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
