import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { startDate, currentMonth, dailyGoalMinutes, timezone, reminderEnabled, reminderTime } = body as {
    startDate?: string;
    currentMonth?: number;
    dailyGoalMinutes?: number;
    timezone?: string;
    reminderEnabled?: boolean;
    reminderTime?: string | null;
  };

  if (startDate !== undefined && Number.isNaN(new Date(startDate).getTime())) {
    return NextResponse.json({ error: "invalid startDate" }, { status: 400 });
  }
  if (
    currentMonth !== undefined &&
    (!Number.isInteger(currentMonth) || currentMonth < 1 || currentMonth > 12)
  ) {
    return NextResponse.json({ error: "currentMonth must be 1-12" }, { status: 400 });
  }
  if (
    dailyGoalMinutes !== undefined &&
    (!Number.isInteger(dailyGoalMinutes) || dailyGoalMinutes < 30 || dailyGoalMinutes > 180)
  ) {
    return NextResponse.json({ error: "dailyGoalMinutes must be 30-180" }, { status: 400 });
  }
  if (timezone !== undefined && !timezone.trim()) {
    return NextResponse.json({ error: "timezone cannot be empty" }, { status: 400 });
  }

  const userId = session.user.id;
  const data = {
    ...(startDate !== undefined ? { startDate: new Date(startDate) } : {}),
    ...(currentMonth !== undefined ? { currentMonth } : {}),
    ...(dailyGoalMinutes !== undefined ? { dailyGoalMinutes } : {}),
    ...(timezone !== undefined ? { timezone: timezone.trim() } : {}),
    ...(reminderEnabled !== undefined ? { reminderEnabled } : {}),
    ...(reminderTime !== undefined ? { reminderTime: reminderTime || null } : {}),
  };

  const settings = await prisma.userSettings.upsert({
    where: { userId },
    update: data,
    create: { userId, startDate: new Date(), currentMonth: 1, ...data },
  });

  return NextResponse.json({ settings });
}
