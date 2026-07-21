"use client";

import { useEffect } from "react";

export default function AppError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-6 py-16 text-center">
      <div className="text-[15px] font-semibold text-[var(--text)]">Something went wrong.</div>
      <div className="max-w-sm text-[13px] text-[var(--muted)]">
        This page hit an unexpected error. Try again, or head back to the dashboard.
      </div>
      <div className="mt-2 flex gap-2.5">
        <button
          onClick={reset}
          className="rounded-lg bg-[var(--brand)] px-3.5 py-2 text-[13px] font-semibold text-[var(--brand-text)]"
        >
          Try again
        </button>
        <a
          href="/dashboard"
          className="rounded-lg border border-[var(--border)] px-3.5 py-2 text-[13px] text-[var(--text)] hover:bg-[var(--surface2)]"
        >
          Back to dashboard
        </a>
      </div>
    </div>
  );
}
