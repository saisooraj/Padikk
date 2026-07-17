/** Illustrative sample notes — Note is user-authored (no seed data). */

export interface NoteEntry {
  id: string;
  title: string;
  body: string;
  tags: string[];
  monthRef: number | null;
  pinned: boolean;
  updated: string;
}

export const NOTES: NoteEntry[] = [
  {
    id: "n1",
    title: "asyncio: when to actually reach for it",
    body: "Not every I/O-bound function needs async — the win shows up under concurrent load, not single calls. Rule of thumb for month 1: if a FastAPI route awaits a DB call or an external API, make the route async and use an async driver end-to-end. Mixing sync blocking calls inside an async route defeats the point (blocks the event loop for everyone).\n\nNext: profile the IZBA Health Score API's slowest endpoint before assuming async will help.",
    tags: ["python", "month-1"],
    monthRef: 1,
    pinned: true,
    updated: "2 days ago",
  },
  {
    id: "n2",
    title: "Pydantic v2 validators vs. FastAPI dependencies",
    body: "Field-level validation (shape of the data) belongs in the Pydantic model. Anything that needs the DB (uniqueness checks, auth lookups) belongs in a FastAPI dependency, not a validator — validators shouldn't do I/O. Keeps the model reusable outside the request/response cycle.",
    tags: ["python", "fastapi", "month-1"],
    monthRef: 1,
    pinned: true,
    updated: "3 days ago",
  },
  {
    id: "n3",
    title: "JWT refresh tokens: rotation gotcha",
    body: "If refresh tokens aren't rotated on use, a leaked refresh token is valid forever until expiry. Rotating on every use (and revoking the old one) is more work but closes that hole. Worth doing properly on the IZBA API since it's the auth pattern every later project reuses.",
    tags: ["auth", "month-1"],
    monthRef: 1,
    pinned: false,
    updated: "5 days ago",
  },
  {
    id: "n4",
    title: "Celery task idempotency",
    body: "Celery's at-least-once delivery means a task can run twice. Email Intelligence Service tasks need to be idempotent — e.g. keying processed-email records by message-id so a redelivered task is a no-op rather than a duplicate summary.",
    tags: ["backend", "month-2"],
    monthRef: 2,
    pinned: false,
    updated: "1 week ago",
  },
  {
    id: "n5",
    title: "Streaming vs. batching for the chat app",
    body: "Token-by-token streaming feels dramatically faster even when total completion time is the same — worth doing even for short responses. Watch for a small client-side buffer to avoid layout jank when tokens arrive faster than the UI can paint.",
    tags: ["ai", "month-3"],
    monthRef: 3,
    pinned: false,
    updated: "2 weeks ago",
  },
  {
    id: "n6",
    title: "Chunking strategy notes (before month 4 starts)",
    body: "Fixed-size chunking is the easy default but splits mid-thought constantly. Worth trying semantic/paragraph-aware chunking with overlap once the RAG month starts — flagging here so it's not forgotten.",
    tags: ["ai", "month-4", "prep"],
    monthRef: 4,
    pinned: false,
    updated: "3 weeks ago",
  },
];
