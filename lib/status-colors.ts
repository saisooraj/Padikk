/**
 * Data-driven colors as CSS var() references for inline `style` (Tailwind's
 * JIT scanner can't see dynamically-built class names, so these are meant
 * for `style={{ color: dsaStatusColor(status) }}`, not className strings).
 */

export type Difficulty = "EASY" | "MEDIUM" | "HARD";

export function difficultyColor(difficulty: Difficulty): string {
  switch (difficulty) {
    case "EASY":
      return "var(--brand)";
    case "MEDIUM":
      return "var(--warn)";
    case "HARD":
      return "var(--danger)";
  }
}

export function difficultyLabel(difficulty: Difficulty): string {
  return difficulty[0] + difficulty.slice(1).toLowerCase();
}

export type ProblemStatus = "TODO" | "ATTEMPTED" | "SOLVED" | "NEEDS_REVIEW" | "OWNED";

export function dsaStatusColor(status: ProblemStatus): string {
  switch (status) {
    case "TODO":
      return "var(--muted)";
    case "ATTEMPTED":
      return "var(--warn)";
    case "SOLVED":
      return "var(--brand)";
    case "NEEDS_REVIEW":
      return "var(--danger)";
    case "OWNED":
      return "var(--brand)";
  }
}

export function dsaStatusLabel(status: ProblemStatus): string {
  switch (status) {
    case "TODO":
      return "Todo";
    case "ATTEMPTED":
      return "Attempted";
    case "SOLVED":
      return "Solved";
    case "NEEDS_REVIEW":
      return "Needs review";
    case "OWNED":
      return "Owned";
  }
}

export type ProjectStatus = "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED" | "DEPLOYED";

export function projectStatusColor(status: ProjectStatus): string {
  switch (status) {
    case "NOT_STARTED":
      return "var(--muted)";
    case "IN_PROGRESS":
      return "var(--cloud)";
    case "COMPLETED":
      return "var(--brand)";
    case "DEPLOYED":
      return "var(--sysdesign)";
  }
}

export function projectStatusLabel(status: ProjectStatus): string {
  switch (status) {
    case "NOT_STARTED":
      return "Not started";
    case "IN_PROGRESS":
      return "In progress";
    case "COMPLETED":
      return "Completed";
    case "DEPLOYED":
      return "Deployed";
  }
}

export function scoreColor(score: number, max = 5): string {
  const ratio = score / max;
  if (ratio >= 0.8) return "var(--brand)";
  if (ratio >= 0.6) return "var(--warn)";
  return "var(--danger)";
}
