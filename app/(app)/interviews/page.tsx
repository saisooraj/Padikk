"use client";

import { format, parseISO } from "date-fns";

import { usePageHeader } from "@/lib/use-page-header";
import { INTERVIEWS, INTERVIEW_TYPE_LABEL } from "@/lib/interviews-data";
import { scoreColor } from "@/lib/status-colors";

export default function InterviewsPage() {
  usePageHeader("Interviews", "Mock interview log");

  return (
    <div className="overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface)]">
      <div className="grid grid-cols-[0.9fr_1fr_1.3fr_1.2fr_0.8fr_0.8fr] border-b border-[var(--border)] px-4 py-2.5 text-[11px] uppercase tracking-wide text-[var(--muted)]">
        <div>Date</div>
        <div>Platform</div>
        <div>Type</div>
        <div>Company</div>
        <div>Difficulty</div>
        <div>Score</div>
      </div>
      {INTERVIEWS.map((iv) => (
        <div key={iv.id} className="border-b border-[var(--border)] px-4 py-[13px] last:border-b-0">
          <div className="grid grid-cols-[0.9fr_1fr_1.3fr_1.2fr_0.8fr_0.8fr] items-center text-[13px]">
            <div className="font-mono text-xs text-[var(--muted)]">
              {format(parseISO(iv.date), "MMM d")}
            </div>
            <div className="text-[var(--text)]">{iv.platform}</div>
            <div className="text-[var(--muted)]">{INTERVIEW_TYPE_LABEL[iv.type]}</div>
            <div className="text-[var(--text)]">{iv.company}</div>
            <div className="text-[var(--text)]">{iv.difficulty}/5</div>
            <div className="font-semibold" style={{ color: scoreColor(iv.performance) }}>
              {iv.performance}/5
            </div>
          </div>
          <div className="mt-2 text-xs text-[var(--muted)]">{iv.feedback}</div>
        </div>
      ))}
      {INTERVIEWS.length === 0 && (
        <div className="px-5 py-11 text-center text-[13px] text-[var(--muted)]">
          No mock interviews logged yet.
        </div>
      )}
    </div>
  );
}
