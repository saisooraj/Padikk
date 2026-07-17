import { create } from "zustand";

interface PageHeaderState {
  title: string;
  subtitle: string;
  setHeader: (title: string, subtitle: string) => void;
}

export const usePageHeaderStore = create<PageHeaderState>((set) => ({
  title: "Padikk",
  subtitle: "",
  setHeader: (title, subtitle) => set({ title, subtitle }),
}));
