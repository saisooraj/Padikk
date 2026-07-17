"use client";

import { useState } from "react";
import { format } from "date-fns";
import { useSession, signOut } from "next-auth/react";

import { usePageHeader } from "@/lib/use-page-header";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";

interface Settings {
  startDate: string;
  activeMonth: string;
  dailyGoalMinutes: string;
  timezone: string;
  remindersOn: boolean;
}

const DEFAULT_SETTINGS: Settings = {
  startDate: format(new Date(), "yyyy-MM-dd"),
  activeMonth: "1",
  dailyGoalMinutes: "90",
  timezone: "Asia/Kolkata",
  remindersOn: false,
};

export default function SettingsPage() {
  usePageHeader("Settings", "Roadmap & account");

  const { data: session } = useSession();
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);

  const update = (patch: Partial<Settings>) =>
    setSettings((prev) => ({ ...prev, ...patch }));

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
          <div className="mb-1.5 text-xs text-[var(--muted)]">Roadmap start date</div>
          <input
            type="date"
            value={settings.startDate}
            onChange={(e) => update({ startDate: e.target.value })}
            className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface2)] px-3 py-2 text-[13px] text-[var(--text)]"
          />
        </div>
        <div>
          <div className="mb-1.5 text-xs text-[var(--muted)]">Current active month (1–12)</div>
          <input
            type="number"
            min={1}
            max={12}
            value={settings.activeMonth}
            onChange={(e) => update({ activeMonth: e.target.value })}
            className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface2)] px-3 py-2 text-[13px] text-[var(--text)]"
          />
        </div>
        <div>
          <div className="mb-1.5 text-xs text-[var(--muted)]">Daily time goal (minutes)</div>
          <input
            type="number"
            min={30}
            max={180}
            step={15}
            value={settings.dailyGoalMinutes}
            onChange={(e) => update({ dailyGoalMinutes: e.target.value })}
            className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface2)] px-3 py-2 text-[13px] text-[var(--text)]"
          />
        </div>
        <div>
          <div className="mb-1.5 text-xs text-[var(--muted)]">Timezone</div>
          <input
            value={settings.timezone}
            onChange={(e) => update({ timezone: e.target.value })}
            className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface2)] px-3 py-2 text-[13px] text-[var(--text)]"
          />
        </div>
        <div className="flex items-center justify-between pt-1.5">
          <div className="text-[13px] text-[var(--text)]">Daily reminder</div>
          <Switch
            checked={settings.remindersOn}
            onCheckedChange={(checked) => update({ remindersOn: checked })}
          />
        </div>
      </Card>
    </div>
  );
}
