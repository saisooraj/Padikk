"use client";

import { format, parseISO } from "date-fns";

import { usePageHeader } from "@/lib/use-page-header";
import { phaseColorVars } from "@/lib/curriculum-data";
import { DSA_PROBLEMS, difficultyDistribution } from "@/lib/dsa-data";
import { INTERVIEWS } from "@/lib/interviews-data";
import { buildHeatmapWeeks, HEATMAP_LEVEL_OPACITY, hoursByTypeRows } from "@/lib/stats-data";
import { difficultyLabel } from "@/lib/status-colors";
import { Card } from "@/components/ui/card";
import { ProgressBar } from "@/components/ui/progress-bar";

export default function StatsPage() {
  usePageHeader("Stats", "Read-only analytics");

  const hoursRows = hoursByTypeRows();
  const totalHours = hoursRows.reduce((sum, r) => sum + r.hours, 0);
  const dsaSolved = DSA_PROBLEMS.filter((p) => p.status === "SOLVED" || p.status === "OWNED").length;
  const heatmap = buildHeatmapWeeks(20);
  const maxPerformance = 5;

  const statTiles = [
    { label: "Total hours logged", value: `${totalHours}h` },
    { label: "DSA problems solved", value: `${dsaSolved}/${DSA_PROBLEMS.length}` },
    { label: "Mock interviews", value: INTERVIEWS.length },
    { label: "Avg. session length", value: "1h 15m" },
  ];

  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {statTiles.map((tile) => (
          <Card key={tile.label} className="p-4">
            <div className="mb-1.5 text-[11.5px] text-[var(--muted)]">{tile.label}</div>
            <div className="font-mono text-2xl font-bold text-[var(--text)]">{tile.value}</div>
          </Card>
        ))}
      </div>

      <Card className="p-5">
        <div className="mb-3.5 text-sm font-semibold text-[var(--text)]">Activity — last 20 weeks</div>
        <div className="grid grid-cols-[repeat(20,minmax(0,1fr))] gap-[3px]">
          {heatmap.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-[3px]">
              {week.map((level, di) => (
                <div
                  key={di}
                  className="aspect-square w-full rounded-[2px]"
                  style={{
                    background: level >= 3 ? "var(--brand)" : "var(--ai)",
                    opacity: HEATMAP_LEVEL_OPACITY[level],
                  }}
                />
              ))}
            </div>
          ))}
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <Card className="p-5">
          <div className="mb-3.5 text-sm font-semibold text-[var(--text)]">Hours by task type</div>
          <div className="flex flex-col gap-2.5">
            {hoursRows.map((row) => {
              const vars = phaseColorVars(row.colorKey);
              return (
                <div key={row.type}>
                  <div className="mb-1 flex justify-between text-xs">
                    <span className="text-[var(--text)]">{row.label}</span>
                    <span className="font-mono text-[var(--muted)]">{row.hours}h</span>
                  </div>
                  <ProgressBar value={(row.hours / row.max) * 100} colorVar={vars.color} className="h-1.5" />
                </div>
              );
            })}
          </div>
        </Card>

        <Card className="p-5">
          <div className="mb-3.5 text-sm font-semibold text-[var(--text)]">DSA by difficulty</div>
          <div className="mb-[18px] flex flex-col gap-2.5">
            {difficultyDistribution().map((d) => (
              <div key={d.difficulty}>
                <div className="mb-1 flex justify-between text-xs">
                  <span className="text-[var(--text)]">{difficultyLabel(d.difficulty)}</span>
                  <span className="font-mono text-[var(--muted)]">
                    {d.solved}/{d.total}
                  </span>
                </div>
                <ProgressBar value={d.total ? (d.solved / d.total) * 100 : 0} className="h-1.5" />
              </div>
            ))}
          </div>

          <div className="mb-2.5 text-sm font-semibold text-[var(--text)]">Mock interview trend</div>
          <div className="flex h-14 items-end gap-1.5">
            {[...INTERVIEWS].reverse().map((iv) => (
              <div
                key={iv.id}
                title={format(parseISO(iv.date), "MMM d")}
                className="flex-1 rounded-t-[3px] bg-[var(--brand)]"
                style={{ height: `${(iv.performance / maxPerformance) * 100}%` }}
              />
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
