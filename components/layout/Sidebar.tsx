"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Sun,
  Map,
  Code2,
  FolderKanban,
  BookOpen,
  BarChart2,
  Mic,
  ClipboardList,
  Settings,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { useSidebarStore } from "@/lib/store/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export type PhaseColorKey =
  | "backend"
  | "ai"
  | "cloud"
  | "dsa"
  | "sysdesign"
  | "interview";

const phaseBorderClass: Record<PhaseColorKey, string> = {
  backend: "border-backend",
  ai: "border-ai",
  cloud: "border-cloud",
  dsa: "border-dsa",
  sysdesign: "border-sysdesign",
  interview: "border-interview",
};

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/today", label: "Today", icon: Sun, dotKey: "todayNotLogged" as const },
  { href: "/roadmap", label: "Roadmap", icon: Map },
  { href: "/dsa", label: "DSA", icon: Code2, badgeKey: "dsaToReview" as const },
  { href: "/projects", label: "Projects", icon: FolderKanban },
  { href: "/notes", label: "Notes", icon: BookOpen },
  { href: "/stats", label: "Stats", icon: BarChart2 },
  { href: "/interviews", label: "Interviews", icon: Mic },
  { href: "/review", label: "Review", icon: ClipboardList, badgeKey: "reviewDue" as const },
  { href: "/settings", label: "Settings", icon: Settings },
];

interface SidebarProps {
  userName?: string;
  userImage?: string | null;
  currentPhaseColor?: PhaseColorKey;
  dsaToReviewCount?: number;
  reviewDue?: boolean;
  todayNotLogged?: boolean;
}

export function Sidebar({
  userName = "Guest",
  userImage = null,
  currentPhaseColor = "backend",
  dsaToReviewCount = 0,
  reviewDue = false,
  todayNotLogged = false,
}: SidebarProps) {
  const pathname = usePathname();
  const { collapsed, toggle } = useSidebarStore();

  const initials = userName
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <aside
      className={cn(
        "hidden md:flex h-screen shrink-0 flex-col border-r border-[var(--border)] bg-[var(--surface)] transition-all duration-200",
        collapsed ? "w-16" : "w-60"
      )}
    >
      <div className="flex h-16 items-center justify-between px-4">
        <Link href="/dashboard" className="flex items-center gap-2 overflow-hidden">
          <span className="font-space text-2xl font-bold text-[var(--ai)]">P</span>
          {!collapsed && (
            <span className="font-space text-lg font-semibold text-[var(--text)]">
              Padikk
            </span>
          )}
        </Link>
      </div>

      <nav className="flex-1 space-y-1 px-2 py-2">
        {navItems.map((item) => {
          const isActive = pathname?.startsWith(item.href);
          const Icon = item.icon;
          const badge =
            item.badgeKey === "dsaToReview" && dsaToReviewCount > 0
              ? dsaToReviewCount
              : item.badgeKey === "reviewDue" && reviewDue
              ? "!"
              : null;
          const showDot = item.dotKey === "todayNotLogged" && todayNotLogged;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group relative flex items-center gap-3 rounded-md border-l-2 border-transparent px-3 py-2 text-sm font-medium text-[var(--muted)] transition-colors hover:bg-[var(--surface2)] hover:text-[var(--text)]",
                isActive &&
                  cn(
                    "bg-[var(--surface2)] text-[var(--text)]",
                    phaseBorderClass[currentPhaseColor]
                  )
              )}
            >
              <span className="relative shrink-0">
                <Icon className="h-4 w-4" />
                {showDot && (
                  <span className="absolute -right-0.5 -top-0.5 h-1.5 w-1.5 rounded-full bg-[var(--warning)]" />
                )}
              </span>
              {!collapsed && <span className="flex-1 truncate">{item.label}</span>}
              {!collapsed && badge !== null && (
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
      </nav>

      <button
        onClick={toggle}
        className="mx-2 mb-2 flex items-center justify-center gap-2 rounded-md px-3 py-2 text-xs text-[var(--muted)] hover:bg-[var(--surface2)] hover:text-[var(--text)]"
      >
        {collapsed ? <ChevronsRight className="h-4 w-4" /> : <ChevronsLeft className="h-4 w-4" />}
      </button>

      <div className="flex items-center gap-2 border-t border-[var(--border)] px-4 py-3">
        <Avatar className="h-8 w-8">
          {userImage && <AvatarImage src={userImage} alt={userName} />}
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        {!collapsed && (
          <span className="truncate text-sm text-[var(--text)]">{userName}</span>
        )}
      </div>
    </aside>
  );
}
