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
} from "lucide-react";

import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/today", label: "Today", icon: Sun },
  { href: "/roadmap", label: "Roadmap", icon: Map },
  { href: "/dsa", label: "DSA", icon: Code2 },
  { href: "/projects", label: "Projects", icon: FolderKanban },
  { href: "/notes", label: "Notes", icon: BookOpen },
  { href: "/stats", label: "Stats", icon: BarChart2 },
  { href: "/interviews", label: "Interviews", icon: Mic },
  { href: "/review", label: "Review", icon: ClipboardList },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 flex h-14 items-center overflow-x-auto border-t border-[var(--border)] bg-[var(--surface)] md:hidden">
      {navItems.map((item) => {
        const isActive = pathname?.startsWith(item.href);
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex h-full min-w-16 flex-1 flex-col items-center justify-center gap-1 text-[10px]",
              isActive ? "text-[var(--ai)]" : "text-[var(--muted)]"
            )}
          >
            <Icon className="h-4 w-4" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
