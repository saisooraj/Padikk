import { prisma } from "@/lib/prisma";

/**
 * Project rows are per-user and lazily created from the seeded MonthProject
 * catalog (one per month, 12 total) the same way UserSettings/Streak are
 * lazily upserted — there's no onboarding flow that creates them up front.
 * Name/description/techStack start as a copy of the curriculum's MonthProject
 * but are independently editable per user from there (status, URLs, notes).
 */
export async function getOrCreateProjects(userId: string) {
  const monthProjects = await prisma.monthProject.findMany({
    include: { month: { include: { phase: true } } },
    orderBy: { month: { number: "asc" } },
  });

  const existing = await prisma.project.findMany({ where: { userId } });
  const existingMonths = new Set(existing.map((p) => p.monthNumber));

  const missing = monthProjects.filter((mp) => !existingMonths.has(mp.month.number));
  if (missing.length > 0) {
    await prisma.project.createMany({
      data: missing.map((mp) => ({
        userId,
        monthNumber: mp.month.number,
        name: mp.name,
        description: mp.description,
        techStack: mp.techStack,
      })),
    });
  }

  const projects = missing.length > 0 ? await prisma.project.findMany({ where: { userId } }) : existing;
  const projectsByMonth = new Map(projects.map((p) => [p.monthNumber, p]));

  return monthProjects.map((mp) => ({
    ...projectsByMonth.get(mp.month.number)!,
    monthTitle: mp.month.title,
    phase: mp.month.phase,
  }));
}

export type ProjectsData = Awaited<ReturnType<typeof getOrCreateProjects>>;
export type ProjectRow = ProjectsData[number];
