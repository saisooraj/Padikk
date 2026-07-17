"use client";

import { useEffect, useRef, useState } from "react";

import { usePageHeader } from "@/lib/use-page-header";
import { getMonth, tasksForWeek, taskTypeColorVars, TASK_TYPE_LABEL } from "@/lib/curriculum-data";
import { Card } from "@/components/ui/card";
import { Chip } from "@/components/ui/chip";
import { cn } from "@/lib/utils";

const CURRENT_MONTH = 1;
const CURRENT_WEEK = 1;
const MOOD_OPTIONS = ["😔", "😕", "😐", "🙂", "🔥"];
const WORK_SECONDS = 25 * 60;

function formatTime(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export default function TodayPage() {
  const month = getMonth(CURRENT_MONTH);
  usePageHeader("Today", `Day 1 of Month ${month.number}`);

  const weekTasks = tasksForWeek(CURRENT_MONTH, CURRENT_WEEK);

  const [doneTitles, setDoneTitles] = useState<Set<string>>(new Set());
  const [activeTitle, setActiveTitle] = useState<string | null>(weekTasks[0]?.title ?? null);
  const [secondsLeft, setSecondsLeft] = useState(WORK_SECONDS);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [logTime, setLogTime] = useState("");
  const [logMood, setLogMood] = useState<string | null>(null);
  const [logNotes, setLogNotes] = useState("");
  const [logSaved, setLogSaved] = useState(false);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const toggleDone = (title: string) => {
    setDoneTitles((prev) => {
      const next = new Set(prev);
      next.has(title) ? next.delete(title) : next.add(title);
      return next;
    });
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

  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.5fr_1fr]">
      <Card className="p-5">
        <div className="mb-3.5 text-sm font-semibold text-[var(--text)]">This week&apos;s tasks</div>
        <div className="flex flex-col gap-2">
          {weekTasks.map((task) => {
            const done = doneTitles.has(task.title);
            const isActive = activeTitle === task.title;
            const typeVars = taskTypeColorVars(task.type);
            return (
              <div
                key={task.title}
                onClick={() => setActiveTitle(task.title)}
                className={cn(
                  "flex cursor-pointer items-center gap-3 rounded-lg px-2.5 py-2",
                  isActive ? "bg-[var(--brand-soft)]" : "bg-[var(--surface2)]"
                )}
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleDone(task.title);
                  }}
                  className={cn(
                    "h-4 w-4 shrink-0 rounded-[5px] border-[1.5px]",
                    done ? "bg-[var(--brand)]" : "border-[var(--border)]"
                  )}
                  style={done ? { borderColor: "var(--brand)" } : undefined}
                />
                <Chip label={TASK_TYPE_LABEL[task.type]} color={typeVars.color} soft={typeVars.soft} />
                <span
                  className={cn(
                    "flex-1 truncate text-[13.5px]",
                    done && "text-[var(--muted)] line-through"
                  )}
                >
                  {task.title}
                </span>
                <span className="font-mono text-xs text-[var(--muted)]">{task.duration}m</span>
              </div>
            );
          })}
        </div>
      </Card>

      <div className="flex flex-col gap-5">
        <Card className="p-6 text-center">
          <div className="mb-1 text-xs text-[var(--muted)]">Focused on</div>
          <div className="mb-[18px] text-sm font-semibold text-[var(--text)]">
            {activeTitle ?? "No task selected"}
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
            placeholder="Time spent"
            className="mb-2.5 w-full rounded-lg border border-[var(--border)] bg-[var(--surface2)] px-3 py-2 text-[13px] text-[var(--text)] placeholder:text-[var(--muted)]"
          />
          <div className="mb-2.5 flex gap-2">
            {MOOD_OPTIONS.map((mood) => (
              <button
                key={mood}
                onClick={() => setLogMood(mood)}
                className={cn(
                  "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-base",
                  logMood === mood ? "bg-[var(--brand)]" : "bg-[var(--surface2)]"
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
              onClick={() => setLogSaved(true)}
              className="rounded-lg bg-[var(--brand)] px-[18px] py-2 text-[13px] font-semibold text-[var(--brand-text)]"
            >
              Save log
            </button>
            {logSaved && <span className="text-xs text-[var(--brand)]">Saved ✓</span>}
          </div>
        </Card>
      </div>
    </div>
  );
}
