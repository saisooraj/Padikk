"use client";

import { Toaster as SonnerToaster } from "sonner";

import { useThemeStore } from "@/lib/store/theme";

export function Toaster() {
  const theme = useThemeStore((state) => state.theme);

  return (
    <SonnerToaster
      theme={theme}
      position="bottom-right"
      toastOptions={{
        style: {
          background: "var(--surface)",
          color: "var(--text)",
          border: "1px solid var(--border)",
        },
      }}
    />
  );
}
