"use client";

import * as React from "react";
import * as SwitchPrimitive from "@radix-ui/react-switch";

import { cn } from "@/lib/utils";

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root>
>(({ className, checked, ...props }, ref) => (
  <SwitchPrimitive.Root
    ref={ref}
    checked={checked}
    className={cn(
      "relative h-[21px] w-[38px] shrink-0 rounded-full border border-[var(--border)] transition-colors",
      checked ? "bg-[var(--brand)]" : "bg-[var(--surface2)]",
      className
    )}
    {...props}
  >
    <SwitchPrimitive.Thumb
      className={cn(
        "absolute top-0.5 block h-[15px] w-[15px] rounded-full transition-all",
        checked ? "left-[20px] bg-[var(--brand-text)]" : "left-[3px] bg-[var(--muted)]"
      )}
    />
  </SwitchPrimitive.Root>
));
Switch.displayName = SwitchPrimitive.Root.displayName;

export { Switch };
