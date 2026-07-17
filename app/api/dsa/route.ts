import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { DSA_PATTERNS } from "@/lib/dsa-data";

const DIFFICULTIES = ["EASY", "MEDIUM", "HARD"];

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { title, difficulty, pattern, leetcodeUrl, notes, monthTarget } = body as {
    title?: string;
    difficulty?: string;
    pattern?: string;
    leetcodeUrl?: string;
    notes?: string;
    monthTarget?: number;
  };

  if (!title?.trim()) {
    return NextResponse.json({ error: "title is required" }, { status: 400 });
  }
  if (!DIFFICULTIES.includes(difficulty ?? "")) {
    return NextResponse.json({ error: "invalid difficulty" }, { status: 400 });
  }
  if (!DSA_PATTERNS.includes(pattern as (typeof DSA_PATTERNS)[number])) {
    return NextResponse.json({ error: "invalid pattern" }, { status: 400 });
  }

  const problem = await prisma.dSAProblem.create({
    data: {
      userId: session.user.id,
      title: title.trim(),
      difficulty: difficulty as "EASY" | "MEDIUM" | "HARD",
      pattern: pattern as (typeof DSA_PATTERNS)[number],
      leetcodeUrl: leetcodeUrl?.trim() || null,
      notes: notes?.trim() || null,
      monthTarget: typeof monthTarget === "number" ? monthTarget : null,
    },
  });

  return NextResponse.json({ problem });
}
