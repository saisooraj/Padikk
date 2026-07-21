"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { useSession, signOut } from "next-auth/react";

import { usePageHeader } from "@/lib/use-page-header";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import type { SettingsData } from "@/lib/queries/settings";

interface FormState {
  startDate: string;
  currentMonth: string;
  dailyGoalMinutes: string;
  timezone: string;
  reminderEnabled: boolean;
  reminderTime: string;
}

function formFromSettings(settings: SettingsData["settings"]): FormState {
  return {
    startDate: format(settings.startDate, "yyyy-MM-dd"),
    currentMonth: String(settings.currentMonth),
    dailyGoalMinutes: String(settings.dailyGoalMinutes),
    timezone: settings.timezone,
    reminderEnabled: settings.reminderEnabled,
    reminderTime: settings.reminderTime ?? "09:00",
  };
}

export function SettingsClient({ data }: { data: SettingsData }) {
  usePageHeader("Settings", "Roadmap & account");
  const router = useRouter();
  const { data: session } = useSession();

  const initial = formFromSettings(data.settings);
  const [form, setForm] = useState<FormState>(initial);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = (patch: Partial<FormState>) => setForm((prev) => ({ ...prev, ...patch }));
  const isDirty = JSON.stringify(form) !== JSON.stringify(initial);

  const save = async () => {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          startDate: form.startDate,
          currentMonth: Number(form.currentMonth),
          dailyGoalMinutes: Number(form.dailyGoalMinutes),
          timezone: form.timezone,
          reminderEnabled: form.reminderEnabled,
          reminderTime: form.reminderEnabled ? form.reminderTime : null,
        }),
      });
      if (res.ok) {
        router.refresh();
      } else {
        const body = await res.json().catch(() => ({}));
        setError(body.error ?? "Could not save settings.");
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex max-w-[520px] flex-col gap-6">
      <Card className="flex items-center justify-between p-6">
        <div>
          <div className="text-[13px] text-[var(--text)]">{session?.user?.email ?? "Signed in"}</div>
          <div className="text-xs text-[var(--muted)]">{session?.user?.name}</div>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: "/signin" })}
          className="rounded-lg border border-[var(--border)] px-3 py-1.5 text-[13px] text-[var(--text)] hover:bg-[var(--surface2)]"
        >
          Sign out
        </button>
      </Card>
      <Card className="flex flex-col gap-4 p-6">
        <div>
          <label className="mb-1.5 block text-xs text-[var(--muted)]" htmlFor="settings-start-date">
            Roadmap start date
          </label>
          <input
            id="settings-start-date"
            type="date"
            value={form.startDate}
            onChange={(e) => update({ startDate: e.target.value })}
            className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface2)] px-3 py-2 text-[13px] text-[var(--text)]"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs text-[var(--muted)]" htmlFor="settings-current-month">
            Current active month (1–12)
          </label>
          <input
            id="settings-current-month"
            type="number"
            min={1}
            max={12}
            value={form.currentMonth}
            onChange={(e) => update({ currentMonth: e.target.value })}
            className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface2)] px-3 py-2 text-[13px] text-[var(--text)]"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs text-[var(--muted)]" htmlFor="settings-daily-goal">
            Daily time goal (minutes)
          </label>
          <input
            id="settings-daily-goal"
            type="number"
            min={30}
            max={180}
            step={15}
            value={form.dailyGoalMinutes}
            onChange={(e) => update({ dailyGoalMinutes: e.target.value })}
            className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface2)] px-3 py-2 text-[13px] text-[var(--text)]"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs text-[var(--muted)]" htmlFor="settings-timezone">
            Timezone
          </label>
          <input
            id="settings-timezone"
            value={form.timezone}
            onChange={(e) => update({ timezone: e.target.value })}
            className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface2)] px-3 py-2 text-[13px] text-[var(--text)]"
          />
        </div>
        <div className="flex items-center justify-between pt-1.5">
          <div className="text-[13px] text-[var(--text)]">Daily reminder</div>
          <Switch
            checked={form.reminderEnabled}
            onCheckedChange={(checked) => update({ reminderEnabled: checked })}
          />
        </div>
        {form.reminderEnabled && (
          <div>
            <label className="mb-1.5 block text-xs text-[var(--muted)]" htmlFor="settings-reminder-time">
              Reminder time
            </label>
            <input
              id="settings-reminder-time"
              type="time"
              value={form.reminderTime}
              onChange={(e) => update({ reminderTime: e.target.value })}
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface2)] px-3 py-2 text-[13px] text-[var(--text)]"
            />
          </div>
        )}
        {error && <div className="text-xs text-[var(--danger)]">{error}</div>}
        <button
          onClick={save}
          disabled={saving || !isDirty}
          className="self-start rounded-lg bg-[var(--brand)] px-4 py-2 text-[13px] font-semibold text-[var(--brand-text)] disabled:opacity-50"
        >
          {saving ? "Saving…" : "Save settings"}
        </button>
      </Card>
    </div>
  );
}
