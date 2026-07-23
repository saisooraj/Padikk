"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { toast } from "sonner";

import { usePageHeader } from "@/lib/use-page-header";
import { INTERVIEW_TYPE_LABEL, type InterviewType } from "@/lib/interviews-data";
import { scoreColor } from "@/lib/status-colors";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { InterviewsData, InterviewRow } from "@/lib/queries/interviews";

const INTERVIEW_TYPES = Object.keys(INTERVIEW_TYPE_LABEL) as InterviewType[];
const PLATFORMS = ["Pramp", "interviewing.io", "Peer", "Self"];
const SCORES = [1, 2, 3, 4, 5];

interface FormState {
  date: string;
  platform: string;
  type: InterviewType;
  company: string;
  difficulty: number;
  performance: number;
  topics: string;
  feedback: string;
  improvements: string;
}

function emptyForm(): FormState {
  return {
    date: format(new Date(), "yyyy-MM-dd"),
    platform: PLATFORMS[0],
    type: "DSA",
    company: "",
    difficulty: 3,
    performance: 3,
    topics: "",
    feedback: "",
    improvements: "",
  };
}

function formFromRow(row: InterviewRow): FormState {
  return {
    date: format(row.date, "yyyy-MM-dd"),
    platform: row.platform,
    type: row.type as InterviewType,
    company: row.company ?? "",
    difficulty: row.difficulty,
    performance: row.performance,
    topics: row.topics.join(", "),
    feedback: row.feedback ?? "",
    improvements: row.improvements ?? "",
  };
}

function ScoreRow({ value, onChange, label }: { value: number; onChange: (n: number) => void; label: string }) {
  return (
    <div className="flex gap-1.5" role="group" aria-label={label}>
      {SCORES.map((s) => (
        <button
          key={s}
          type="button"
          onClick={() => onChange(s)}
          aria-pressed={value === s}
          aria-label={`${label}: ${s}`}
          className={cn(
            "flex h-7 w-7 items-center justify-center rounded-lg text-xs font-semibold",
            value === s ? "bg-[var(--brand)] text-[var(--brand-text)]" : "bg-[var(--surface2)] text-[var(--muted)]"
          )}
        >
          {s}
        </button>
      ))}
    </div>
  );
}

export function InterviewsClient({ data, initialSelectedId }: { data: InterviewsData; initialSelectedId?: string }) {
  usePageHeader("Interviews", "Mock interview log");
  const router = useRouter();

  const [interviews, setInterviews] = useState(data.interviews);
  useEffect(() => setInterviews(data.interviews), [data.interviews]);

  const selectInterview = (id: string | null) =>
    router.push(id ? `/interviews/${id}` : "/interviews", { scroll: false });

  const [addOpen, setAddOpen] = useState(false);
  const [addForm, setAddForm] = useState<FormState>(emptyForm());
  const [addSaving, setAddSaving] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);

  const [editForm, setEditForm] = useState<FormState | null>(null);
  const [editSaving, setEditSaving] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  const selected = initialSelectedId ? interviews.find((iv) => iv.id === initialSelectedId) ?? null : null;

  useEffect(() => {
    setEditForm(selected ? formFromRow(selected) : null);
    setEditError(null);
  }, [selected]);

  const isDirty = selected && editForm ? JSON.stringify(editForm) !== JSON.stringify(formFromRow(selected)) : false;

  const toPayload = (f: FormState) => ({
    date: f.date,
    platform: f.platform,
    type: f.type,
    company: f.company,
    difficulty: f.difficulty,
    performance: f.performance,
    topics: f.topics
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean),
    feedback: f.feedback,
    improvements: f.improvements,
  });

  const addInterview = async () => {
    setAddSaving(true);
    setAddError(null);
    try {
      const res = await fetch("/api/interviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(toPayload(addForm)),
      });
      if (res.ok) {
        const body = await res.json();
        setInterviews((prev) => [body.interview, ...prev]);
        setAddForm(emptyForm());
        setAddOpen(false);
        toast.success("Interview logged.");
        router.refresh();
      } else {
        const body = await res.json().catch(() => ({}));
        setAddError(body.error ?? "Could not log interview.");
      }
    } finally {
      setAddSaving(false);
    }
  };

  const saveEdit = async () => {
    if (!selected || !editForm) return;
    setEditSaving(true);
    setEditError(null);
    try {
      const res = await fetch(`/api/interviews/${selected.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(toPayload(editForm)),
      });
      if (res.ok) {
        const body = await res.json();
        setInterviews((prev) => prev.map((iv) => (iv.id === selected.id ? body.interview : iv)));
        toast.success("Changes saved.");
        router.refresh();
      } else {
        const body = await res.json().catch(() => ({}));
        setEditError(body.error ?? "Could not save changes.");
      }
    } finally {
      setEditSaving(false);
    }
  };

  const deleteInterview = async () => {
    if (!selected) return;
    if (!confirm("Delete this interview log? This can't be undone.")) return;
    const prevInterviews = interviews;
    setInterviews((prev) => prev.filter((iv) => iv.id !== selected.id));
    selectInterview(null);
    try {
      const res = await fetch(`/api/interviews/${selected.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      toast.success("Interview deleted.");
      router.refresh();
    } catch {
      setInterviews(prevInterviews);
      toast.error("Could not delete interview. Please try again.");
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <button
          onClick={() => setAddOpen((v) => !v)}
          className="rounded-lg bg-[var(--brand)] px-3.5 py-2 text-[13px] font-semibold text-[var(--brand-text)]"
        >
          {addOpen ? "Cancel" : "+ Log interview"}
        </button>
      </div>

      {addOpen && (
        <Card className="p-4">
          <div className="mb-3 grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
            <input
              type="date"
              value={addForm.date}
              onChange={(e) => setAddForm((f) => ({ ...f, date: e.target.value }))}
              className="rounded-lg border border-[var(--border)] bg-[var(--surface2)] px-3 py-2 text-[13px] text-[var(--text)]"
            />
            <select
              value={addForm.platform}
              onChange={(e) => setAddForm((f) => ({ ...f, platform: e.target.value }))}
              className="rounded-lg border border-[var(--border)] bg-[var(--surface2)] px-2.5 py-2 text-[13px] text-[var(--text)]"
            >
              {PLATFORMS.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
            <select
              value={addForm.type}
              onChange={(e) => setAddForm((f) => ({ ...f, type: e.target.value as InterviewType }))}
              className="rounded-lg border border-[var(--border)] bg-[var(--surface2)] px-2.5 py-2 text-[13px] text-[var(--text)]"
            >
              {INTERVIEW_TYPES.map((t) => (
                <option key={t} value={t}>
                  {INTERVIEW_TYPE_LABEL[t]}
                </option>
              ))}
            </select>
            <input
              value={addForm.company}
              onChange={(e) => setAddForm((f) => ({ ...f, company: e.target.value }))}
              placeholder="Company (optional)"
              className="rounded-lg border border-[var(--border)] bg-[var(--surface2)] px-3 py-2 text-[13px] text-[var(--text)] placeholder:text-[var(--muted)]"
            />
          </div>

          <div className="mb-3 grid grid-cols-1 gap-3.5 sm:grid-cols-2">
            <div>
              <div className="mb-1.5 text-xs text-[var(--muted)]">Difficulty</div>
              <ScoreRow
                value={addForm.difficulty}
                onChange={(n) => setAddForm((f) => ({ ...f, difficulty: n }))}
                label="Difficulty"
              />
            </div>
            <div>
              <div className="mb-1.5 text-xs text-[var(--muted)]">Performance</div>
              <ScoreRow
                value={addForm.performance}
                onChange={(n) => setAddForm((f) => ({ ...f, performance: n }))}
                label="Performance"
              />
            </div>
          </div>

          <input
            value={addForm.topics}
            onChange={(e) => setAddForm((f) => ({ ...f, topics: e.target.value }))}
            placeholder="Topics (comma-separated)"
            className="mb-2.5 w-full rounded-lg border border-[var(--border)] bg-[var(--surface2)] px-3 py-2 text-[13px] text-[var(--text)] placeholder:text-[var(--muted)]"
          />
          <textarea
            value={addForm.feedback}
            onChange={(e) => setAddForm((f) => ({ ...f, feedback: e.target.value }))}
            placeholder="Feedback"
            className="mb-2.5 min-h-[56px] w-full resize-y rounded-lg border border-[var(--border)] bg-[var(--surface2)] px-3 py-2.5 text-[13px] text-[var(--text)] placeholder:text-[var(--muted)]"
          />
          <textarea
            value={addForm.improvements}
            onChange={(e) => setAddForm((f) => ({ ...f, improvements: e.target.value }))}
            placeholder="What to improve"
            className="mb-3 min-h-[56px] w-full resize-y rounded-lg border border-[var(--border)] bg-[var(--surface2)] px-3 py-2.5 text-[13px] text-[var(--text)] placeholder:text-[var(--muted)]"
          />
          {addError && <div className="mb-2.5 text-xs text-[var(--danger)]">{addError}</div>}
          <button
            onClick={addInterview}
            disabled={addSaving}
            className="rounded-lg bg-[var(--brand)] px-4 py-2 text-[13px] font-semibold text-[var(--brand-text)] disabled:opacity-60"
          >
            {addSaving ? "Saving…" : "Log interview"}
          </button>
        </Card>
      )}

      <div className="overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface)]">
        <div className="grid grid-cols-[0.9fr_1.2fr_0.8fr] border-b border-[var(--border)] px-4 py-2.5 text-[11px] uppercase tracking-wide text-[var(--muted)] sm:grid-cols-[0.9fr_1fr_1.3fr_1.2fr_0.8fr_0.8fr]">
          <div>Date</div>
          <div>Platform</div>
          <div className="hidden sm:block">Type</div>
          <div className="hidden sm:block">Company</div>
          <div className="hidden sm:block">Difficulty</div>
          <div>Score</div>
        </div>
        {interviews.map((iv) => (
          <button
            key={iv.id}
            onClick={() => selectInterview(iv.id)}
            className="w-full border-b border-[var(--border)] px-4 py-[13px] text-left last:border-b-0 hover:bg-[var(--surface2)]"
          >
            <div className="grid grid-cols-[0.9fr_1.2fr_0.8fr] items-center text-[13px] sm:grid-cols-[0.9fr_1fr_1.3fr_1.2fr_0.8fr_0.8fr]">
              <div className="font-mono text-xs text-[var(--muted)]">{format(iv.date, "MMM d")}</div>
              <div className="text-[var(--text)]">{iv.platform}</div>
              <div className="hidden text-[var(--muted)] sm:block">
                {INTERVIEW_TYPE_LABEL[iv.type as InterviewType]}
              </div>
              <div className="hidden text-[var(--text)] sm:block">{iv.company ?? "—"}</div>
              <div className="hidden text-[var(--text)] sm:block">{iv.difficulty}/5</div>
              <div className="font-semibold" style={{ color: scoreColor(iv.performance) }}>
                {iv.performance}/5
              </div>
            </div>
            {iv.feedback && <div className="mt-2 text-xs text-[var(--muted)]">{iv.feedback}</div>}
          </button>
        ))}
        {interviews.length === 0 && (
          <div className="px-5 py-11 text-center">
            <div className="mb-2.5 text-[13.5px] text-[var(--muted)]">No mock interviews logged yet.</div>
            <button
              onClick={() => setAddOpen(true)}
              className="rounded-lg border border-[var(--border)] px-3.5 py-[7px] text-xs text-[var(--text)]"
            >
              + Log interview
            </button>
          </div>
        )}
      </div>

      {selected && editForm && (
        <Card className="p-5">
          <div className="mb-3.5 flex items-center justify-between">
            <div className="text-[15px] font-bold text-[var(--text)]">
              {selected.platform} · {format(selected.date, "MMM d, yyyy")}
            </div>
            <button onClick={() => selectInterview(null)} className="text-xs text-[var(--muted)]">
              Close ✕
            </button>
          </div>

          <div className="mb-3 grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
            <input
              type="date"
              value={editForm.date}
              onChange={(e) => setEditForm((f) => f && { ...f, date: e.target.value })}
              className="rounded-lg border border-[var(--border)] bg-[var(--surface2)] px-3 py-2 text-[13px] text-[var(--text)]"
            />
            <select
              value={editForm.platform}
              onChange={(e) => setEditForm((f) => f && { ...f, platform: e.target.value })}
              className="rounded-lg border border-[var(--border)] bg-[var(--surface2)] px-2.5 py-2 text-[13px] text-[var(--text)]"
            >
              {PLATFORMS.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
            <select
              value={editForm.type}
              onChange={(e) => setEditForm((f) => f && { ...f, type: e.target.value as InterviewType })}
              className="rounded-lg border border-[var(--border)] bg-[var(--surface2)] px-2.5 py-2 text-[13px] text-[var(--text)]"
            >
              {INTERVIEW_TYPES.map((t) => (
                <option key={t} value={t}>
                  {INTERVIEW_TYPE_LABEL[t]}
                </option>
              ))}
            </select>
            <input
              value={editForm.company}
              onChange={(e) => setEditForm((f) => f && { ...f, company: e.target.value })}
              placeholder="Company (optional)"
              className="rounded-lg border border-[var(--border)] bg-[var(--surface2)] px-3 py-2 text-[13px] text-[var(--text)] placeholder:text-[var(--muted)]"
            />
          </div>

          <div className="mb-3 grid grid-cols-1 gap-3.5 sm:grid-cols-2">
            <div>
              <div className="mb-1.5 text-xs text-[var(--muted)]">Difficulty</div>
              <ScoreRow
                value={editForm.difficulty}
                onChange={(n) => setEditForm((f) => f && { ...f, difficulty: n })}
                label="Difficulty"
              />
            </div>
            <div>
              <div className="mb-1.5 text-xs text-[var(--muted)]">Performance</div>
              <ScoreRow
                value={editForm.performance}
                onChange={(n) => setEditForm((f) => f && { ...f, performance: n })}
                label="Performance"
              />
            </div>
          </div>

          <input
            value={editForm.topics}
            onChange={(e) => setEditForm((f) => f && { ...f, topics: e.target.value })}
            placeholder="Topics (comma-separated)"
            className="mb-2.5 w-full rounded-lg border border-[var(--border)] bg-[var(--surface2)] px-3 py-2 text-[13px] text-[var(--text)] placeholder:text-[var(--muted)]"
          />
          <textarea
            value={editForm.feedback}
            onChange={(e) => setEditForm((f) => f && { ...f, feedback: e.target.value })}
            placeholder="Feedback"
            className="mb-2.5 min-h-[56px] w-full resize-y rounded-lg border border-[var(--border)] bg-[var(--surface2)] px-3 py-2.5 text-[13px] text-[var(--text)] placeholder:text-[var(--muted)]"
          />
          <textarea
            value={editForm.improvements}
            onChange={(e) => setEditForm((f) => f && { ...f, improvements: e.target.value })}
            placeholder="What to improve"
            className="mb-3 min-h-[56px] w-full resize-y rounded-lg border border-[var(--border)] bg-[var(--surface2)] px-3 py-2.5 text-[13px] text-[var(--text)] placeholder:text-[var(--muted)]"
          />
          {editError && <div className="mb-2.5 text-xs text-[var(--danger)]">{editError}</div>}
          <div className="flex items-center justify-between">
            <button
              onClick={deleteInterview}
              className="rounded-lg border border-[var(--border)] px-3.5 py-[7px] text-xs text-[var(--danger)]"
            >
              Delete
            </button>
            <button
              onClick={saveEdit}
              disabled={editSaving || !isDirty}
              className="rounded-lg bg-[var(--brand)] px-4 py-2 text-[13px] font-semibold text-[var(--brand-text)] disabled:opacity-50"
            >
              {editSaving ? "Saving…" : "Save changes"}
            </button>
          </div>
        </Card>
      )}
    </div>
  );
}
