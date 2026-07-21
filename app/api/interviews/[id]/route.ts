import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { INTERVIEW_TYPE_LABEL, type InterviewType } from "@/lib/interviews-data";

const INTERVIEW_TYPES = Object.keys(INTERVIEW_TYPE_LABEL) as InterviewType[];

function isValidScore(n: unknown): n is number {
  return typeof n === "number" && Number.isInteger(n) && n >= 1 && n <= 5;
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const existing = await prisma.mockInterview.findFirst({
    where: { id: params.id, userId: session.user.id },
  });
  if (!existing) {
    return NextResponse.json({ error: "Interview not found" }, { status: 404 });
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

  if (date !== undefined && Number.isNaN(new Date(date).getTime())) {
    return NextResponse.json({ error: "invalid date" }, { status: 400 });
  }
  if (platform !== undefined && !platform.trim()) {
    return NextResponse.json({ error: "platform cannot be empty" }, { status: 400 });
  }
  if (type !== undefined && !INTERVIEW_TYPES.includes(type as InterviewType)) {
    return NextResponse.json({ error: "invalid type" }, { status: 400 });
  }
  if (difficulty !== undefined && !isValidScore(difficulty)) {
    return NextResponse.json({ error: "difficulty must be 1-5" }, { status: 400 });
  }
  if (performance !== undefined && !isValidScore(performance)) {
    return NextResponse.json({ error: "performance must be 1-5" }, { status: 400 });
  }

  const interview = await prisma.mockInterview.update({
    where: { id: existing.id },
    data: {
      ...(date !== undefined ? { date: new Date(date) } : {}),
      ...(platform !== undefined ? { platform: platform.trim() } : {}),
      ...(type !== undefined ? { type: type as InterviewType } : {}),
      ...(company !== undefined ? { company: company.trim() || null } : {}),
      ...(difficulty !== undefined ? { difficulty } : {}),
      ...(performance !== undefined ? { performance } : {}),
      ...(topics !== undefined ? { topics } : {}),
      ...(feedback !== undefined ? { feedback: feedback.trim() || null } : {}),
      ...(improvements !== undefined ? { improvements: improvements.trim() || null } : {}),
    },
  });

  return NextResponse.json({ interview });
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const existing = await prisma.mockInterview.findFirst({
    where: { id: params.id, userId: session.user.id },
  });
  if (!existing) {
    return NextResponse.json({ error: "Interview not found" }, { status: 404 });
  }

  await prisma.mockInterview.delete({ where: { id: existing.id } });
  return NextResponse.json({ ok: true });
}
