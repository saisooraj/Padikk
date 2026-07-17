import Link from "next/link";

export function TopBar() {
  return (
    <header className="flex h-14 items-center border-b border-[var(--border)] bg-[var(--surface)] px-4 md:hidden">
      <Link href="/dashboard" className="flex items-center gap-2">
        <span className="font-space text-xl font-bold text-[var(--ai)]">P</span>
        <span className="font-space text-base font-semibold text-[var(--text)]">
          Padikk
        </span>
      </Link>
    </header>
  );
}
