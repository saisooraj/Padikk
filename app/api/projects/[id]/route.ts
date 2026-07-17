import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const STATUSES = ["NOT_STARTED", "IN_PROGRESS", "COMPLETED", "DEPLOYED"];

type PatchBody = {
  status?: string;
  githubUrl?: string;
  liveUrl?: string;
  techStack?: string[];
  notes?: string;
};

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const existing = await prisma.project.findFirst({ where: { id: params.id, userId: session.user.id } });
  if (!existing) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  const body = (await req.json()) as PatchBody;
  const data: Record<string, unknown> = {};

  if (body.status !== undefined) {
    if (!STATUSES.includes(body.status)) {
      return NextResponse.json({ error: "invalid status" }, { status: 400 });
    }
    data.status = body.status;
    // Auto-stamp start/completion on transition, same as DSA's solvedAt — only
    // when the field isn't already set, so it never clobbers a manual value.
    if (body.status === "IN_PROGRESS" && !existing.startedAt) {
      data.startedAt = new Date();
    }
    if ((body.status === "COMPLETED" || body.status === "DEPLOYED") && !existing.completedAt) {
      data.completedAt = new Date();
      if (!existing.startedAt) data.startedAt = new Date();
    }
  }
  if (body.githubUrl !== undefined) data.githubUrl = body.githubUrl.trim() || null;
  if (body.liveUrl !== undefined) data.liveUrl = body.liveUrl.trim() || null;
  if (body.techStack !== undefined) data.techStack = body.techStack;
  if (body.notes !== undefined) data.notes = body.notes.trim() || null;

  const project = await prisma.project.update({ where: { id: existing.id }, data });
  return NextResponse.json({ project });
}
