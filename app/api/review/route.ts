import { endOfWeek, startOfWeek } from "date-fns";
import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { dateOnly } from "@/lib/date-only";

function isNonNegativeInt(n: unknown): n is number {
  return typeof n === "number" && Number.isInteger(n) && n >= 0;
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { totalMinutes, dsaSolved, wins, blockers, nextWeekFocus, rating } = body as {
    totalMinutes?: number;
    dsaSolved?: number;
    wins?: string[];
    blockers?: string[];
    nextWeekFocus?: string;
    rating?: number;
  };

  if (!isNonNegativeInt(totalMinutes)) {
    return NextResponse.json({ error: "totalMinutes must be a non-negative integer" }, { status: 400 });
  }
  if (!isNonNegativeInt(dsaSolved)) {
    return NextResponse.json({ error: "dsaSolved must be a non-negative integer" }, { status: 400 });
  }
  if (typeof rating !== "number" || !Number.isInteger(rating) || rating < 1 || rating > 5) {
    return NextResponse.json({ error: "rating must be 1-5" }, { status: 400 });
  }

  const userId = session.user.id;
  const today = new Date();
  const weekStart = dateOnly(startOfWeek(today));
  const weekEnd = dateOnly(endOfWeek(today));

  const data = {
    totalMinutes,
    dsaSolved,
    wins: wins ?? [],
    blockers: blockers ?? [],
    nextWeekFocus: nextWeekFocus?.trim() || null,
    rating,
  };

  const existing = await prisma.weeklyReview.findFirst({ where: { userId, weekStart } });

  const review = existing
    ? await prisma.weeklyReview.update({ where: { id: existing.id }, data })
    : await prisma.weeklyReview.create({ data: { userId, weekStart, weekEnd, ...data } });

  return NextResponse.json({ review });
}
