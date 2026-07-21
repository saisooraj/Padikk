import { prisma } from "@/lib/prisma";

export async function getInterviewsData(userId: string) {
  const interviews = await prisma.mockInterview.findMany({
    where: { userId },
    orderBy: { date: "desc" },
  });

  return { interviews };
}

export type InterviewsData = Awaited<ReturnType<typeof getInterviewsData>>;
export type InterviewRow = InterviewsData["interviews"][number];
