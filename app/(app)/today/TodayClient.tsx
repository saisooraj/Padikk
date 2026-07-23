"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { usePageHeader } from "@/lib/use-page-header";
import { taskTypeColorVars, TASK_TYPE_LABEL, type TaskType } from "@/lib/curriculum-data";
import { Card } from "@/components/ui/card";
import { Chip } from "@/components/ui/chip";
import { cn } from "@/lib/utils";
import type { TodayData } from "@/lib/queries/today";

const MOOD_OPTIONS = ["😔", "😕", "😐", "🙂", "🔥"];
const WORK_SECONDS = 25 * 60;

function formatTime(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export function TodayClient({ data }: { data: TodayData }) {
  usePageHeader("Today", `Week ${data.currentWeek} · Month ${data.monthNumber}`);
  const router = useRouter();

  const [weekTasks, setWeekTasks] = useState(data.weekTasks);
  const [pendingTaskIds, setPendingTaskIds] = useState<Set<string>>(new Set());
  const [activeTaskId, setActiveTaskId] = useState<string | null>(data.weekTasks[0]?.id ?? null);
  const [secondsLeft, setSecondsLeft] = useState(WORK_SECONDS);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [logTime, setLogTime] = useState("");
  const [logMoodIndex, setLogMoodIndex] = useState<number | null>(null);
  const [logNotes, setLogNotes] = useState("");
  const [logSaved, setLogSaved] = useState(false);
  const [logSaving, setLogSaving] = useState(false);

  useEffect(() => setWeekTasks(data.weekTasks), [data.weekTasks]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const activeTask = weekTasks.find((t) => t.id === activeTaskId) ?? null;

  const toggleTask = async (taskId: string) => {
    if (pendingTaskIds.has(taskId)) return;
    const prevTasks = weekTasks;
    setWeekTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, done: !t.done } : t)));
    setPendingTaskIds((prev) => new Set(prev).add(taskId));
    try {
      const res = await fetch(`/api/tasks/${taskId}/toggle`, { method: "POST" });
      if (!res.ok) throw new Error();
      router.refresh();
    } catch {
      setWeekTasks(prevTasks);
      toast.error("Could not update task. Please try again.");
    } finally {
      setPendingTaskIds((prev) => {
        const next = new Set(prev);
        next.delete(taskId);
        return next;
      });
    }
  };

  const toggleTimer = () => {
    if (running) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setRunning(false);
      return;
    }
    setRunning(true);
    intervalRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          setRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const resetTimer = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setRunning(false);
    setSecondsLeft(WORK_SECONDS);
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
        toast.success("Session logged.");
        router.refresh();
      } else {
        toast.error("Could not save log. Please try again.");
      }
    } finally {
      setLogSaving(false);
    }
  };

  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.5fr_1fr]">
      <Card className="p-5">
        <div className="mb-3.5 text-sm font-semibold text-[var(--text)]">This week&apos;s tasks</div>
        <div className="flex flex-col gap-2">
          {weekTasks.map((task) => {
            const isActive = activeTaskId === task.id;
            const pending = pendingTaskIds.has(task.id);
            const typeVars = taskTypeColorVars(task.type as TaskType);
            return (
              <div
                key={task.id}
                onClick={() => setActiveTaskId(task.id)}
                className={cn(
                  "flex cursor-pointer items-center gap-3 rounded-lg px-2.5 py-2",
                  isActive ? "bg-[var(--brand-soft)]" : "bg-[var(--surface2)]"
                )}
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleTask(task.id);
                  }}
                  disabled={pending}
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
              </div>
            );
          })}
          {weekTasks.length === 0 && (
            <div className="text-[12.5px] text-[var(--muted)]">No tasks scheduled for this week.</div>
          )}
        </div>
      </Card>

      <div className="flex flex-col gap-5">
        <Card className="p-6 text-center">
          <div className="mb-1 text-xs text-[var(--muted)]">Focused on</div>
          <div className="mb-[18px] text-sm font-semibold text-[var(--text)]">
            {activeTask?.title ?? "No task selected"}
          </div>
          <div className="mb-[18px] font-mono text-[44px] font-bold tracking-wide text-[var(--text)]">
            {formatTime(secondsLeft)}
          </div>
          <div className="flex justify-center gap-2.5">
            <button
              onClick={toggleTimer}
              className="rounded-lg bg-[var(--brand)] px-5 py-2 text-[13px] font-semibold text-[var(--brand-text)]"
            >
              {running ? "Pause" : "Start"}
            </button>
            <button
              onClick={resetTimer}
              className="rounded-lg border border-[var(--border)] px-5 py-2 text-[13px] font-semibold text-[var(--text)]"
            >
              Reset
            </button>
          </div>
        </Card>

        <Card className="p-5">
          <div className="mb-3.5 text-sm font-semibold text-[var(--text)]">End-of-day log</div>
          <input
            value={logTime}
            onChange={(e) => setLogTime(e.target.value)}
            placeholder="Time spent (e.g. 1h 45m)"
            className="mb-2.5 w-full rounded-lg border border-[var(--border)] bg-[var(--surface2)] px-3 py-2 text-[13px] text-[var(--text)] placeholder:text-[var(--muted)]"
          />
          <div className="mb-2.5 flex gap-2">
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
            placeholder="Summary of today"
            className="mb-3 min-h-[70px] w-full resize-y rounded-lg border border-[var(--border)] bg-[var(--surface2)] px-3 py-2.5 text-[13px] text-[var(--text)] placeholder:text-[var(--muted)]"
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
    </div>
  );
}
