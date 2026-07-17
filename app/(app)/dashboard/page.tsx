"use client";

import { useState } from "react";

import { usePageHeader } from "@/lib/use-page-header";
import {
  getMonth,
  getPhase,
  phaseColorVars,
  taskTypeColorVars,
  tasksForWeek,
  TASK_TYPE_LABEL,
} from "@/lib/curriculum-data";
import { Card } from "@/components/ui/card";
import { Chip } from "@/components/ui/chip";
import { ProgressBar } from "@/components/ui/progress-bar";
import { cn } from "@/lib/utils";

const CURRENT_MONTH = 1;
const CURRENT_WEEK = 1;
const MOOD_OPTIONS = ["😔", "😕", "😐", "🙂", "🔥"];
const MOMENTUM_WINDOW = 14;

export default function DashboardPage() {
  usePageHeader("Dashboard", "Your daily landing view");

  const month = getMonth(CURRENT_MONTH);
  const phase = getPhase(month.phaseNumber);
  const phaseVars = phaseColorVars(phase.color);
  const weekTasks = tasksForWeek(CURRENT_MONTH, CURRENT_WEEK);

  const [doneTitles, setDoneTitles] = useState<Set<string>>(new Set());
  const [logTime, setLogTime] = useState("");
  const [logMood, setLogMood] = useState<string | null>(null);
  const [logNotes, setLogNotes] = useState("");
  const [logSaved, setLogSaved] = useState(false);

  const toggleTask = (title: string) => {
    setDoneTitles((prev) => {
      const next = new Set(prev);
      next.has(title) ? next.delete(title) : next.add(title);
      return next;
    });
  };

  const doneCount = weekTasks.filter((t) => doneTitles.has(t.title)).length;
  const monthProgress = Math.round((doneCount / Math.max(weekTasks.length, 1)) * 25); // week 1 of 4 ≈ quarter of the month

  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-[2fr_1fr]">
      <div className="flex flex-col gap-5">
        <Card className="p-5">
          <div className="mb-3.5 flex items-center justify-between">
            <div className="text-sm font-semibold text-[var(--text)]">This week</div>
            <div className="text-xs text-[var(--muted)]">
              {doneCount}/{weekTasks.length} tasks done
            </div>
          </div>
          <div className="flex flex-col gap-2">
            {weekTasks.map((task) => {
              const done = doneTitles.has(task.title);
              const typeVars = taskTypeColorVars(task.type);
              return (
                <button
                  key={task.title}
                  onClick={() => toggleTask(task.title)}
                  className="flex items-center gap-3 rounded-lg bg-[var(--surface2)] px-2.5 py-2 text-left"
                >
                  <span
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
                </button>
              );
            })}
          </div>
        </Card>

        <Card className="p-5">
          <div className="mb-3.5 flex items-center justify-between">
            <div className="text-sm font-semibold text-[var(--text)]">
              Active project — Month {month.number}
            </div>
            <Chip label={phase.name} color={phaseVars.color} soft={phaseVars.soft} />
          </div>
          <div className="mb-1 text-base font-semibold text-[var(--text)]">
            {month.project.name}
          </div>
          <div className="mb-3.5 text-[13px] text-[var(--muted)]">{month.title}</div>
          <ProgressBar value={monthProgress} className="mb-2" />
          <div className="text-xs text-[var(--muted)]">{monthProgress}% complete</div>
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
            placeholder="What did you work on?"
            className="mb-3 min-h-[64px] w-full resize-y rounded-lg border border-[var(--border)] bg-[var(--surface2)] px-3 py-2.5 text-[13px] text-[var(--text)] placeholder:text-[var(--muted)]"
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

      <div className="flex flex-col gap-5">
        <Card className="p-5">
          <div className="mb-1 text-sm font-semibold text-[var(--text)]">Momentum</div>
          <div className="mb-2.5 font-mono text-[28px] font-extrabold text-[var(--text)]">
            0<span className="text-sm font-medium text-[var(--muted)]"> days active</span>
          </div>
          <div className="flex gap-1">
            {Array.from({ length: MOMENTUM_WINDOW }).map((_, i) => (
              <div key={i} className="h-[22px] flex-1 rounded-[4px] bg-[var(--surface2)]" />
            ))}
          </div>
          <div className="mt-2 text-[11.5px] text-[var(--muted)]">last {MOMENTUM_WINDOW} days</div>
        </Card>

        <Card className="p-5">
          <div className="mb-3 text-sm font-semibold text-[var(--text)]">Recent activity</div>
          <div className="text-[12.5px] text-[var(--muted)]">
            No activity yet. Log today&apos;s first session to get started.
          </div>
        </Card>

        <Card className="p-5">
          <div className="mb-2.5 text-sm font-semibold text-[var(--text)]">Due for review</div>
          <div className="text-[12.5px] text-[var(--muted)]">
            Nothing due today — DSA review starts in Month 8.
          </div>
        </Card>
      </div>
    </div>
  );
}
