import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { INTERVIEW_TYPE_LABEL, type InterviewType } from "@/lib/interviews-data";

const INTERVIEW_TYPES = Object.keys(INTERVIEW_TYPE_LABEL) as InterviewType[];

function isValidScore(n: unknown): n is number {
  return typeof n === "number" && Number.isInteger(n) && n >= 1 && n <= 5;
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { date, platform, type, company, difficulty, performance, topics, feedback, improvements } =
    body as {
      date?: string;
      platform?: string;
      type?: string;
      company?: string;
      difficulty?: number;
      performance?: number;
      topics?: string[];
      feedback?: string;
      improvements?: string;
    };

  if (!date || Number.isNaN(new Date(date).getTime())) {
    return NextResponse.json({ error: "valid date is required" }, { status: 400 });
  }
  if (!platform?.trim()) {
    return NextResponse.json({ error: "platform is required" }, { status: 400 });
  }
  if (!INTERVIEW_TYPES.includes(type as InterviewType)) {
    return NextResponse.json({ error: "invalid type" }, { status: 400 });
  }
  if (!isValidScore(difficulty)) {
    return NextResponse.json({ error: "difficulty must be 1-5" }, { status: 400 });
  }
  if (!isValidScore(performance)) {
    return NextResponse.json({ error: "performance must be 1-5" }, { status: 400 });
  }

  const interview = await prisma.mockInterview.create({
    data: {
      userId: session.user.id,
      date: new Date(date),
      platform: platform.trim(),
      type: type as InterviewType,
      company: company?.trim() || null,
      difficulty,
      performance,
      topics: topics ?? [],
      feedback: feedback?.trim() || null,
      improvements: improvements?.trim() || null,
    },
  });

  return NextResponse.json({ interview });
}
