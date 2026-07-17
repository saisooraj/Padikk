import type { Difficulty, ProblemStatus } from "@/lib/status-colors";

/**
 * Illustrative sample data for the DSA tracker shell — DSAProblem is
 * user-created (not seeded), so there's no real data yet. Field names/enum
 * values match the Prisma schema so wiring real queries in later is a
 * drop-in.
 */

export type DSAPattern =
  | "ARRAYS_STRINGS"
  | "HASH_MAPS"
  | "TWO_POINTERS"
  | "SLIDING_WINDOW"
  | "BINARY_SEARCH"
  | "LINKED_LISTS"
  | "STACKS_QUEUES"
  | "BINARY_TREES"
  | "BST"
  | "GRAPHS"
  | "TOPOLOGICAL_SORT"
  | "HEAPS"
  | "GREEDY"
  | "DP_BASIC"
  | "DP_ADVANCED"
  | "BACKTRACKING"
  | "SHORTEST_PATH"
  | "UNION_FIND"
  | "TRIES"
  | "BIT_MANIPULATION"
  | "OTHER";

export const DSA_PATTERNS: DSAPattern[] = [
  "ARRAYS_STRINGS",
  "HASH_MAPS",
  "TWO_POINTERS",
  "SLIDING_WINDOW",
  "BINARY_SEARCH",
  "LINKED_LISTS",
  "STACKS_QUEUES",
  "BINARY_TREES",
  "BST",
  "GRAPHS",
  "TOPOLOGICAL_SORT",
  "HEAPS",
  "GREEDY",
  "DP_BASIC",
  "DP_ADVANCED",
  "BACKTRACKING",
  "SHORTEST_PATH",
  "UNION_FIND",
  "TRIES",
  "BIT_MANIPULATION",
  "OTHER",
];

export const PATTERN_LABEL: Record<DSAPattern, string> = {
  ARRAYS_STRINGS: "Arrays & Strings",
  HASH_MAPS: "Hash Maps",
  TWO_POINTERS: "Two Pointers",
  SLIDING_WINDOW: "Sliding Window",
  BINARY_SEARCH: "Binary Search",
  LINKED_LISTS: "Linked Lists",
  STACKS_QUEUES: "Stacks & Queues",
  BINARY_TREES: "Binary Trees",
  BST: "BST",
  GRAPHS: "Graphs",
  TOPOLOGICAL_SORT: "Topological Sort",
  HEAPS: "Heaps",
  GREEDY: "Greedy",
  DP_BASIC: "DP (Basic)",
  DP_ADVANCED: "DP (Advanced)",
  BACKTRACKING: "Backtracking",
  SHORTEST_PATH: "Shortest Path",
  UNION_FIND: "Union Find",
  TRIES: "Tries",
  BIT_MANIPULATION: "Bit Manipulation",
  OTHER: "Other",
};

export interface DsaProblem {
  id: string;
  title: string;
  leetcodeUrl?: string;
  difficulty: Difficulty;
  pattern: DSAPattern;
  status: ProblemStatus;
  attempts: number;
  timeSpent: number | null;
  /** Days from today (negative = overdue, 0 = due today, null = no review scheduled). */
  reviewInDays: number | null;
  notes: string;
  monthTarget: number | null;
}

export const DSA_PROBLEMS: DsaProblem[] = [
  { id: "p1", title: "Two Sum", difficulty: "EASY", pattern: "HASH_MAPS", status: "OWNED", attempts: 3, timeSpent: 25, reviewInDays: 12, notes: "Solved with a hashmap in O(n). Revisit the two-pointer variant on sorted input.", monthTarget: 8 },
  { id: "p2", title: "Longest Substring Without Repeating Characters", difficulty: "MEDIUM", pattern: "SLIDING_WINDOW", status: "SOLVED", attempts: 2, timeSpent: 35, reviewInDays: 2, notes: "Sliding window with a char-index map. Clean on the second attempt.", monthTarget: 8 },
  { id: "p3", title: "Search in Rotated Sorted Array", difficulty: "MEDIUM", pattern: "BINARY_SEARCH", status: "NEEDS_REVIEW", attempts: 4, timeSpent: 55, reviewInDays: -1, notes: "Kept messing up the pivot condition — needs another pass.", monthTarget: 8 },
  { id: "p4", title: "Course Schedule", difficulty: "MEDIUM", pattern: "GRAPHS", status: "ATTEMPTED", attempts: 1, timeSpent: 40, reviewInDays: 0, notes: "Topological sort via BFS — got stuck on cycle detection.", monthTarget: 9 },
  { id: "p5", title: "Coin Change", difficulty: "MEDIUM", pattern: "DP_BASIC", status: "SOLVED", attempts: 2, timeSpent: 45, reviewInDays: 6, notes: "Bottom-up DP, O(amount × coins). Comfortable now.", monthTarget: 9 },
  { id: "p6", title: "Word Search", difficulty: "MEDIUM", pattern: "BACKTRACKING", status: "ATTEMPTED", attempts: 1, timeSpent: 30, reviewInDays: 1, notes: "DFS + backtrack, needs cleanup on visited-cell handling.", monthTarget: 10 },
  { id: "p7", title: "Merge Intervals", difficulty: "MEDIUM", pattern: "ARRAYS_STRINGS", status: "OWNED", attempts: 2, timeSpent: 20, reviewInDays: 20, notes: "Sort + merge, very comfortable, can teach this one.", monthTarget: 8 },
  { id: "p8", title: "Median of Two Sorted Arrays", difficulty: "HARD", pattern: "BINARY_SEARCH", status: "TODO", attempts: 0, timeSpent: null, reviewInDays: null, notes: "", monthTarget: 10 },
  { id: "p9", title: "LRU Cache", difficulty: "MEDIUM", pattern: "LINKED_LISTS", status: "SOLVED", attempts: 1, timeSpent: 50, reviewInDays: 5, notes: "Doubly linked list + hashmap. First-attempt solve.", monthTarget: 8 },
  { id: "p10", title: "Trapping Rain Water", difficulty: "HARD", pattern: "TWO_POINTERS", status: "NEEDS_REVIEW", attempts: 3, timeSpent: 65, reviewInDays: -2, notes: "Two-pointer approach clicked eventually — redo cold.", monthTarget: 10 },
  { id: "p11", title: "Number of Islands", difficulty: "MEDIUM", pattern: "GRAPHS", status: "OWNED", attempts: 2, timeSpent: 25, reviewInDays: 15, notes: "Standard grid DFS, no issues.", monthTarget: 9 },
  { id: "p12", title: "Top K Frequent Elements", difficulty: "MEDIUM", pattern: "HEAPS", status: "ATTEMPTED", attempts: 1, timeSpent: 35, reviewInDays: 3, notes: "Bucket-sort approach half-done — revisit the heap solution too.", monthTarget: 9 },
];

export function difficultyDistribution() {
  return (["EASY", "MEDIUM", "HARD"] as const).map((difficulty) => {
    const inPattern = DSA_PROBLEMS.filter((p) => p.difficulty === difficulty);
    const solved = inPattern.filter((p) => p.status === "SOLVED" || p.status === "OWNED").length;
    return { difficulty, solved, total: inPattern.length };
  });
}
