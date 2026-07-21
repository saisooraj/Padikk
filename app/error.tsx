"use client";

import { useEffect } from "react";

export default function RootError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-[var(--bg)] px-6 text-center text-[var(--text)]">
      <div className="text-[15px] font-semibold">Something went wrong.</div>
      <div className="max-w-sm text-[13px] text-[var(--muted)]">
        Padikk hit an unexpected error. Try again, or reload the page.
      </div>
      <button
        onClick={reset}
        className="mt-2 rounded-lg bg-[var(--brand)] px-3.5 py-2 text-[13px] font-semibold text-[var(--brand-text)]"
      >
        Try again
      </button>
    </div>
  );
}
