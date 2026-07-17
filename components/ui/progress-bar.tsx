import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number;
  colorVar?: string;
  className?: string;
  trackClassName?: string;
}

export function ProgressBar({
  value,
  colorVar = "var(--brand)",
  className,
  trackClassName,
}: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value));
  return (
    <div className={cn("h-1.5 overflow-hidden rounded-full bg-[var(--surface2)]", trackClassName)}>
      <div
        className={cn("h-full rounded-full transition-[width]", className)}
        style={{ width: `${clamped}%`, background: colorVar }}
      />
    </div>
  );
}
