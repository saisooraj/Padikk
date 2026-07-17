import { prisma } from "@/lib/prisma";
import { TASK_TYPE_LABEL, TASK_TYPE_COLOR, type TaskType } from "@/lib/curriculum-data";
import { dateOnly } from "@/lib/date-only";
import type { Difficulty } from "@/lib/status-colors";

const TASK_TYPES: TaskType[] = ["LEARN", "BUILD", "DSA", "REVIEW", "MOCK", "READ"];
const DIFFICULTIES: Difficulty[] = ["EASY", "MEDIUM", "HARD"];

const HEATMAP_WEEKS = 20;
const HEATMAP_DAYS = HEATMAP_WEEKS * 7;

function heatmapLevel(minutes: number): number {
  if (minutes <= 0) return 0;
  if (minutes < 30) return 1;
  if (minutes < 60) return 2;
  if (minutes < 120) return 3;
  return 4;
}

export async function getStatsData(userId: string) {
  const [completions, logs, dsaProblems, interviews] = await Promise.all([
    prisma.taskCompletion.findMany({
      where: { userId },
      select: { timeSpent: true, task: { select: { type: true } } },
    }),
    prisma.dailyLog.findMany({
      where: { userId },
      select: { date: true, totalTime: true },
    }),
    prisma.dSAProblem.findMany({
      where: { userId },
      select: { difficulty: true, status: true },
    }),
    prisma.mockInterview.findMany({
      where: { userId },
      orderBy: { date: "asc" },
      select: { id: true, date: true, performance: true },
    }),
  ]);

  const minutesByType = new Map<TaskType, number>(TASK_TYPES.map((t) => [t, 0]));
  for (const c of completions) {
    const type = c.task.type as TaskType;
    minutesByType.set(type, (minutesByType.get(type) ?? 0) + c.timeSpent);
  }
  const maxMinutes = Math.max(1, ...Array.from(minutesByType.values()));
  const hoursByType = TASK_TYPES.map((type) => {
    const minutes = minutesByType.get(type) ?? 0;
    return {
      type,
      label: TASK_TYPE_LABEL[type],
      colorKey: TASK_TYPE_COLOR[type],
      minutes,
      hours: Math.round(minutes / 6) / 10,
      max: maxMinutes,
    };
  });

  const totalMinutes = completions.reduce((sum, c) => sum + c.timeSpent, 0);
  const totalHours = Math.round(totalMinutes / 6) / 10;

  const avgSessionMinutes = logs.length
    ? Math.round(logs.reduce((sum, l) => sum + l.totalTime, 0) / logs.length)
    : 0;

  const dsaSolved = dsaProblems.filter((p) => p.status === "SOLVED" || p.status === "OWNED").length;

  const difficultyDistribution = DIFFICULTIES.map((difficulty) => {
    const inDifficulty = dsaProblems.filter((p) => p.difficulty === difficulty);
    const solved = inDifficulty.filter((p) => p.status === "SOLVED" || p.status === "OWNED").length;
    return { difficulty, total: inDifficulty.length, solved };
  });

  const today = dateOnly();
  const logByDate = new Map(logs.map((l) => [dateOnly(l.date).getTime(), l.totalTime]));
  const heatmap: number[][] = [];
  for (let w = 0; w < HEATMAP_WEEKS; w++) {
    const week: number[] = [];
    for (let d = 0; d < 7; d++) {
      const offset = HEATMAP_DAYS - 1 - (w * 7 + d);
      const day = new Date(today);
      day.setUTCDate(day.getUTCDate() - offset);
      week.push(heatmapLevel(logByDate.get(day.getTime()) ?? 0));
    }
    heatmap.push(week);
  }

  return {
    statTiles: {
      totalHours,
      dsaSolved,
      dsaTotal: dsaProblems.length,
      interviewCount: interviews.length,
      avgSessionMinutes,
    },
    heatmap,
    hoursByType,
    difficultyDistribution,
    interviewTrend: interviews.map((iv) => ({ id: iv.id, date: iv.date, performance: iv.performance })),
  };
}

export type StatsData = Awaited<ReturnType<typeof getStatsData>>;
