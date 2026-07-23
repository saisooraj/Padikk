import { prisma } from "@/lib/prisma";
import { getOrCreateUserSettings } from "@/lib/queries/dashboard";

export async function getTodayData(userId: string) {
  const settings = await getOrCreateUserSettings(userId);

  const month = await prisma.month.findUniqueOrThrow({
    where: { number: settings.currentMonth },
    include: {
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

  // Same "first week with an incomplete task" derivation as the Dashboard —
  // keep in sync with lib/queries/dashboard.ts rather than reinventing it.
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
    description: t.description,
    duration: t.duration,
    type: t.type,
    done: t.completions.length > 0,
  }));

  return {
    monthNumber: month.number,
    currentWeek,
    weekTasks,
  };
}

export type TodayData = Awaited<ReturnType<typeof getTodayData>>;
