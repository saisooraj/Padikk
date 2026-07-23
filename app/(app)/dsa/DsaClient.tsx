"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { addDays, format } from "date-fns";
import { toast } from "sonner";

import { usePageHeader } from "@/lib/use-page-header";
import { DSA_PATTERNS, PATTERN_LABEL, type DSAPattern } from "@/lib/dsa-data";
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
import type { DsaData } from "@/lib/queries/dsa";

const DIFFICULTIES: Difficulty[] = ["EASY", "MEDIUM", "HARD"];
const STATUSES: ProblemStatus[] = ["TODO", "ATTEMPTED", "SOLVED", "NEEDS_REVIEW", "OWNED"];

function reviewDateLabel(reviewInDays: number | null) {
  if (reviewInDays === null) return "—";
  return format(addDays(new Date(), reviewInDays), "MMM d");
}

export function DsaClient({ data, initialSelectedId }: { data: DsaData; initialSelectedId?: string }) {
  usePageHeader("DSA Tracker", `${data.stats.total} problem${data.stats.total === 1 ? "" : "s"} tracked`);
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [pattern, setPattern] = useState<DSAPattern | "all">("all");
  const [difficulty, setDifficulty] = useState<Difficulty | "all">("all");
  const [status, setStatus] = useState<ProblemStatus | "all">("all");
  const [pendingIds, setPendingIds] = useState<Set<string>>(new Set());
  const [dismissedReviewIds, setDismissedReviewIds] = useState<Set<string>>(new Set());

  const [problems, setProblems] = useState(data.problems);
  useEffect(() => setProblems(data.problems), [data.problems]);
  useEffect(() => setDismissedReviewIds(new Set()), [data.dueForReview]);

  const selectProblem = (id: string | null) =>
    router.push(id ? `/dsa/${id}` : "/dsa", { scroll: false });

  const [addOpen, setAddOpen] = useState(false);
  const [addTitle, setAddTitle] = useState("");
  const [addPattern, setAddPattern] = useState<DSAPattern>(DSA_PATTERNS[0]);
  const [addDifficulty, setAddDifficulty] = useState<Difficulty>("MEDIUM");
  const [addUrl, setAddUrl] = useState("");
  const [addSaving, setAddSaving] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);

  const [notesDraft, setNotesDraft] = useState("");
  const [notesSaving, setNotesSaving] = useState(false);

  const filtered = problems.filter(
    (p) =>
      (pattern === "all" || p.pattern === pattern) &&
      (difficulty === "all" || p.difficulty === difficulty) &&
      (status === "all" || p.status === status) &&
      (!search || p.title.toLowerCase().includes(search.toLowerCase()))
  );

  const selected = initialSelectedId ? problems.find((p) => p.id === initialSelectedId) ?? null : null;

  const dueForReview = data.dueForReview.filter((p) => !dismissedReviewIds.has(p.id));

  useEffect(() => {
    setNotesDraft(selected?.notes ?? "");
  }, [selected?.id, selected?.notes]);

  const setProblemStatus = async (id: string, next: ProblemStatus) => {
    const prevProblems = problems;
    setProblems((prev) => prev.map((p) => (p.id === id ? { ...p, status: next } : p)));
    setPendingIds((prev) => new Set(prev).add(id));
    try {
      const res = await fetch(`/api/dsa/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "setStatus", status: next }),
      });
      if (!res.ok) throw new Error();
      router.refresh();
    } catch {
      setProblems(prevProblems);
      toast.error("Could not update status. Please try again.");
    } finally {
      setPendingIds((prev) => {
        const next2 = new Set(prev);
        next2.delete(id);
        return next2;
      });
    }
  };

  const reviewDone = async (id: string) => {
    setDismissedReviewIds((prev) => new Set(prev).add(id));
    setPendingIds((prev) => new Set(prev).add(id));
    try {
      const res = await fetch(`/api/dsa/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reviewDone" }),
      });
      if (!res.ok) throw new Error();
      toast.success("Review logged.");
      router.refresh();
    } catch {
      setDismissedReviewIds((prev) => {
        const next2 = new Set(prev);
        next2.delete(id);
        return next2;
      });
      toast.error("Could not log review. Please try again.");
    } finally {
      setPendingIds((prev) => {
        const next2 = new Set(prev);
        next2.delete(id);
        return next2;
      });
    }
  };

  const saveNotes = async (id: string) => {
    setNotesSaving(true);
    try {
      const res = await fetch(`/api/dsa/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "updateFields", notes: notesDraft }),
      });
      if (res.ok) {
        setProblems((prev) => prev.map((p) => (p.id === id ? { ...p, notes: notesDraft } : p)));
        toast.success("Notes saved.");
        router.refresh();
      } else {
        toast.error("Could not save notes. Please try again.");
      }
    } finally {
      setNotesSaving(false);
    }
  };

  const deleteProblem = async (id: string) => {
    if (!confirm("Delete this problem? This can't be undone.")) return;
    const prevProblems = problems;
    setProblems((prev) => prev.filter((p) => p.id !== id));
    selectProblem(null);
    setPendingIds((prev) => new Set(prev).add(id));
    try {
      const res = await fetch(`/api/dsa/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      toast.success("Problem deleted.");
      router.refresh();
    } catch {
      setProblems(prevProblems);
      toast.error("Could not delete problem. Please try again.");
    } finally {
      setPendingIds((prev) => {
        const next2 = new Set(prev);
        next2.delete(id);
        return next2;
      });
    }
  };

  const addProblem = async () => {
    if (!addTitle.trim()) {
      setAddError("Title is required.");
      return;
    }
    setAddSaving(true);
    setAddError(null);
    try {
      const res = await fetch("/api/dsa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: addTitle,
          difficulty: addDifficulty,
          pattern: addPattern,
          leetcodeUrl: addUrl,
        }),
      });
      if (res.ok) {
        const body = await res.json();
        setProblems((prev) => [{ ...body.problem, reviewInDays: null }, ...prev]);
        setAddTitle("");
        setAddUrl("");
        setAddOpen(false);
        toast.success("Problem added.");
        router.refresh();
      } else {
        const body = await res.json().catch(() => ({}));
        setAddError(body.error ?? "Could not add problem.");
      }
    } finally {
      setAddSaving(false);
    }
  };

  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-[2.3fr_1fr]">
      <div>
        <div className="mb-4 grid grid-cols-2 gap-3.5 sm:grid-cols-4">
          {[
            { label: "Owned", value: data.stats.owned },
            { label: "Solved", value: data.stats.solved },
            { label: "Needs review", value: data.stats.needsReview },
            { label: "Total problems", value: data.stats.total },
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
            aria-label="Search problems"
            className="min-w-[160px] flex-1 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-[13px] text-[var(--text)] placeholder:text-[var(--muted)]"
          />
          <select
            value={pattern}
            onChange={(e) => setPattern(e.target.value as DSAPattern | "all")}
            aria-label="Filter by pattern"
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
            aria-label="Filter by difficulty"
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
            aria-label="Filter by status"
            className="rounded-lg border border-[var(--border)] bg-[var(--surface)] px-2.5 py-2 text-[13px] text-[var(--text)]"
          >
            <option value="all">All status</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {dsaStatusLabel(s)}
              </option>
            ))}
          </select>
          <button
            onClick={() => setAddOpen((v) => !v)}
            className="rounded-lg bg-[var(--brand)] px-3.5 py-2 text-[13px] font-semibold text-[var(--brand-text)]"
          >
            {addOpen ? "Cancel" : "+ Add problem"}
          </button>
        </div>

        {addOpen && (
          <Card className="mb-4 p-4">
            <div className="mb-3 flex flex-wrap gap-2.5">
              <input
                value={addTitle}
                onChange={(e) => setAddTitle(e.target.value)}
                placeholder="Problem title"
                className="min-w-[200px] flex-1 rounded-lg border border-[var(--border)] bg-[var(--surface2)] px-3 py-2 text-[13px] text-[var(--text)] placeholder:text-[var(--muted)]"
              />
              <select
                value={addPattern}
                onChange={(e) => setAddPattern(e.target.value as DSAPattern)}
                className="rounded-lg border border-[var(--border)] bg-[var(--surface2)] px-2.5 py-2 text-[13px] text-[var(--text)]"
              >
                {DSA_PATTERNS.map((p) => (
                  <option key={p} value={p}>
                    {PATTERN_LABEL[p]}
                  </option>
                ))}
              </select>
              <select
                value={addDifficulty}
                onChange={(e) => setAddDifficulty(e.target.value as Difficulty)}
                className="rounded-lg border border-[var(--border)] bg-[var(--surface2)] px-2.5 py-2 text-[13px] text-[var(--text)]"
              >
                {DIFFICULTIES.map((d) => (
                  <option key={d} value={d}>
                    {difficultyLabel(d)}
                  </option>
                ))}
              </select>
            </div>
            <input
              value={addUrl}
              onChange={(e) => setAddUrl(e.target.value)}
              placeholder="LeetCode URL (optional)"
              className="mb-3 w-full rounded-lg border border-[var(--border)] bg-[var(--surface2)] px-3 py-2 text-[13px] text-[var(--text)] placeholder:text-[var(--muted)]"
            />
            {addError && <div className="mb-2.5 text-xs text-[var(--danger)]">{addError}</div>}
            <button
              onClick={addProblem}
              disabled={addSaving}
              className="rounded-lg bg-[var(--brand)] px-4 py-2 text-[13px] font-semibold text-[var(--brand-text)] disabled:opacity-60"
            >
              {addSaving ? "Adding…" : "Add problem"}
            </button>
          </Card>
        )}

        <div className="overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface)]">
          <div className="grid grid-cols-[2fr_0.8fr_1fr] border-b border-[var(--border)] px-4 py-2.5 text-[11px] uppercase tracking-wide text-[var(--muted)] sm:grid-cols-[2.2fr_1.3fr_0.8fr_1fr_0.7fr_0.8fr_1fr]">
            <div>Problem</div>
            <div className="hidden sm:block">Pattern</div>
            <div>Diff.</div>
            <div>Status</div>
            <div className="hidden sm:block">Att.</div>
            <div className="hidden sm:block">Time</div>
            <div className="hidden sm:block">Next review</div>
          </div>
          {filtered.map((p) => (
            <button
              key={p.id}
              onClick={() => selectProblem(p.id)}
              className="grid w-full grid-cols-[2fr_0.8fr_1fr] items-center border-b border-[var(--border)] px-4 py-[11px] text-left text-[13px] last:border-b-0 hover:bg-[var(--surface2)] sm:grid-cols-[2.2fr_1.3fr_0.8fr_1fr_0.7fr_0.8fr_1fr]"
            >
              <div className="truncate pr-2 text-[var(--text)]">{p.title}</div>
              <div className="hidden truncate pr-2 text-xs text-[var(--muted)] sm:block">
                {PATTERN_LABEL[p.pattern]}
              </div>
              <div style={{ color: difficultyColor(p.difficulty) }}>{difficultyLabel(p.difficulty)}</div>
              <div className="font-semibold" style={{ color: dsaStatusColor(p.status) }}>
                {dsaStatusLabel(p.status)}
              </div>
              <div className="hidden font-mono text-[var(--muted)] sm:block">{p.attempts}</div>
              <div className="hidden font-mono text-[var(--muted)] sm:block">
                {p.timeSpent ? `${p.timeSpent}m` : "—"}
              </div>
              <div className="hidden font-mono text-[11.5px] text-[var(--muted)] sm:block">
                {reviewDateLabel(p.reviewInDays)}
              </div>
            </button>
          ))}
          {filtered.length === 0 && problems.length > 0 && (
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
          {problems.length === 0 && (
            <div className="px-5 py-11 text-center">
              <div className="mb-2.5 text-[13.5px] text-[var(--muted)]">
                No problems tracked yet. Add your first one to start building the pattern list.
              </div>
              <button
                onClick={() => setAddOpen(true)}
                className="rounded-lg border border-[var(--border)] px-3.5 py-[7px] text-xs text-[var(--text)]"
              >
                + Add problem
              </button>
            </div>
          )}
        </div>

        {selected && (
          <Card className="mt-4 p-5">
            <div className="mb-2.5 flex items-center justify-between">
              <div className="text-[15px] font-bold text-[var(--text)]">{selected.title}</div>
              <button onClick={() => selectProblem(null)} className="text-xs text-[var(--muted)]">
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
              <span className="rounded-md px-2.5 py-1 text-[11.5px] text-[var(--muted)]">
                {PATTERN_LABEL[selected.pattern]}
              </span>
              {selected.leetcodeUrl && (
                <a
                  href={selected.leetcodeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-md px-2.5 py-1 text-[11.5px] text-[var(--brand)] underline"
                >
                  LeetCode ↗
                </a>
              )}
            </div>

            <div className="mb-3.5 flex flex-wrap gap-1.5">
              {STATUSES.map((s) => (
                <button
                  key={s}
                  onClick={() => setProblemStatus(selected.id, s)}
                  disabled={pendingIds.has(selected.id)}
                  className="rounded-md border px-2.5 py-1 text-[11px] font-semibold disabled:opacity-50"
                  style={
                    selected.status === s
                      ? { borderColor: dsaStatusColor(s), color: dsaStatusColor(s), background: "var(--surface2)" }
                      : { borderColor: "var(--border)", color: "var(--muted)" }
                  }
                >
                  {dsaStatusLabel(s)}
                </button>
              ))}
            </div>

            {selected.reviewInDays !== null && selected.reviewInDays <= 0 && (
              <button
                onClick={() => reviewDone(selected.id)}
                disabled={pendingIds.has(selected.id)}
                className="mb-3.5 rounded-lg bg-[var(--brand)] px-3.5 py-1.5 text-[12px] font-semibold text-[var(--brand-text)] disabled:opacity-60"
              >
                Done reviewing
              </button>
            )}

            <textarea
              value={notesDraft}
              onChange={(e) => setNotesDraft(e.target.value)}
              placeholder="Notes…"
              className="mb-2.5 min-h-[80px] w-full resize-y rounded-lg border border-[var(--border)] bg-[var(--surface2)] px-3 py-2.5 text-[13px] text-[var(--text)] placeholder:text-[var(--muted)]"
            />
            <div className="flex items-center justify-between">
              <button
                onClick={() => saveNotes(selected.id)}
                disabled={notesSaving || notesDraft === (selected.notes ?? "")}
                className="rounded-lg border border-[var(--border)] px-3.5 py-[7px] text-xs text-[var(--text)] disabled:opacity-50"
              >
                {notesSaving ? "Saving…" : "Save notes"}
              </button>
              <button
                onClick={() => deleteProblem(selected.id)}
                className="text-xs text-[var(--danger)]"
              >
                Delete problem
              </button>
            </div>
          </Card>
        )}
      </div>

      <div className="flex flex-col gap-5">
        <Card className="p-5">
          <div className="mb-3.5 text-sm font-semibold text-[var(--text)]">Pattern mastery</div>
          {data.patternMastery.length === 0 ? (
            <div className="text-[12.5px] text-[var(--muted)]">Add problems to see pattern coverage.</div>
          ) : (
            <div className="flex flex-col gap-2.5">
              {data.patternMastery.map((p) => (
                <div key={p.pattern}>
                  <div className="mb-1 flex justify-between text-[11.5px]">
                    <span className="text-[var(--text)]">{p.label}</span>
                    <span className="font-mono text-[var(--muted)]">
                      {p.solved}/{p.total}
                    </span>
                  </div>
                  <ProgressBar value={p.total ? (p.solved / p.total) * 100 : 0} className="h-[5px]" />
                </div>
              ))}
            </div>
          )}
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
                <button className="text-left text-[var(--text)]" onClick={() => selectProblem(p.id)}>
                  {p.title}
                </button>
                <button
                  onClick={() => reviewDone(p.id)}
                  disabled={pendingIds.has(p.id)}
                  className="rounded-md border border-[var(--border)] px-2 py-1 text-[11px] text-[var(--text)] disabled:opacity-50"
                >
                  Done
                </button>
              </div>
            ))
          )}
        </Card>
      </div>
    </div>
  );
}
