import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

type PatchBody = {
  title?: string;
  content?: string;
  tags?: string[];
  monthRef?: number | null;
  pinned?: boolean;
};

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const existing = await prisma.note.findFirst({ where: { id: params.id, userId: session.user.id } });
  if (!existing) {
    return NextResponse.json({ error: "Note not found" }, { status: 404 });
  }

  const body = (await req.json()) as PatchBody;
  const data: Record<string, unknown> = {};

  if (body.title !== undefined) {
    if (!body.title.trim()) {
      return NextResponse.json({ error: "title cannot be empty" }, { status: 400 });
    }
    data.title = body.title.trim();
  }
  if (body.content !== undefined) data.content = body.content;
  if (body.tags !== undefined) data.tags = body.tags;
  if (body.monthRef !== undefined) data.monthRef = body.monthRef;
  if (body.pinned !== undefined) data.pinned = body.pinned;

  const note = await prisma.note.update({ where: { id: existing.id }, data });
  return NextResponse.json({ note });
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const existing = await prisma.note.findFirst({ where: { id: params.id, userId: session.user.id } });
  if (!existing) {
    return NextResponse.json({ error: "Note not found" }, { status: 404 });
  }

  await prisma.note.delete({ where: { id: existing.id } });
  return NextResponse.json({ ok: true });
}
