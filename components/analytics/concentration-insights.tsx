"use client";

import {
  AlertTriangle,
  CheckCircle2,
  Info,
  Lightbulb,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

import type {
  ConcentrationInsight,
} from "@/lib/concentration-insights";

type ConcentrationInsightsProps = {
  insights: ConcentrationInsight[];
};

const LEVEL_CONFIG = {
  positive: {
    icon: CheckCircle2,
    label: "Équilibré",
    className:
      "border-emerald-400/20 bg-emerald-400/[0.04] text-emerald-300",
  },

  info: {
    icon: Info,
    label: "Information",
    className:
      "border-violet-400/20 bg-violet-400/[0.04] text-violet-300",
  },

  warning: {
    icon: AlertTriangle,
    label: "Attention",
    className:
      "border-amber-400/20 bg-amber-400/[0.04] text-amber-300",
  },

  danger: {
    icon: AlertTriangle,
    label: "Risque",
    className:
      "border-red-400/20 bg-red-400/[0.04] text-red-300",
  },
} as const;

export function ConcentrationInsights({
  insights,
}: ConcentrationInsightsProps) {
  if (insights.length === 0) {
    return null;
  }

  return (
    <section className="mt-4">
      <div className="mb-3 flex items-center gap-2">
        <Lightbulb className="h-4 w-4 text-amber-400" />

        <div>
          <h2 className="text-sm font-semibold text-zinc-200">
            Collection Insights
          </h2>

          <p className="mt-1 text-xs text-zinc-500">
            Interprétation automatique de la répartition de ta
            collection.
          </p>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {insights.map((insight) => {
          const config = LEVEL_CONFIG[insight.level];
          const Icon = config.icon;

          return (
            <Card
              key={`${insight.level}-${insight.title}`}
              className={`border ${config.className}`}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-current/20 bg-black/10">
                    <Icon className="h-4 w-4" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-xs font-semibold">
                        {insight.title}
                      </p>

                      <Badge
                        variant="outline"
                        className="border-current/20 bg-black/10 text-[9px]"
                      >
                        {config.label}
                      </Badge>
                    </div>

                    <p className="mt-1.5 text-[11px] leading-relaxed opacity-70">
                      {insight.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}