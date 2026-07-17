import { differenceInCalendarDays } from "date-fns";

import { prisma } from "@/lib/prisma";
import { DSA_PATTERNS, PATTERN_LABEL, type DSAPattern } from "@/lib/dsa-data";
import type { Difficulty, ProblemStatus } from "@/lib/status-colors";

export async function getDsaData(userId: string) {
  const problems = await prisma.dSAProblem.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  const withReviewInDays = problems.map((p) => ({
    ...p,
    difficulty: p.difficulty as Difficulty,
    pattern: p.pattern as DSAPattern,
    status: p.status as ProblemStatus,
    reviewInDays: p.reviewAt ? differenceInCalendarDays(p.reviewAt, new Date()) : null,
  }));

  const stats = {
    owned: withReviewInDays.filter((p) => p.status === "OWNED").length,
    solved: withReviewInDays.filter((p) => p.status === "SOLVED").length,
    needsReview: withReviewInDays.filter((p) => p.status === "NEEDS_REVIEW").length,
    total: withReviewInDays.length,
  };

  const patternMastery = DSA_PATTERNS.map((pattern) => {
    const inPattern = withReviewInDays.filter((p) => p.pattern === pattern);
    const solved = inPattern.filter((p) => p.status === "SOLVED" || p.status === "OWNED").length;
    return { pattern, label: PATTERN_LABEL[pattern], total: inPattern.length, solved };
  }).filter((p) => p.total > 0);

  const dueForReview = withReviewInDays
    .filter(
      (p) =>
        p.reviewInDays !== null &&
        p.reviewInDays <= 0 &&
        (p.status === "NEEDS_REVIEW" || p.status === "SOLVED")
    )
    .sort((a, b) => (a.reviewInDays ?? 0) - (b.reviewInDays ?? 0));

  return { problems: withReviewInDays, stats, patternMastery, dueForReview };
}

export type DsaData = Awaited<ReturnType<typeof getDsaData>>;
export type DsaProblemRow = DsaData["problems"][number];
