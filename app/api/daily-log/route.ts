import { differenceInCalendarDays } from "date-fns";
import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { dateOnly } from "@/lib/date-only";
import { parseDurationToMinutes } from "@/lib/parse-duration";
import { getOrCreateStreak, getOrCreateUserSettings } from "@/lib/queries/dashboard";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = session.user.id;

  const body = await req.json();
  const { timeText, mood, summary } = body as {
    timeText?: string;
    mood?: number;
    summary?: string;
  };

  if (typeof mood !== "number" || mood < 1 || mood > 5) {
    return NextResponse.json({ error: "mood must be between 1 and 5" }, { status: 400 });
  }

  const totalTime = parseDurationToMinutes(timeText ?? "");
  const settings = await getOrCreateUserSettings(userId);
  const month = await prisma.month.findUniqueOrThrow({ where: { number: settings.currentMonth } });
  const today = dateOnly();

  const existingLog = await prisma.dailyLog.findUnique({
    where: { userId_date: { userId, date: today } },
  });

  await prisma.dailyLog.upsert({
    where: { userId_date: { userId, date: today } },
    update: { totalTime, mood, summary: summary || null, monthId: month.id },
    create: { userId, monthId: month.id, date: today, totalTime, mood, summary: summary || null },
  });

  const streak = await getOrCreateStreak(userId);
  const isNewDay = !existingLog;

  let currentStreak = streak.currentStreak;
  if (isNewDay) {
    currentStreak = !streak.lastActiveDate
      ? 1
      : differenceInCalendarDays(today, streak.lastActiveDate) === 1
        ? streak.currentStreak + 1
        : 1;
  }

  await prisma.streak.update({
    where: { userId },
    data: {
      currentStreak,
      longestStreak: Math.max(streak.longestStreak, currentStreak),
      lastActiveDate: today,
      totalDaysLogged: isNewDay ? streak.totalDaysLogged + 1 : streak.totalDaysLogged,
    },
  });

  return NextResponse.json({ ok: true });
}
