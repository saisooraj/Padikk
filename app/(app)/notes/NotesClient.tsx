"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";

import { usePageHeader } from "@/lib/use-page-header";
import { MONTHS } from "@/lib/curriculum-data";
import { cn } from "@/lib/utils";
import type { NotesData } from "@/lib/queries/notes";

export function NotesClient({ data }: { data: NotesData }) {
  usePageHeader("Notes", "Journal & references");
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(data.notes[0]?.id ?? null);
  const [pendingIds, setPendingIds] = useState<Set<string>>(new Set());

  const [addOpen, setAddOpen] = useState(false);
  const [addTitle, setAddTitle] = useState("");
  const [addContent, setAddContent] = useState("");
  const [addTags, setAddTags] = useState("");
  const [addSaving, setAddSaving] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);

  const [titleDraft, setTitleDraft] = useState("");
  const [contentDraft, setContentDraft] = useState("");
  const [tagsDraft, setTagsDraft] = useState("");
  const [monthRefDraft, setMonthRefDraft] = useState<string>("");
  const [saving, setSaving] = useState(false);

  const notes = [...data.notes].sort((a, b) => Number(b.pinned) - Number(a.pinned));

  const filtered = notes.filter(
    (n) =>
      !search ||
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()))
  );

  const selected = selectedId ? notes.find((n) => n.id === selectedId) ?? null : null;

  useEffect(() => {
    setTitleDraft(selected?.title ?? "");
    setContentDraft(selected?.content ?? "");
    setTagsDraft(selected?.tags.join(", ") ?? "");
    setMonthRefDraft(selected?.monthRef ? String(selected.monthRef) : "");
  }, [selected?.id, selected?.title, selected?.content, selected?.tags, selected?.monthRef]);

  const isDirty =
    !!selected &&
    (titleDraft !== selected.title ||
      contentDraft !== selected.content ||
      tagsDraft !== selected.tags.join(", ") ||
      monthRefDraft !== (selected.monthRef ? String(selected.monthRef) : ""));

  const patch = async (id: string, body: Record<string, unknown>) => {
    setPendingIds((prev) => new Set(prev).add(id));
    try {
      const res = await fetch(`/api/notes/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (res.ok) router.refresh();
    } finally {
      setPendingIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  };

  const togglePin = (id: string, pinned: boolean) => patch(id, { pinned: !pinned });

  const saveNote = async () => {
    if (!selected) return;
    if (!titleDraft.trim()) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/notes/${selected.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: titleDraft,
          content: contentDraft,
          tags: tagsDraft
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean),
          monthRef: monthRefDraft ? Number(monthRefDraft) : null,
        }),
      });
      if (res.ok) router.refresh();
    } finally {
      setSaving(false);
    }
  };

  const deleteNote = async (id: string) => {
    if (!confirm("Delete this note? This can't be undone.")) return;
    setPendingIds((prev) => new Set(prev).add(id));
    try {
      const res = await fetch(`/api/notes/${id}`, { method: "DELETE" });
      if (res.ok) {
        setSelectedId(null);
        router.refresh();
      }
    } finally {
      setPendingIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  };

  const addNote = async () => {
    if (!addTitle.trim()) {
      setAddError("Title is required.");
      return;
    }
    setAddSaving(true);
    setAddError(null);
    try {
      const res = await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: addTitle,
          content: addContent,
          tags: addTags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean),
        }),
      });
      if (res.ok) {
        const body = await res.json();
        setAddTitle("");
        setAddContent("");
        setAddTags("");
        setAddOpen(false);
        setSelectedId(body.note.id);
        router.refresh();
      } else {
        const body = await res.json().catch(() => ({}));
        setAddError(body.error ?? "Could not add note.");
      }
    } finally {
      setAddSaving(false);
    }
  };

  return (
    <div className="grid grid-cols-1 gap-5 lg:h-[calc(100vh-190px)] lg:grid-cols-[340px_1fr]">
      <div className="flex flex-col gap-2.5 lg:overflow-hidden">
        <div className="flex gap-2">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search notes or tags…"
            className="flex-1 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-[13px] text-[var(--text)] placeholder:text-[var(--muted)]"
          />
          <button
            onClick={() => setAddOpen((v) => !v)}
            className="shrink-0 rounded-lg bg-[var(--brand)] px-3 py-2 text-[13px] font-semibold text-[var(--brand-text)]"
          >
            {addOpen ? "Cancel" : "+ New"}
          </button>
        </div>

        {addOpen && (
          <div className="flex flex-col gap-2 rounded-[9px] border border-[var(--border)] bg-[var(--surface)] p-3">
            <input
              value={addTitle}
              onChange={(e) => setAddTitle(e.target.value)}
              placeholder="Title"
              className="rounded-lg border border-[var(--border)] bg-[var(--surface2)] px-3 py-2 text-[13px] text-[var(--text)] placeholder:text-[var(--muted)]"
            />
            <textarea
              value={addContent}
              onChange={(e) => setAddContent(e.target.value)}
              placeholder="Write your note…"
              className="min-h-[90px] resize-y rounded-lg border border-[var(--border)] bg-[var(--surface2)] px-3 py-2 text-[13px] text-[var(--text)] placeholder:text-[var(--muted)]"
            />
            <input
              value={addTags}
              onChange={(e) => setAddTags(e.target.value)}
              placeholder="Tags, comma-separated"
              className="rounded-lg border border-[var(--border)] bg-[var(--surface2)] px-3 py-2 text-[13px] text-[var(--text)] placeholder:text-[var(--muted)]"
            />
            {addError && <div className="text-xs text-[var(--danger)]">{addError}</div>}
            <button
              onClick={addNote}
              disabled={addSaving}
              className="self-start rounded-lg bg-[var(--brand)] px-3.5 py-1.5 text-[12px] font-semibold text-[var(--brand-text)] disabled:opacity-60"
            >
              {addSaving ? "Adding…" : "Add note"}
            </button>
          </div>
        )}

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
              <div className="mb-1.5 line-clamp-2 text-[11.5px] text-[var(--muted)]">
                {note.content || "No content yet."}
              </div>
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
          {filtered.length === 0 && data.notes.length > 0 && (
            <div className="px-2 py-8 text-center text-[12.5px] text-[var(--muted)]">
              No notes match &quot;{search}&quot;.
            </div>
          )}
          {data.notes.length === 0 && (
            <div className="px-2 py-8 text-center text-[12.5px] text-[var(--muted)]">
              No notes yet. Start with key concepts from today&apos;s session.
            </div>
          )}
        </div>
      </div>

      <div className="overflow-y-auto rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6">
        {selected ? (
          <>
            <div className="mb-3.5 flex items-start justify-between gap-3">
              <input
                value={titleDraft}
                onChange={(e) => setTitleDraft(e.target.value)}
                className="flex-1 bg-transparent text-[19px] font-bold text-[var(--text)] outline-none"
              />
              <div className="flex shrink-0 items-center gap-3">
                <button
                  onClick={() => togglePin(selected.id, selected.pinned)}
                  disabled={pendingIds.has(selected.id)}
                  className="text-xs text-[var(--muted)] disabled:opacity-50"
                >
                  {selected.pinned ? "Unpin" : "Pin"}
                </button>
                <button
                  onClick={() => deleteNote(selected.id)}
                  className="text-xs text-[var(--danger)]"
                >
                  Delete
                </button>
              </div>
            </div>
            <div className="mb-[18px] flex flex-wrap items-center gap-2">
              <input
                value={tagsDraft}
                onChange={(e) => setTagsDraft(e.target.value)}
                placeholder="Tags, comma-separated"
                className="min-w-[160px] flex-1 rounded-[5px] bg-[var(--surface2)] px-2 py-[3px] text-[11px] text-[var(--text)] outline-none placeholder:text-[var(--muted)]"
              />
              <select
                value={monthRefDraft}
                onChange={(e) => setMonthRefDraft(e.target.value)}
                className="rounded-[5px] border border-[var(--border)] bg-[var(--surface2)] px-2 py-[3px] text-[11px] text-[var(--text)]"
              >
                <option value="">No month</option>
                {MONTHS.map((m) => (
                  <option key={m.number} value={m.number}>
                    Month {m.number} · {m.title}
                  </option>
                ))}
              </select>
              <span className="ml-auto text-[11px] text-[var(--muted)]">
                Updated {formatDistanceToNow(selected.updatedAt, { addSuffix: true })}
              </span>
            </div>
            <textarea
              value={contentDraft}
              onChange={(e) => setContentDraft(e.target.value)}
              placeholder="Write your note…"
              className="min-h-[300px] w-full resize-y whitespace-pre-wrap bg-transparent text-sm leading-[1.75] text-[var(--text)] outline-none placeholder:text-[var(--muted)]"
            />
            <div className="mt-3 flex justify-end">
              <button
                onClick={saveNote}
                disabled={!isDirty || saving || !titleDraft.trim()}
                className="rounded-lg bg-[var(--brand)] px-3.5 py-[7px] text-xs font-semibold text-[var(--brand-text)] disabled:opacity-50"
              >
                {saving ? "Saving…" : "Save note"}
              </button>
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
