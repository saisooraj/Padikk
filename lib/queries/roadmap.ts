import { prisma } from "@/lib/prisma";
import { getOrCreateUserSettings } from "@/lib/queries/dashboard";

export type MonthStatus = "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED";

export async function getRoadmapData(userId: string) {
  const settings = await getOrCreateUserSettings(userId);

  const phases = await prisma.phase.findMany({ orderBy: { number: "asc" } });

  const months = await prisma.month.findMany({
    orderBy: { number: "asc" },
    include: {
      phase: true,
      project: true,
      topics: { orderBy: { order: "asc" } },
      resources: { orderBy: { priority: "asc" } },
      dailyTasks: { include: { completions: { where: { userId } } } },
    },
  });

  const monthsWithStatus = months.map((month) => {
    // Same derivation as Dashboard/Today: no stored status field, it's relative
    // to UserSettings.currentMonth. Past months are treated as complete by
    // definition (progress has moved on); the current month's progress is the
    // real completedTasks/totalTasks ratio; future months are untouched.
    const status: MonthStatus =
      month.number < settings.currentMonth
        ? "COMPLETED"
        : month.number === settings.currentMonth
          ? "IN_PROGRESS"
          : "NOT_STARTED";

    const totalTasks = month.dailyTasks.length;
    const completedTasks = month.dailyTasks.filter((t) => t.completions.length > 0).length;
    const progress =
      status === "COMPLETED"
        ? 100
        : status === "IN_PROGRESS" && totalTasks > 0
          ? Math.round((completedTasks / totalTasks) * 100)
          : 0;

    return {
      number: month.number,
      title: month.title,
      subtitle: month.subtitle,
      phase: month.phase,
      project: month.project,
      topics: month.topics,
      resources: month.resources,
      status,
      progress,
    };
  });

  return { phases, months: monthsWithStatus };
}

export type RoadmapData = Awaited<ReturnType<typeof getRoadmapData>>;
export type RoadmapMonth = RoadmapData["months"][number];
