"use client";

import { useState } from "react";

import { usePageHeader } from "@/lib/use-page-header";
import { NOTES } from "@/lib/notes-data";
import { cn } from "@/lib/utils";

export default function NotesPage() {
  usePageHeader("Notes", "Journal & references");

  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState(NOTES[0]?.id ?? null);
  const [pinnedOverrides, setPinnedOverrides] = useState<Record<string, boolean>>({});

  const notes = NOTES.map((n) => ({
    ...n,
    pinned: pinnedOverrides[n.id] ?? n.pinned,
  }));

  const filtered = notes
    .filter(
      (n) =>
        !search ||
        n.title.toLowerCase().includes(search.toLowerCase()) ||
        n.tags.some((t) => t.includes(search.toLowerCase()))
    )
    .sort((a, b) => Number(b.pinned) - Number(a.pinned));

  const selected = notes.find((n) => n.id === selectedId) ?? null;

  const togglePin = (id: string) => {
    setPinnedOverrides((prev) => ({
      ...prev,
      [id]: !(prev[id] ?? notes.find((n) => n.id === id)?.pinned ?? false),
    }));
  };

  return (
    <div className="grid grid-cols-1 gap-5 lg:h-[calc(100vh-190px)] lg:grid-cols-[340px_1fr]">
      <div className="flex flex-col gap-2.5 lg:overflow-hidden">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search notes or tags…"
          className="rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-[13px] text-[var(--text)] placeholder:text-[var(--muted)]"
        />
        <div className="flex flex-col gap-2 lg:overflow-y-auto">
          {filtered.map((note) => (
            <button
              key={note.id}
              onClick={() => setSelectedId(note.id)}
              className={cn(
                "rounded-[9px] border border-[var(--border)] px-3 py-[11px] text-left",
                note.id === selectedId ? "bg-[var(--brand-soft)]" : "bg-[var(--surface)]"
              )}
            >
              <div className="mb-1 text-[13.5px] font-semibold leading-tight text-[var(--text)]">
                {note.pinned && "📌 "}
                {note.title}
              </div>
              <div className="mb-1.5 line-clamp-2 text-[11.5px] text-[var(--muted)]">{note.body}</div>
              <div className="flex flex-wrap gap-1.5">
                {note.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-[5px] bg-[var(--surface2)] px-1.5 py-0.5 text-[10px] text-[var(--muted)]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </button>
          ))}
          {filtered.length === 0 && (
            <div className="px-2 py-8 text-center text-[12.5px] text-[var(--muted)]">
              No notes match &quot;{search}&quot;.
            </div>
          )}
        </div>
      </div>

      <div className="overflow-y-auto rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6">
        {selected ? (
          <>
            <div className="mb-3.5 flex items-start justify-between">
              <div className="text-[19px] font-bold text-[var(--text)]">{selected.title}</div>
              <button
                onClick={() => togglePin(selected.id)}
                className="shrink-0 text-xs text-[var(--muted)]"
              >
                {selected.pinned ? "Unpin" : "Pin"}
              </button>
            </div>
            <div className="mb-[18px] flex items-center gap-1.5">
              {selected.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-[5px] bg-[var(--surface2)] px-2 py-[3px] text-[11px] text-[var(--muted)]"
                >
                  {tag}
                </span>
              ))}
              <span className="ml-auto text-[11px] text-[var(--muted)]">
                Updated {selected.updated}
              </span>
            </div>
            <div className="whitespace-pre-wrap text-sm leading-[1.75] text-[var(--text)]">
              {selected.body}
            </div>
          </>
        ) : (
          <div className="text-[13px] text-[var(--muted)]">
            No notes yet. Start with key concepts from today&apos;s session.
          </div>
        )}
      </div>
    </div>
  );
}
