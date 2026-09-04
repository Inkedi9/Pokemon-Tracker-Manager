"use client";

import { Button } from "@/components/ui/button";

export type ChartLimit = 5 | 10 | "all";

type AnalyticsChartControlsProps = {
  value: ChartLimit;
  onChange: (value: ChartLimit) => void;
};

export function AnalyticsChartControls({
  value,
  onChange,
}: AnalyticsChartControlsProps) {
  return (
    <div className="flex items-center gap-1 rounded-lg border border-white/10 bg-white/[0.02] p-1">
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => onChange(5)}
        className={`h-7 px-2.5 text-[11px] ${
          value === 5
            ? "bg-white/10 text-white"
            : "text-zinc-500 hover:bg-white/5 hover:text-zinc-300"
        }`}
      >
        Top 5
      </Button>

      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => onChange(10)}
        className={`h-7 px-2.5 text-[11px] ${
          value === 10
            ? "bg-white/10 text-white"
            : "text-zinc-500 hover:bg-white/5 hover:text-zinc-300"
        }`}
      >
        Top 10
      </Button>

      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => onChange("all")}
        className={`h-7 px-2.5 text-[11px] ${
          value === "all"
            ? "bg-white/10 text-white"
            : "text-zinc-500 hover:bg-white/5 hover:text-zinc-300"
        }`}
      >
        Toutes
      </Button>
    </div>
  );
}