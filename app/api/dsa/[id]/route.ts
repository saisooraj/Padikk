import { addDays } from "date-fns";
import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const STATUSES = ["TODO", "ATTEMPTED", "SOLVED", "NEEDS_REVIEW", "OWNED"];

type PatchBody =
  | { action: "setStatus"; status: string }
  | { action: "reviewDone" }
  | { action: "markOwned" }
  | { action: "markNeedsReview" }
  | {
      action: "updateFields";
      notes?: string;
      leetcodeUrl?: string;
      tags?: string[];
      monthTarget?: number | null;
      timeSpent?: number | null;
    };

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = session.user.id;

  const existing = await prisma.dSAProblem.findFirst({ where: { id: params.id, userId } });
  if (!existing) {
    return NextResponse.json({ error: "Problem not found" }, { status: 404 });
  }

  const body = (await req.json()) as PatchBody;
  const now = new Date();

  // Spaced-repetition scheduling, simplified from the original spec: the first
  // SOLVED marks reviewAt = +3d; each subsequent "review done" click advances
  // the schedule (+7d, then +14d, then clears reviewAt and promotes to OWNED —
  // review count tracked via `attempts`, matching the spec's intent). "Mark as
  // Owned" / "Needs review" are manual overrides that don't touch this ladder.
  if (body.action === "setStatus") {
    if (!STATUSES.includes(body.status)) {
      return NextResponse.json({ error: "invalid status" }, { status: 400 });
    }
    const data: Record<string, unknown> = { status: body.status };
    if (body.status === "SOLVED" && !existing.solvedAt) {
      data.solvedAt = now;
      data.reviewAt = addDays(now, 3);
    }
    if (body.status === "OWNED") {
      data.reviewAt = null;
    }
    if (body.status === "NEEDS_REVIEW" && !existing.reviewAt) {
      data.reviewAt = now;
    }
    const problem = await prisma.dSAProblem.update({ where: { id: existing.id }, data });
    return NextResponse.json({ problem });
  }

  if (body.action === "reviewDone") {
    const attempts = existing.attempts + 1;
    const data: Record<string, unknown> = { attempts };
    if (attempts === 1) data.reviewAt = addDays(now, 7);
    else if (attempts === 2) data.reviewAt = addDays(now, 14);
    else {
      data.reviewAt = null;
      data.status = "OWNED";
    }
    const problem = await prisma.dSAProblem.update({ where: { id: existing.id }, data });
    return NextResponse.json({ problem });
  }

  if (body.action === "markOwned") {
    const problem = await prisma.dSAProblem.update({
      where: { id: existing.id },
      data: { status: "OWNED", reviewAt: null },
    });
    return NextResponse.json({ problem });
  }

  if (body.action === "markNeedsReview") {
    const problem = await prisma.dSAProblem.update({
      where: { id: existing.id },
      data: { status: "NEEDS_REVIEW", reviewAt: now },
    });
    return NextResponse.json({ problem });
  }

  if (body.action === "updateFields") {
    const { notes, leetcodeUrl, tags, monthTarget, timeSpent } = body;
    const problem = await prisma.dSAProblem.update({
      where: { id: existing.id },
      data: {
        ...(notes !== undefined ? { notes: notes.trim() || null } : {}),
        ...(leetcodeUrl !== undefined ? { leetcodeUrl: leetcodeUrl.trim() || null } : {}),
        ...(tags !== undefined ? { tags } : {}),
        ...(monthTarget !== undefined ? { monthTarget } : {}),
        ...(timeSpent !== undefined ? { timeSpent } : {}),
      },
    });
    return NextResponse.json({ problem });
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const existing = await prisma.dSAProblem.findFirst({
    where: { id: params.id, userId: session.user.id },
  });
  if (!existing) {
    return NextResponse.json({ error: "Problem not found" }, { status: 404 });
  }

  await prisma.dSAProblem.delete({ where: { id: existing.id } });
  return NextResponse.json({ ok: true });
}
