/** Illustrative sample history — WeeklyReview is user-submitted (no seed data). */

export interface WeeklyReviewEntry {
  id: string;
  weekOf: string;
  totalMinutes: number;
  dsaSolved: number;
  wins: string[];
  blockers: string[];
  nextWeekFocus: string;
  rating: number;
}

export const WEEKLY_REVIEWS: WeeklyReviewEntry[] = [
  {
    id: "w1",
    weekOf: "Jul 6 – Jul 12",
    totalMinutes: 420,
    dsaSolved: 0,
    wins: ["Shipped async utility scripts", "Kept a daily streak all week"],
    blockers: ["Underestimated how long FastAPI DI patterns take to click"],
    nextWeekFocus: "Finish week 2 tasks, start SQLAlchemy + JWT auth",
    rating: 4,
  },
  {
    id: "w2",
    weekOf: "Jun 29 – Jul 5",
    totalMinutes: 260,
    dsaSolved: 0,
    wins: ["Set up the dev environment cleanly", "First async/await scripts working"],
    blockers: ["Lost a day to Docker/Postgres setup issues"],
    nextWeekFocus: "Get a full week of consistent daily sessions in",
    rating: 3,
  },
];
