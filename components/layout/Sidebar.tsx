"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { useThemeStore } from "@/lib/store/theme";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";

const NAV_GROUPS = [
  {
    label: "Daily",
    items: [
      { href: "/dashboard", label: "Dashboard" },
      { href: "/today", label: "Today", dotKey: "todayNotLogged" as const },
    ],
  },
  {
    label: "Curriculum",
    items: [
      { href: "/roadmap", label: "Roadmap" },
      { href: "/dsa", label: "DSA Tracker", badgeKey: "dsaToReview" as const },
      { href: "/projects", label: "Projects" },
    ],
  },
  {
    label: "Reflect",
    items: [
      { href: "/notes", label: "Notes" },
      { href: "/stats", label: "Stats" },
      { href: "/interviews", label: "Interviews" },
      { href: "/review", label: "Weekly Review", badgeKey: "reviewDue" as const },
    ],
  },
  {
    label: "System",
    items: [{ href: "/settings", label: "Settings" }],
  },
];

interface SidebarProps {
  dsaToReviewCount?: number;
  reviewDue?: boolean;
  todayNotLogged?: boolean;
  activeMonth?: number;
  momentumDays?: number;
}

export function Sidebar({
  dsaToReviewCount = 0,
  reviewDue = false,
  todayNotLogged = false,
  activeMonth = 1,
  momentumDays = 0,
}: SidebarProps) {
  const pathname = usePathname();
  const theme = useThemeStore((state) => state.theme);
  const toggleTheme = useThemeStore((state) => state.toggle);
  const isDark = theme === "dark";

  return (
    <aside className="hidden h-screen w-[236px] shrink-0 flex-col gap-[22px] border-r border-[var(--border)] bg-[var(--surface)] px-[14px] py-5 md:flex">
      <Link href="/dashboard" className="flex items-center gap-[9px] px-2 pb-2.5 pt-1">
        <span className="h-[22px] w-[22px] shrink-0 rounded-[6px] bg-[var(--brand)]" />
        <span className="flex flex-col">
          <span className="font-mono text-[15px] font-bold tracking-wide text-[var(--text)]">
            padikk
          </span>
          <span className="text-[10px] uppercase tracking-wider text-[var(--muted)]">
            Learning OS
          </span>
        </span>
      </Link>

      <nav className="flex flex-1 flex-col gap-[22px] overflow-y-auto">
        {NAV_GROUPS.map((group) => (
          <div key={group.label} className="flex flex-col gap-0.5">
            <div className="px-2.5 pb-1.5 text-[10.5px] font-semibold uppercase tracking-wider text-[var(--muted)]">
              {group.label}
            </div>
            {group.items.map((item) => {
              const isActive = pathname?.startsWith(item.href) ?? false;
              const badge =
                "badgeKey" in item &&
                item.badgeKey === "dsaToReview" &&
                dsaToReviewCount > 0
                  ? dsaToReviewCount
                  : "badgeKey" in item && item.badgeKey === "reviewDue" && reviewDue
                  ? "!"
                  : null;
              const showDot = "dotKey" in item && item.dotKey === "todayNotLogged" && todayNotLogged;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13.5px] transition-colors hover:bg-[var(--surface2)]",
                    isActive
                      ? "bg-[var(--surface2)] font-semibold text-[var(--text)]"
                      : "font-medium text-[var(--muted)]"
                  )}
                >
                  <span
                    className={cn(
                      "h-[5px] w-[5px] shrink-0 rounded-full",
                      isActive ? "bg-[var(--brand)]" : "bg-[var(--muted)]"
                    )}
                  />
                  <span className="relative flex-1 truncate">
                    {item.label}
                    {showDot && (
                      <span className="absolute -right-2.5 top-0.5 h-1.5 w-1.5 rounded-full bg-[var(--warn)]" />
                    )}
                  </span>
                  {badge !== null && (
                    <Badge
                      variant="outline"
                      className="h-5 shrink-0 border-[var(--border)] px-1.5 text-[10px] text-[var(--muted)]"
                    >
                      {badge}
                    </Badge>
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      <div className="mt-auto flex flex-col gap-2.5">
        <div className="flex items-center justify-between rounded-[10px] border border-[var(--border)] p-2.5">
          <span className="text-xs text-[var(--muted)]">
            {isDark ? "Dark mode" : "Light mode"}
          </span>
          <Switch checked={isDark} onCheckedChange={toggleTheme} aria-label="Toggle theme" />
        </div>
        <div className="px-1 font-mono text-[11px] text-[var(--muted)]">
          Month {activeMonth} of 12 · {momentumDays}d active
        </div>
      </div>
    </aside>
  );
}
