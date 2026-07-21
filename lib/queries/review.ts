import { addDays, endOfWeek, isSunday, startOfWeek } from "date-fns";

import { prisma } from "@/lib/prisma";
import { dateOnly } from "@/lib/date-only";

/**
 * Week range matches the old static shell's date-fns defaults (Sun–Sat,
 * `weekStartsOn: 0`) — wiring reuses this rather than reinterpreting it, even
 * though it means the "current week" on a Sunday is the week just starting,
 * not the one that just ended. Not changing this scope during wiring.
 */
export async function getReviewData(userId: string) {
  const today = new Date();
  const weekStart = dateOnly(startOfWeek(today));
  const weekEnd = dateOnly(endOfWeek(today));
  const weekEndExclusive = addDays(weekStart, 7);

  const [reviews, logs, dsaSolvedThisWeek, existingReview] = await Promise.all([
    prisma.weeklyReview.findMany({ where: { userId }, orderBy: { weekStart: "desc" } }),
    prisma.dailyLog.findMany({
      where: { userId, date: { gte: weekStart, lt: weekEndExclusive } },
      select: { totalTime: true },
    }),
    prisma.dSAProblem.count({
      where: { userId, solvedAt: { gte: weekStart, lt: weekEndExclusive } },
    }),
    prisma.weeklyReview.findFirst({ where: { userId, weekStart } }),
  ]);

  const autoTotalMinutes = logs.reduce((sum, l) => sum + l.totalTime, 0);

  return {
    reviews,
    week: { start: weekStart, end: weekEnd },
    autoTotalMinutes,
    autoDsaSolved: dsaSolvedThisWeek,
    existingReview,
    showBanner: isSunday(today) && !existingReview,
  };
}

export type ReviewData = Awaited<ReturnType<typeof getReviewData>>;
