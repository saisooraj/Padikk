import { isSameDay, subDays } from "date-fns";

import { prisma } from "@/lib/prisma";
import { dateOnly } from "@/lib/date-only";

const MOMENTUM_WINDOW = 14;

export async function getOrCreateUserSettings(userId: string) {
  return prisma.userSettings.upsert({
    where: { userId },
    update: {},
    create: { userId, startDate: new Date(), currentMonth: 1 },
  });
}

export async function getOrCreateStreak(userId: string) {
  return prisma.streak.upsert({
    where: { userId },
    update: {},
    create: { userId },
  });
}

export async function getDashboardData(userId: string) {
  const settings = await getOrCreateUserSettings(userId);

  const month = await prisma.month.findUniqueOrThrow({
    where: { number: settings.currentMonth },
    include: {
      phase: true,
      project: true,
      dailyTasks: {
        orderBy: { order: "asc" },
        include: { completions: { where: { userId } } },
      },
    },
  });

  const tasksByWeek = new Map<number, typeof month.dailyTasks>();
  for (const task of month.dailyTasks) {
    const list = tasksByWeek.get(task.weekNumber) ?? [];
    list.push(task);
    tasksByWeek.set(task.weekNumber, list);
  }

  // "Current week" is the first week (1-4) that still has an incomplete task —
  // progress-derived like Month's status, not a stored field.
  let currentWeek = 4;
  for (let week = 1; week <= 4; week++) {
    const tasks = tasksByWeek.get(week) ?? [];
    if (tasks.length > 0 && tasks.some((t) => t.completions.length === 0)) {
      currentWeek = week;
      break;
    }
  }

  const weekTasks = (tasksByWeek.get(currentWeek) ?? []).map((t) => ({
    id: t.id,
    title: t.title,
    duration: t.duration,
    type: t.type,
    done: t.completions.length > 0,
  }));

  const totalTasks = month.dailyTasks.length;
  const completedTasks = month.dailyTasks.filter((t) => t.completions.length > 0).length;
  const monthProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const streak = await getOrCreateStreak(userId);

  const todayStart = dateOnly();
  const windowStart = subDays(todayStart, MOMENTUM_WINDOW - 1);
  const recentLogs = await prisma.dailyLog.findMany({
    where: { userId, date: { gte: windowStart } },
  });
  const momentum = Array.from({ length: MOMENTUM_WINDOW }, (_, i) => {
    const day = subDays(todayStart, MOMENTUM_WINDOW - 1 - i);
    return recentLogs.some((log) => isSameDay(log.date, day));
  });

  const recentActivity = await prisma.dailyLog.findMany({
    where: { userId },
    orderBy: { date: "desc" },
    take: 5,
    include: { month: { select: { title: true } } },
  });

  const dueForReviewCount = await prisma.dSAProblem.count({
    where: { userId, reviewAt: { lte: new Date() } },
  });

  return {
    monthNumber: month.number,
    monthTitle: month.title,
    monthSubtitle: month.subtitle,
    phase: month.phase,
    project: month.project,
    weekTasks,
    currentWeek,
    monthProgress,
    streak,
    momentum,
    recentActivity,
    dueForReviewCount,
    dsaPhaseStarted: settings.currentMonth >= 8,
  };
}

export type DashboardData = Awaited<ReturnType<typeof getDashboardData>>;
