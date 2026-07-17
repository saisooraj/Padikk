"use client";

import { format } from "date-fns";

import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";
import { MobileNav } from "./MobileNav";
import { usePageHeaderStore } from "@/lib/store/page-header";

interface PageShellProps {
  children: React.ReactNode;
  dsaToReviewCount?: number;
  reviewDue?: boolean;
  todayNotLogged?: boolean;
  activeMonth?: number;
  momentumDays?: number;
}

export function PageShell({
  children,
  dsaToReviewCount,
  reviewDue,
  todayNotLogged,
  activeMonth,
  momentumDays,
}: PageShellProps) {
  const title = usePageHeaderStore((state) => state.title);
  const subtitle = usePageHeaderStore((state) => state.subtitle);

  return (
    <div className="flex min-h-screen bg-[var(--bg)] text-[var(--text)]">
      <Sidebar
        dsaToReviewCount={dsaToReviewCount}
        reviewDue={reviewDue}
        todayNotLogged={todayNotLogged}
        activeMonth={activeMonth}
        momentumDays={momentumDays}
      />
      <div className="flex min-h-screen flex-1 flex-col">
        <TopBar />
        <header className="hidden items-baseline justify-between border-b border-[var(--border)] px-8 py-[22px] md:flex">
          <div>
            <div className="text-xl font-bold text-[var(--text)]">{title}</div>
            <div className="mt-0.5 text-[13px] text-[var(--muted)]">{subtitle}</div>
          </div>
          <div className="font-mono text-xs text-[var(--muted)]">
            {format(new Date(), "EEE, MMM d")}
          </div>
        </header>
        <main className="flex-1 overflow-y-auto px-4 pb-24 pt-6 md:px-8 md:pb-10 md:pt-7">
          <div className="mx-auto w-full max-w-[1100px]">{children}</div>
        </main>
        <MobileNav />
      </div>
    </div>
  );
}
