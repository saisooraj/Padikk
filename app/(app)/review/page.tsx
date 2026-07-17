"use client";

import { useState } from "react";
import { endOfWeek, format, startOfWeek } from "date-fns";

import { usePageHeader } from "@/lib/use-page-header";
import { WEEKLY_REVIEWS, type WeeklyReviewEntry } from "@/lib/weekly-review-data";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const RATINGS = [1, 2, 3, 4, 5];

export default function WeeklyReviewPage() {
  usePageHeader("Weekly Review", "Recurring retro");

  const today = new Date();
  const weekLabel = `${format(startOfWeek(today), "MMM d")} – ${format(endOfWeek(today), "MMM d")}`;

  const [reviews, setReviews] = useState(WEEKLY_REVIEWS);
  const [hours, setHours] = useState("");
  const [dsaSolved, setDsaSolved] = useState("");
  const [wins, setWins] = useState("");
  const [blockers, setBlockers] = useState("");
  const [focus, setFocus] = useState("");
  const [rating, setRating] = useState(4);

  const saveReview = () => {
    if (!hours) return;
    const entry: WeeklyReviewEntry = {
      id: `w-${Date.now()}`,
      weekOf: weekLabel,
      totalMinutes: Math.round(Number(hours) * 60) || 0,
      dsaSolved: Number(dsaSolved) || 0,
      wins: wins.split("\n").filter(Boolean),
      blockers: blockers.split("\n").filter(Boolean),
      nextWeekFocus: focus || "—",
      rating,
    };
    setReviews((prev) => [entry, ...prev]);
    setHours("");
    setDsaSolved("");
    setWins("");
    setBlockers("");
    setFocus("");
  };

  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_1.3fr]">
      <Card className="p-5">
        <div className="mb-1 text-sm font-semibold text-[var(--text)]">This week&apos;s retro</div>
        <div className="mb-3.5 font-mono text-xs text-[var(--muted)]">{weekLabel}</div>
        <div className="mb-3 grid grid-cols-2 gap-2.5">
          <input
            value={hours}
            onChange={(e) => setHours(e.target.value)}
            placeholder="Hours logged"
            className="rounded-lg border border-[var(--border)] bg-[var(--surface2)] px-3 py-2 text-[13px] text-[var(--text)] placeholder:text-[var(--muted)]"
          />
          <input
            value={dsaSolved}
            onChange={(e) => setDsaSolved(e.target.value)}
            placeholder="DSA solved"
            className="rounded-lg border border-[var(--border)] bg-[var(--surface2)] px-3 py-2 text-[13px] text-[var(--text)] placeholder:text-[var(--muted)]"
          />
        </div>
        <textarea
          value={wins}
          onChange={(e) => setWins(e.target.value)}
          placeholder="Wins this week (one per line)"
          className="mb-2.5 min-h-[56px] w-full resize-y rounded-lg border border-[var(--border)] bg-[var(--surface2)] px-3 py-2.5 text-[13px] text-[var(--text)] placeholder:text-[var(--muted)]"
        />
        <textarea
          value={blockers}
          onChange={(e) => setBlockers(e.target.value)}
          placeholder="Blockers (one per line)"
          className="mb-2.5 min-h-[56px] w-full resize-y rounded-lg border border-[var(--border)] bg-[var(--surface2)] px-3 py-2.5 text-[13px] text-[var(--text)] placeholder:text-[var(--muted)]"
        />
        <textarea
          value={focus}
          onChange={(e) => setFocus(e.target.value)}
          placeholder="Focus for next week"
          className="mb-[18px] min-h-[56px] w-full resize-y rounded-lg border border-[var(--border)] bg-[var(--surface2)] px-3 py-2.5 text-[13px] text-[var(--text)] placeholder:text-[var(--muted)]"
        />
        <div className="flex items-center justify-between">
          <div className="flex gap-1.5">
            {RATINGS.map((r) => (
              <button
                key={r}
                onClick={() => setRating(r)}
                className={cn(
                  "flex h-7 w-7 items-center justify-center rounded-lg text-xs font-semibold",
                  rating === r ? "bg-[var(--brand)] text-[var(--brand-text)]" : "bg-[var(--surface2)] text-[var(--muted)]"
                )}
              >
                {r}
              </button>
            ))}
          </div>
          <button
            onClick={saveReview}
            className="rounded-lg bg-[var(--brand)] px-[18px] py-2 text-[13px] font-semibold text-[var(--brand-text)]"
          >
            Save review
          </button>
        </div>
      </Card>

      <div className="flex flex-col gap-2.5">
        <div className="text-sm font-semibold text-[var(--text)]">History</div>
        {reviews.map((review) => (
          <Card key={review.id} className="p-4">
            <div className="mb-2 flex justify-between">
              <span className="text-[13px] font-semibold text-[var(--text)]">{review.weekOf}</span>
              <span className="font-mono text-xs text-[var(--muted)]">
                {(review.totalMinutes / 60).toFixed(1)}h · {review.dsaSolved} solved · {review.rating}/5
              </span>
            </div>
            <div className="mb-1 text-[12.5px] text-[var(--muted)]">
              Wins: {review.wins.join(", ") || "—"}
            </div>
            <div className="text-[12.5px] text-[var(--muted)]">Next: {review.nextWeekFocus}</div>
          </Card>
        ))}
        {reviews.length === 0 && (
          <div className="text-[12.5px] text-[var(--muted)]">No reviews submitted yet.</div>
        )}
      </div>
    </div>
  );
}
