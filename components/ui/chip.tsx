import { cn } from "@/lib/utils";

interface ChipProps {
  label: string;
  color: string;
  soft: string;
  className?: string;
}

/** Small colored pill for task-type/phase/status labels, colored via CSS var() refs. */
export function Chip({ label, color, soft, className }: ChipProps) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center rounded-md px-2 py-0.5 font-mono text-[10.5px] font-semibold",
        className
      )}
      style={{ color, background: soft }}
    >
      {label}
    </span>
  );
}
