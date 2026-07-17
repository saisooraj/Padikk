"use client";

import { useEffect } from "react";

import { usePageHeaderStore } from "@/lib/store/page-header";

/** Pages call this once to set the title/subtitle PageShell renders in its header bar. */
export function usePageHeader(title: string, subtitle: string) {
  const setHeader = usePageHeaderStore((state) => state.setHeader);

  useEffect(() => {
    setHeader(title, subtitle);
  }, [title, subtitle, setHeader]);
}
