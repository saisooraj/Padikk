"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";

import { usePageHeader } from "@/lib/use-page-header";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { ReviewData } from "@/lib/queries/review";

const RATINGS = [1, 2, 3, 4, 5];

export function ReviewClient({ data }: { data: ReviewData }) {
  usePageHeader("Weekly Review", "Recurring retro");
  const router = useRouter();

  const weekLabel = `${format(data.week.start, "MMM d")} – ${format(data.week.end, "MMM d")}`;
  const defaultHours = ((data.existingReview?.totalMinutes ?? data.autoTotalMinutes) / 60).toFixed(1);
  const defaultDsaSolved = String(data.existingReview?.dsaSolved ?? data.autoDsaSolved);

  const [hours, setHours] = useState(defaultHours);
  const [dsaSolved, setDsaSolved] = useState(defaultDsaSolved);
  const [wins, setWins] = useState(data.existingReview?.wins.join("\n") ?? "");
  const [blockers, setBlockers] = useState(data.existingReview?.blockers.join("\n") ?? "");
  const [focus, setFocus] = useState(data.existingReview?.nextWeekFocus ?? "");
  const [rating, setRating] = useState(data.existingReview?.rating ?? 4);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setHours(defaultHours);
    setDsaSolved(defaultDsaSolved);
    setWins(data.existingReview?.wins.join("\n") ?? "");
    setBlockers(data.existingReview?.blockers.join("\n") ?? "");
    setFocus(data.existingReview?.nextWeekFocus ?? "");
    setRating(data.existingReview?.rating ?? 4);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.existingReview]);

  const saveReview = async () => {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          totalMinutes: Math.round((Number(hours) || 0) * 60),
          dsaSolved: Number(dsaSolved) || 0,
          wins: wins.split("\n").map((w) => w.trim()).filter(Boolean),
          blockers: blockers.split("\n").map((b) => b.trim()).filter(Boolean),
          nextWeekFocus: focus,
          rating,
        }),
      });
      if (res.ok) {
        router.refresh();
      } else {
        const body = await res.json().catch(() => ({}));
        setError(body.error ?? "Could not save review.");
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_1.3fr]">
      <Card className="p-5">
        {data.showBanner && (
          <div className="mb-3.5 rounded-lg border border-[var(--brand)] bg-[var(--surface2)] px-3.5 py-2.5 text-[12.5px] text-[var(--text)]">
            📋 Time for your weekly review. It takes 5 minutes.
          </div>
        )}
        <div className="mb-1 text-sm font-semibold text-[var(--text)]">
          {data.existingReview ? "This week's retro (submitted — edit below)" : "This week's retro"}
        </div>
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
        {error && <div className="mb-2.5 text-xs text-[var(--danger)]">{error}</div>}
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
            disabled={saving}
            className="rounded-lg bg-[var(--brand)] px-[18px] py-2 text-[13px] font-semibold text-[var(--brand-text)] disabled:opacity-60"
          >
            {saving ? "Saving…" : "Save review"}
          </button>
        </div>
      </Card>

      <div className="flex flex-col gap-2.5">
        <div className="text-sm font-semibold text-[var(--text)]">History</div>
        {data.reviews.map((review) => (
          <Card key={review.id} className="p-4">
            <div className="mb-2 flex justify-between">
              <span className="text-[13px] font-semibold text-[var(--text)]">
                {format(review.weekStart, "MMM d")} – {format(review.weekEnd, "MMM d")}
              </span>
              <span className="font-mono text-xs text-[var(--muted)]">
                {(review.totalMinutes / 60).toFixed(1)}h · {review.dsaSolved} solved · {review.rating}/5
              </span>
            </div>
            <div className="mb-1 text-[12.5px] text-[var(--muted)]">
              Wins: {review.wins.join(", ") || "—"}
            </div>
            <div className="text-[12.5px] text-[var(--muted)]">Next: {review.nextWeekFocus || "—"}</div>
          </Card>
        ))}
        {data.reviews.length === 0 && (
          <div className="text-[12.5px] text-[var(--muted)]">No reviews submitted yet.</div>
        )}
      </div>
    </div>
  );
}
