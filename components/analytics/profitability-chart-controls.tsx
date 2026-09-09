"use client";

import { Button } from "@/components/ui/button";

export type ProfitabilityChartMode =
  | "profit"
  | "roi"
  | "loss";

type ProfitabilityChartControlsProps = {
  value: ProfitabilityChartMode;
  onChange: (value: ProfitabilityChartMode) => void;
};

export function ProfitabilityChartControls({
  value,
  onChange,
}: ProfitabilityChartControlsProps) {
  return (
    <div className="flex w-fit items-center gap-1 rounded-lg border border-white/10 bg-white/[0.02] p-1">
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => onChange("profit")}
        className={`h-7 px-2.5 text-[11px] ${
          value === "profit"
            ? "bg-emerald-400/10 text-emerald-300"
            : "text-zinc-500 hover:bg-white/5 hover:text-zinc-300"
        }`}
      >
        Profit
      </Button>

      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => onChange("roi")}
        className={`h-7 px-2.5 text-[11px] ${
          value === "roi"
            ? "bg-violet-400/10 text-violet-300"
            : "text-zinc-500 hover:bg-white/5 hover:text-zinc-300"
        }`}
      >
        ROI
      </Button>

      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => onChange("loss")}
        className={`h-7 px-2.5 text-[11px] ${
          value === "loss"
            ? "bg-red-400/10 text-red-300"
            : "text-zinc-500 hover:bg-white/5 hover:text-zinc-300"
        }`}
      >
        Pertes
      </Button>
    </div>
  );
}