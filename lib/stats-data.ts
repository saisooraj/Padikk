import { TASK_TYPE_LABEL, TASK_TYPE_COLOR, type TaskType } from "@/lib/curriculum-data";

/**
 * Illustrative aggregates for the Stats page — these summarize DailyLog/
 * TaskCompletion history that doesn't exist yet (no persistence wired).
 * The heatmap uses a seeded PRNG (not Math.random) so server and client
 * render the same values and don't hydration-mismatch.
 */

function seededRandom(seed: number) {
  let state = seed;
  return () => {
    state = (state * 1103515245 + 12345) & 0x7fffffff;
    return state / 0x7fffffff;
  };
}

export function buildHeatmapWeeks(weeks = 20) {
  const rand = seededRandom(42);
  return Array.from({ length: weeks }, (_, w) =>
    Array.from({ length: 7 }, () => {
      const intensity = w < 3 ? rand() * 0.5 : rand();
      return Math.min(4, Math.floor(intensity * 5));
    })
  );
}

export const HEATMAP_LEVEL_OPACITY = [0.15, 0.35, 0.6, 0.8, 1];

export const HOURS_BY_TYPE: Record<TaskType, number> = {
  LEARN: 32,
  BUILD: 58,
  DSA: 18,
  REVIEW: 12,
  MOCK: 8,
  READ: 10,
};

export function hoursByTypeRows() {
  const max = Math.max(...Object.values(HOURS_BY_TYPE));
  return (Object.keys(HOURS_BY_TYPE) as TaskType[]).map((type) => ({
    type,
    label: TASK_TYPE_LABEL[type],
    colorKey: TASK_TYPE_COLOR[type],
    hours: HOURS_BY_TYPE[type],
    max,
  }));
}
