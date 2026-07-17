"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";

import { usePageHeader } from "@/lib/use-page-header";
import { phaseColorVars, type PhaseColorKey } from "@/lib/curriculum-data";
import { projectStatusColor, projectStatusLabel, type ProjectStatus } from "@/lib/status-colors";
import { Card } from "@/components/ui/card";
import type { ProjectsData } from "@/lib/queries/projects";

const STATUSES: ProjectStatus[] = ["NOT_STARTED", "IN_PROGRESS", "COMPLETED", "DEPLOYED"];

export function ProjectsClient({ projects }: { projects: ProjectsData }) {
  usePageHeader("Projects", "12 capstones, one per month");
  const router = useRouter();

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [pendingIds, setPendingIds] = useState<Set<string>>(new Set());

  const [githubDraft, setGithubDraft] = useState("");
  const [liveDraft, setLiveDraft] = useState("");
  const [techDraft, setTechDraft] = useState("");
  const [notesDraft, setNotesDraft] = useState("");
  const [saving, setSaving] = useState(false);

  const selected = selectedId ? projects.find((p) => p.id === selectedId) ?? null : null;

  useEffect(() => {
    setGithubDraft(selected?.githubUrl ?? "");
    setLiveDraft(selected?.liveUrl ?? "");
    setTechDraft(selected?.techStack.join(", ") ?? "");
    setNotesDraft(selected?.notes ?? "");
  }, [selected?.id, selected?.githubUrl, selected?.liveUrl, selected?.techStack, selected?.notes]);

  const patch = async (id: string, body: Record<string, unknown>) => {
    setPendingIds((prev) => new Set(prev).add(id));
    try {
      const res = await fetch(`/api/projects/${id}`, {
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

  const setStatus = (id: string, status: ProjectStatus) => patch(id, { status });

  const isDirty =
    !!selected &&
    (githubDraft !== (selected.githubUrl ?? "") ||
      liveDraft !== (selected.liveUrl ?? "") ||
      techDraft !== selected.techStack.join(", ") ||
      notesDraft !== (selected.notes ?? ""));

  const saveDetails = async () => {
    if (!selected) return;
    setSaving(true);
    try {
      await patch(selected.id, {
        githubUrl: githubDraft,
        liveUrl: liveDraft,
        techStack: techDraft
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        notes: notesDraft,
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-[2.3fr_1fr]">
      <div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STATUSES.map((status) => {
            const inColumn = projects.filter((p) => p.status === status);
            return (
              <div key={status}>
                <div className="mb-2.5 text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
                  {projectStatusLabel(status)} · {inColumn.length}
                </div>
                <div className="flex flex-col gap-2.5">
                  {inColumn.map((project) => {
                    const vars = phaseColorVars(project.phase.color as PhaseColorKey);
                    return (
                      <button
                        key={project.id}
                        onClick={() => setSelectedId(project.id)}
                        className="block w-full text-left"
                      >
                        <Card
                          className="p-3.5 hover:bg-[var(--surface2)]"
                          style={selected?.id === project.id ? { borderColor: vars.color } : undefined}
                        >
                          <span
                            className="inline-block rounded-md px-2 py-0.5 font-mono text-[10px] font-semibold"
                            style={{ color: vars.color, background: vars.soft }}
                          >
                            {project.phase.name}
                          </span>
                          <div className="mb-2 mt-2 text-[13px] font-semibold leading-tight text-[var(--text)]">
                            {project.name}
                          </div>
                          <div className="mb-2 flex flex-wrap gap-1.5">
                            {project.techStack.map((tech) => (
                              <span
                                key={tech}
                                className="rounded-[5px] bg-[var(--surface2)] px-1.5 py-0.5 font-mono text-[10.5px] text-[var(--muted)]"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                          <div className="text-[11.5px] text-[var(--muted)]">
                            M{project.monthNumber} · {project.description}
                          </div>
                          <div className="mt-2 flex gap-2.5 text-[11px] text-[var(--brand)]">
                            {project.githubUrl && <span>GitHub ↗</span>}
                            {project.liveUrl && <span>Live ↗</span>}
                          </div>
                        </Card>
                      </button>
                    );
                  })}
                  {inColumn.length === 0 && (
                    <div className="rounded-xl border border-dashed border-[var(--border)] px-3 py-6 text-center text-[11.5px] text-[var(--muted)]">
                      Nothing here yet
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col gap-5">
        {selected ? (
          <Card className="p-5">
            <div className="mb-2.5 flex items-center justify-between">
              <div className="text-[15px] font-bold text-[var(--text)]">{selected.name}</div>
              <button onClick={() => setSelectedId(null)} className="text-xs text-[var(--muted)]">
                Close ✕
              </button>
            </div>
            <div className="mb-3.5 text-[12.5px] text-[var(--muted)]">
              M{selected.monthNumber} · {selected.monthTitle}
            </div>

            <div className="mb-3.5 flex flex-wrap gap-1.5">
              {STATUSES.map((s) => (
                <button
                  key={s}
                  onClick={() => setStatus(selected.id, s)}
                  disabled={pendingIds.has(selected.id)}
                  className="rounded-md border px-2.5 py-1 text-[11px] font-semibold disabled:opacity-50"
                  style={
                    selected.status === s
                      ? { borderColor: projectStatusColor(s), color: projectStatusColor(s), background: "var(--surface2)" }
                      : { borderColor: "var(--border)", color: "var(--muted)" }
                  }
                >
                  {projectStatusLabel(s)}
                </button>
              ))}
            </div>

            {(selected.startedAt || selected.completedAt) && (
              <div className="mb-3.5 flex gap-4 text-[11.5px] text-[var(--muted)]">
                {selected.startedAt && <span>Started {format(selected.startedAt, "MMM d")}</span>}
                {selected.completedAt && <span>Completed {format(selected.completedAt, "MMM d")}</span>}
              </div>
            )}

            <input
              value={githubDraft}
              onChange={(e) => setGithubDraft(e.target.value)}
              placeholder="GitHub URL"
              className="mb-2 w-full rounded-lg border border-[var(--border)] bg-[var(--surface2)] px-3 py-2 text-[13px] text-[var(--text)] placeholder:text-[var(--muted)]"
            />
            <input
              value={liveDraft}
              onChange={(e) => setLiveDraft(e.target.value)}
              placeholder="Live URL"
              className="mb-2 w-full rounded-lg border border-[var(--border)] bg-[var(--surface2)] px-3 py-2 text-[13px] text-[var(--text)] placeholder:text-[var(--muted)]"
            />
            <input
              value={techDraft}
              onChange={(e) => setTechDraft(e.target.value)}
              placeholder="Tech stack (comma-separated)"
              className="mb-2 w-full rounded-lg border border-[var(--border)] bg-[var(--surface2)] px-3 py-2 text-[13px] text-[var(--text)] placeholder:text-[var(--muted)]"
            />
            <textarea
              value={notesDraft}
              onChange={(e) => setNotesDraft(e.target.value)}
              placeholder="Notes…"
              className="mb-2.5 min-h-[80px] w-full resize-y rounded-lg border border-[var(--border)] bg-[var(--surface2)] px-3 py-2.5 text-[13px] text-[var(--text)] placeholder:text-[var(--muted)]"
            />
            <button
              onClick={saveDetails}
              disabled={saving || !isDirty}
              className="rounded-lg border border-[var(--border)] px-3.5 py-[7px] text-xs text-[var(--text)] disabled:opacity-50"
            >
              {saving ? "Saving…" : "Save details"}
            </button>
          </Card>
        ) : (
          <Card className="p-5 text-[12.5px] text-[var(--muted)]">
            Select a project card to edit its status, links, and notes.
          </Card>
        )}
      </div>
    </div>
  );
}
