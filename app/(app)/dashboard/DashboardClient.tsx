"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";

import { usePageHeader } from "@/lib/use-page-header";
import {
  phaseColorVars,
  taskTypeColorVars,
  TASK_TYPE_LABEL,
  type PhaseColorKey,
  type TaskType,
} from "@/lib/curriculum-data";
import { Card } from "@/components/ui/card";
import { Chip } from "@/components/ui/chip";
import { ProgressBar } from "@/components/ui/progress-bar";
import { cn } from "@/lib/utils";
import type { DashboardData } from "@/lib/queries/dashboard";

const MOOD_OPTIONS = ["😔", "😕", "😐", "🙂", "🔥"];

export function DashboardClient({ data }: { data: DashboardData }) {
  usePageHeader("Dashboard", "Your daily landing view");
  const router = useRouter();

  const [pendingTaskIds, setPendingTaskIds] = useState<Set<string>>(new Set());
  const [logTime, setLogTime] = useState("");
  const [logMoodIndex, setLogMoodIndex] = useState<number | null>(null);
  const [logNotes, setLogNotes] = useState("");
  const [logSaved, setLogSaved] = useState(false);
  const [logSaving, setLogSaving] = useState(false);

  const phaseVars = phaseColorVars(data.phase.color as PhaseColorKey);
  const doneCount = data.weekTasks.filter((t) => t.done).length;

  const toggleTask = async (taskId: string) => {
    if (pendingTaskIds.has(taskId)) return;
    setPendingTaskIds((prev) => new Set(prev).add(taskId));
    try {
      const res = await fetch(`/api/tasks/${taskId}/toggle`, { method: "POST" });
      if (res.ok) router.refresh();
    } finally {
      setPendingTaskIds((prev) => {
        const next = new Set(prev);
        next.delete(taskId);
        return next;
      });
    }
  };

  const saveLog = async () => {
    if (logMoodIndex === null || logSaving) return;
    setLogSaving(true);
    try {
      const res = await fetch("/api/daily-log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ timeText: logTime, mood: logMoodIndex + 1, summary: logNotes }),
      });
      if (res.ok) {
        setLogSaved(true);
        router.refresh();
      }
    } finally {
      setLogSaving(false);
    }
  };

  const reviewMessage = !data.dsaPhaseStarted
    ? "Nothing due today — DSA review starts in Month 8."
    : data.dueForReviewCount > 0
      ? `${data.dueForReviewCount} problem${data.dueForReviewCount === 1 ? "" : "s"} due for review.`
      : "Nothing due today.";

  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-[2fr_1fr]">
      <div className="flex flex-col gap-5">
        <Card className="p-5">
          <div className="mb-3.5 flex items-center justify-between">
            <div className="text-sm font-semibold text-[var(--text)]">This week</div>
            <div className="text-xs text-[var(--muted)]">
              {doneCount}/{data.weekTasks.length} tasks done
            </div>
          </div>
          <div className="flex flex-col gap-2">
            {data.weekTasks.map((task) => {
              const typeVars = taskTypeColorVars(task.type as TaskType);
              const pending = pendingTaskIds.has(task.id);
              return (
                <button
                  key={task.id}
                  onClick={() => toggleTask(task.id)}
                  disabled={pending}
                  className="flex items-center gap-3 rounded-lg bg-[var(--surface2)] px-2.5 py-2 text-left disabled:opacity-60"
                >
                  <span
                    className={cn(
                      "h-4 w-4 shrink-0 rounded-[5px] border-[1.5px]",
                      task.done ? "bg-[var(--brand)]" : "border-[var(--border)]"
                    )}
                    style={task.done ? { borderColor: "var(--brand)" } : undefined}
                  />
                  <Chip label={TASK_TYPE_LABEL[task.type as TaskType]} color={typeVars.color} soft={typeVars.soft} />
                  <span
                    className={cn(
                      "flex-1 truncate text-[13.5px]",
                      task.done && "text-[var(--muted)] line-through"
                    )}
                  >
                    {task.title}
                  </span>
                  <span className="font-mono text-xs text-[var(--muted)]">{task.duration}m</span>
                </button>
              );
            })}
            {data.weekTasks.length === 0 && (
              <div className="text-[12.5px] text-[var(--muted)]">No tasks scheduled for this week.</div>
            )}
          </div>
        </Card>

        <Card className="p-5">
          <div className="mb-3.5 flex items-center justify-between">
            <div className="text-sm font-semibold text-[var(--text)]">
              Active project — Month {data.monthNumber}
            </div>
            <Chip label={data.phase.name} color={phaseVars.color} soft={phaseVars.soft} />
          </div>
          {data.project && (
            <>
              <div className="mb-1 text-base font-semibold text-[var(--text)]">{data.project.name}</div>
              <div className="mb-3.5 text-[13px] text-[var(--muted)]">{data.monthTitle}</div>
            </>
          )}
          <ProgressBar value={data.monthProgress} className="mb-2" />
          <div className="text-xs text-[var(--muted)]">{data.monthProgress}% complete</div>
        </Card>

        <Card className="p-5">
          <div className="mb-3.5 text-sm font-semibold text-[var(--text)]">
            Log today&apos;s session
          </div>
          <div className="mb-3 flex gap-2.5">
            <input
              value={logTime}
              onChange={(e) => setLogTime(e.target.value)}
              placeholder="Time spent (e.g. 1h 45m)"
              className="flex-1 rounded-lg border border-[var(--border)] bg-[var(--surface2)] px-3 py-2 text-[13px] text-[var(--text)] placeholder:text-[var(--muted)]"
            />
            {MOOD_OPTIONS.map((mood, i) => (
              <button
                key={mood}
                onClick={() => setLogMoodIndex(i)}
                className={cn(
                  "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-base",
                  logMoodIndex === i ? "bg-[var(--brand)]" : "bg-[var(--surface2)]"
                )}
              >
                {mood}
              </button>
            ))}
          </div>
          <textarea
            value={logNotes}
            onChange={(e) => setLogNotes(e.target.value)}
            placeholder="What did you work on?"
            className="mb-3 min-h-[64px] w-full resize-y rounded-lg border border-[var(--border)] bg-[var(--surface2)] px-3 py-2.5 text-[13px] text-[var(--text)] placeholder:text-[var(--muted)]"
          />
          <div className="flex items-center gap-3">
            <button
              onClick={saveLog}
              disabled={logMoodIndex === null || logSaving}
              className="rounded-lg bg-[var(--brand)] px-[18px] py-2 text-[13px] font-semibold text-[var(--brand-text)] disabled:opacity-60"
            >
              {logSaving ? "Saving…" : "Save log"}
            </button>
            {logSaved && <span className="text-xs text-[var(--brand)]">Saved ✓</span>}
          </div>
        </Card>
      </div>

      <div className="flex flex-col gap-5">
        <Card className="p-5">
          <div className="mb-1 text-sm font-semibold text-[var(--text)]">Momentum</div>
          <div className="mb-2.5 font-mono text-[28px] font-extrabold text-[var(--text)]">
            {data.streak.currentStreak}
            <span className="text-sm font-medium text-[var(--muted)]"> days active</span>
          </div>
          <div className="flex gap-1">
            {data.momentum.map((active, i) => (
              <div
                key={i}
                className="h-[22px] flex-1 rounded-[4px]"
                style={{ background: active ? "var(--brand)" : "var(--surface2)" }}
              />
            ))}
          </div>
          <div className="mt-2 text-[11.5px] text-[var(--muted)]">last {data.momentum.length} days</div>
        </Card>

        <Card className="p-5">
          <div className="mb-3 text-sm font-semibold text-[var(--text)]">Recent activity</div>
          {data.recentActivity.length === 0 ? (
            <div className="text-[12.5px] text-[var(--muted)]">
              No activity yet. Log today&apos;s first session to get started.
            </div>
          ) : (
            <div className="flex flex-col gap-2.5">
              {data.recentActivity.map((log) => (
                <div key={log.id} className="text-[12.5px]">
                  <span className="font-mono text-[var(--muted)]">{format(log.date, "MMM d")}</span>
                  <span className="text-[var(--text)]"> — {log.totalTime}m in {log.month.title}</span>
                  {log.summary && <span className="text-[var(--muted)]"> · {log.summary}</span>}
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card className="p-5">
          <div className="mb-2.5 text-sm font-semibold text-[var(--text)]">Due for review</div>
          <div className="text-[12.5px] text-[var(--muted)]">{reviewMessage}</div>
        </Card>
      </div>
    </div>
  );
}
