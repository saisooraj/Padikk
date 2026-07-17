"use client";

import { useMemo, useState } from "react";
import { addDays, format } from "date-fns";

import { usePageHeader } from "@/lib/use-page-header";
import {
  DSA_PATTERNS,
  DSA_PROBLEMS,
  PATTERN_LABEL,
  type DSAPattern,
} from "@/lib/dsa-data";
import {
  difficultyColor,
  difficultyLabel,
  dsaStatusColor,
  dsaStatusLabel,
  type Difficulty,
  type ProblemStatus,
} from "@/lib/status-colors";
import { Card } from "@/components/ui/card";
import { ProgressBar } from "@/components/ui/progress-bar";

const DIFFICULTIES: Difficulty[] = ["EASY", "MEDIUM", "HARD"];
const STATUSES: ProblemStatus[] = ["TODO", "ATTEMPTED", "SOLVED", "NEEDS_REVIEW", "OWNED"];

function reviewDateLabel(reviewInDays: number | null) {
  if (reviewInDays === null) return "—";
  return format(addDays(new Date(), reviewInDays), "MMM d");
}

export default function DsaTrackerPage() {
  usePageHeader("DSA Tracker", "20 patterns tracked");

  const [search, setSearch] = useState("");
  const [pattern, setPattern] = useState<DSAPattern | "all">("all");
  const [difficulty, setDifficulty] = useState<Difficulty | "all">("all");
  const [status, setStatus] = useState<ProblemStatus | "all">("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filtered = DSA_PROBLEMS.filter(
    (p) =>
      (pattern === "all" || p.pattern === pattern) &&
      (difficulty === "all" || p.difficulty === difficulty) &&
      (status === "all" || p.status === status) &&
      (!search || p.title.toLowerCase().includes(search.toLowerCase()))
  );

  const selected = selectedId ? DSA_PROBLEMS.find((p) => p.id === selectedId) ?? null : null;

  const dueForReview = useMemo(
    () =>
      DSA_PROBLEMS.filter(
        (p) =>
          p.reviewInDays !== null &&
          p.reviewInDays <= 0 &&
          (p.status === "NEEDS_REVIEW" || p.status === "SOLVED")
      ).sort((a, b) => (a.reviewInDays ?? 0) - (b.reviewInDays ?? 0)),
    []
  );

  const stats = {
    owned: DSA_PROBLEMS.filter((p) => p.status === "OWNED").length,
    solved: DSA_PROBLEMS.filter((p) => p.status === "SOLVED").length,
    needsReview: DSA_PROBLEMS.filter((p) => p.status === "NEEDS_REVIEW").length,
    total: DSA_PROBLEMS.length,
  };

  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-[2.3fr_1fr]">
      <div>
        <div className="mb-4 grid grid-cols-2 gap-3.5 sm:grid-cols-4">
          {[
            { label: "Owned", value: stats.owned },
            { label: "Solved", value: stats.solved },
            { label: "Needs review", value: stats.needsReview },
            { label: "Total problems", value: stats.total },
          ].map((tile) => (
            <Card key={tile.label} className="p-4">
              <div className="mb-1.5 text-[11.5px] text-[var(--muted)]">{tile.label}</div>
              <div className="font-mono text-2xl font-bold text-[var(--text)]">{tile.value}</div>
            </Card>
          ))}
        </div>

        <div className="mb-4 flex flex-wrap gap-2.5">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search problems…"
            className="min-w-[160px] flex-1 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-[13px] text-[var(--text)] placeholder:text-[var(--muted)]"
          />
          <select
            value={pattern}
            onChange={(e) => setPattern(e.target.value as DSAPattern | "all")}
            className="rounded-lg border border-[var(--border)] bg-[var(--surface)] px-2.5 py-2 text-[13px] text-[var(--text)]"
          >
            <option value="all">All patterns</option>
            {DSA_PATTERNS.map((p) => (
              <option key={p} value={p}>
                {PATTERN_LABEL[p]}
              </option>
            ))}
          </select>
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value as Difficulty | "all")}
            className="rounded-lg border border-[var(--border)] bg-[var(--surface)] px-2.5 py-2 text-[13px] text-[var(--text)]"
          >
            <option value="all">All difficulty</option>
            {DIFFICULTIES.map((d) => (
              <option key={d} value={d}>
                {difficultyLabel(d)}
              </option>
            ))}
          </select>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as ProblemStatus | "all")}
            className="rounded-lg border border-[var(--border)] bg-[var(--surface)] px-2.5 py-2 text-[13px] text-[var(--text)]"
          >
            <option value="all">All status</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {dsaStatusLabel(s)}
              </option>
            ))}
          </select>
        </div>

        <div className="overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface)]">
          <div className="grid grid-cols-[2.2fr_1.3fr_0.8fr_1fr_0.7fr_0.8fr_1fr] border-b border-[var(--border)] px-4 py-2.5 text-[11px] uppercase tracking-wide text-[var(--muted)]">
            <div>Problem</div>
            <div>Pattern</div>
            <div>Diff.</div>
            <div>Status</div>
            <div>Att.</div>
            <div>Time</div>
            <div>Next review</div>
          </div>
          {filtered.map((p) => (
            <button
              key={p.id}
              onClick={() => setSelectedId(p.id)}
              className="grid w-full grid-cols-[2.2fr_1.3fr_0.8fr_1fr_0.7fr_0.8fr_1fr] items-center border-b border-[var(--border)] px-4 py-[11px] text-left text-[13px] last:border-b-0 hover:bg-[var(--surface2)]"
            >
              <div className="truncate pr-2 text-[var(--text)]">{p.title}</div>
              <div className="truncate pr-2 text-xs text-[var(--muted)]">{PATTERN_LABEL[p.pattern]}</div>
              <div style={{ color: difficultyColor(p.difficulty) }}>{difficultyLabel(p.difficulty)}</div>
              <div className="font-semibold" style={{ color: dsaStatusColor(p.status) }}>
                {dsaStatusLabel(p.status)}
              </div>
              <div className="font-mono text-[var(--muted)]">{p.attempts}</div>
              <div className="font-mono text-[var(--muted)]">{p.timeSpent ? `${p.timeSpent}m` : "—"}</div>
              <div className="font-mono text-[11.5px] text-[var(--muted)]">
                {reviewDateLabel(p.reviewInDays)}
              </div>
            </button>
          ))}
          {filtered.length === 0 && (
            <div className="px-5 py-11 text-center">
              <div className="mb-2.5 text-[13.5px] text-[var(--muted)]">
                No problems match these filters.
              </div>
              <button
                onClick={() => {
                  setSearch("");
                  setPattern("all");
                  setDifficulty("all");
                  setStatus("all");
                }}
                className="rounded-lg border border-[var(--border)] px-3.5 py-[7px] text-xs text-[var(--text)]"
              >
                Reset filters
              </button>
            </div>
          )}
        </div>

        {selected && (
          <Card className="mt-4 p-5">
            <div className="mb-2.5 flex items-center justify-between">
              <div className="text-[15px] font-bold text-[var(--text)]">{selected.title}</div>
              <button onClick={() => setSelectedId(null)} className="text-xs text-[var(--muted)]">
                Close ✕
              </button>
            </div>
            <div className="mb-3.5 flex flex-wrap gap-2">
              <span
                className="rounded-md bg-[var(--surface2)] px-2.5 py-1 text-[11px] font-semibold"
                style={{ color: difficultyColor(selected.difficulty) }}
              >
                {difficultyLabel(selected.difficulty)}
              </span>
              <span
                className="rounded-md bg-[var(--surface2)] px-2.5 py-1 text-[11px] font-semibold"
                style={{ color: dsaStatusColor(selected.status) }}
              >
                {dsaStatusLabel(selected.status)}
              </span>
              <span className="rounded-md px-2.5 py-1 text-[11.5px] text-[var(--muted)]">
                {PATTERN_LABEL[selected.pattern]}
              </span>
            </div>
            <div className="text-[13px] leading-relaxed text-[var(--muted)]">
              {selected.notes || "No notes yet."}
            </div>
          </Card>
        )}
      </div>

      <div className="flex flex-col gap-5">
        <Card className="p-5">
          <div className="mb-3.5 text-sm font-semibold text-[var(--text)]">Pattern mastery</div>
          <div className="flex flex-col gap-2.5">
            {DSA_PATTERNS.map((p) => {
              const inPattern = DSA_PROBLEMS.filter((prob) => prob.pattern === p);
              const solved = inPattern.filter(
                (prob) => prob.status === "SOLVED" || prob.status === "OWNED"
              ).length;
              return (
                <div key={p}>
                  <div className="mb-1 flex justify-between text-[11.5px]">
                    <span className="text-[var(--text)]">{PATTERN_LABEL[p]}</span>
                    <span className="font-mono text-[var(--muted)]">
                      {solved}/{inPattern.length}
                    </span>
                  </div>
                  <ProgressBar
                    value={inPattern.length ? (solved / inPattern.length) * 100 : 0}
                    className="h-[5px]"
                  />
                </div>
              );
            })}
          </div>
        </Card>

        <Card className="p-5">
          <div className="mb-3 text-sm font-semibold text-[var(--text)]">Due for review</div>
          {dueForReview.length === 0 ? (
            <div className="text-[12.5px] text-[var(--muted)]">Nothing due today.</div>
          ) : (
            dueForReview.map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between border-b border-[var(--border)] py-2 text-[12.5px] last:border-b-0"
              >
                <span className="text-[var(--text)]">{p.title}</span>
                <span className="font-mono text-[11px] text-[var(--muted)]">
                  {reviewDateLabel(p.reviewInDays)}
                </span>
              </div>
            ))
          )}
        </Card>
      </div>
    </div>
  );
}
