import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function POST(_req: Request, { params }: { params: { taskId: string } }) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = session.user.id;
  const { taskId } = params;

  const existing = await prisma.taskCompletion.findUnique({
    where: { taskId_userId: { taskId, userId } },
  });

  if (existing) {
    await prisma.taskCompletion.delete({ where: { id: existing.id } });
    return NextResponse.json({ done: false });
  }

  const task = await prisma.dailyTask.findUnique({ where: { id: taskId } });
  if (!task) {
    return NextResponse.json({ error: "Task not found" }, { status: 404 });
  }

  await prisma.taskCompletion.create({
    data: { taskId, userId, timeSpent: task.duration },
  });
  return NextResponse.json({ done: true });
}
