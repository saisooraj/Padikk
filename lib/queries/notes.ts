import { prisma } from "@/lib/prisma";

export async function getNotesData(userId: string) {
  const notes = await prisma.note.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
  });

  return { notes };
}

export type NotesData = Awaited<ReturnType<typeof getNotesData>>;
export type NoteRow = NotesData["notes"][number];
