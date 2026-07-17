"use client";

import Link from "next/link";

import { usePageHeaderStore } from "@/lib/store/page-header";

export function TopBar() {
  const title = usePageHeaderStore((state) => state.title);

  return (
    <header className="flex h-14 items-center justify-between border-b border-[var(--border)] bg-[var(--surface)] px-4 md:hidden">
      <Link href="/dashboard" className="flex items-center gap-2">
        <span className="h-[18px] w-[18px] shrink-0 rounded-[5px] bg-[var(--brand)]" />
        <span className="font-mono text-base font-bold text-[var(--text)]">padikk</span>
      </Link>
      <span className="truncate text-sm font-semibold text-[var(--text)]">{title}</span>
    </header>
  );
}
