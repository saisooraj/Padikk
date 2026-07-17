/** Illustrative sample data — MockInterview is user-logged (no seed data). */

export type InterviewType =
  | "DSA"
  | "SYSTEM_DESIGN_HLD"
  | "SYSTEM_DESIGN_LLD"
  | "BEHAVIORAL"
  | "AI_SYSTEM_DESIGN"
  | "FULL_LOOP";

export const INTERVIEW_TYPE_LABEL: Record<InterviewType, string> = {
  DSA: "DSA",
  SYSTEM_DESIGN_HLD: "System Design (HLD)",
  SYSTEM_DESIGN_LLD: "System Design (LLD)",
  BEHAVIORAL: "Behavioral",
  AI_SYSTEM_DESIGN: "AI System Design",
  FULL_LOOP: "Full Loop",
};

export interface InterviewEntry {
  id: string;
  date: string;
  platform: string;
  type: InterviewType;
  company: string;
  difficulty: number;
  performance: number;
  topics: string[];
  feedback: string;
}

export const INTERVIEWS: InterviewEntry[] = [
  {
    id: "i1",
    date: "2026-07-10",
    platform: "Pramp",
    type: "DSA",
    company: "Practice",
    difficulty: 3,
    performance: 4,
    topics: ["sliding window"],
    feedback: "Clean solution, slightly slow to state complexity upfront.",
  },
  {
    id: "i2",
    date: "2026-06-28",
    platform: "Self (Claude)",
    type: "SYSTEM_DESIGN_HLD",
    company: "Practice",
    difficulty: 4,
    performance: 3,
    topics: ["caching", "sharding"],
    feedback: "Good breadth, needs more depth on failure modes.",
  },
  {
    id: "i3",
    date: "2026-06-15",
    platform: "interviewing.io",
    type: "BEHAVIORAL",
    company: "Practice",
    difficulty: 2,
    performance: 4,
    topics: ["conflict story"],
    feedback: "Strong STAR structure, tighten up the ending.",
  },
  {
    id: "i4",
    date: "2026-05-30",
    platform: "Pramp",
    type: "DSA",
    company: "Practice",
    difficulty: 3,
    performance: 3,
    topics: ["graphs"],
    feedback: "Got there, but topological sort took two attempts to set up.",
  },
  {
    id: "i5",
    date: "2026-05-12",
    platform: "Self (Claude)",
    type: "AI_SYSTEM_DESIGN",
    company: "Practice",
    difficulty: 4,
    performance: 3,
    topics: ["RAG design"],
    feedback: "Solid instincts on retrieval, weak on eval strategy.",
  },
];
