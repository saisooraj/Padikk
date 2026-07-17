import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { title, content, tags, monthRef } = body as {
    title?: string;
    content?: string;
    tags?: string[];
    monthRef?: number | null;
  };

  if (!title?.trim()) {
    return NextResponse.json({ error: "title is required" }, { status: 400 });
  }

  const note = await prisma.note.create({
    data: {
      userId: session.user.id,
      title: title.trim(),
      content: content?.trim() || "",
      tags: tags ?? [],
      monthRef: typeof monthRef === "number" ? monthRef : null,
    },
  });

  return NextResponse.json({ note });
}
