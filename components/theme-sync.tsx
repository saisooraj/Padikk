"use client";

import { useEffect } from "react";

import { useThemeStore } from "@/lib/store/theme";

/** Keeps `<html data-theme>` in sync with the persisted theme store after hydration. */
export function ThemeSync() {
  const theme = useThemeStore((state) => state.theme);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  return null;
}
