"use client";

import {
    CartesianGrid,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

import type { PriceSnapshot } from "@/types/card";

type PriceHistoryChartProps = {
    history: PriceSnapshot[];
};

function formatDate(value: string) {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "—";
    }

    return new Intl.DateTimeFormat("fr-FR", {
        day: "2-digit",
        month: "short",
    }).format(date);
}

function formatTooltipDate(value: string) {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "Date inconnue";
    }

    return new Intl.DateTimeFormat("fr-FR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
    }).format(date);
}

type TooltipProps = {
    active?: boolean;
    payload?: Array<{
        value?: number;
        payload?: {
            recordedAt: string;
        };
    }>;
};

function PriceTooltip({
    active,
    payload,
}: TooltipProps) {
    if (
        !active ||
        !payload ||
        payload.length === 0
    ) {
        return null;
    }

    const entry = payload[0];

    const price =
        typeof entry.value === "number"
            ? entry.value
            : null;

    const recordedAt =
        entry.payload?.recordedAt;

    return (
        <div className="rounded-xl border border-white/10 bg-[#111114]/95 px-3 py-2 shadow-xl backdrop-blur">
            <p className="text-[11px] text-zinc-500">
                {recordedAt
                    ? formatTooltipDate(recordedAt)
                    : "Date inconnue"}
            </p>

            <p className="mt-1 font-mono text-sm font-semibold text-white">
                {price !== null
                    ? `${price.toFixed(2)} €`
                    : "—"}
            </p>
        </div>
    );
}

export function PriceHistoryChart({
    history,
}: PriceHistoryChartProps) {
    if (history.length < 2) {
        return null;
    }

    const data = history.map(
        (snapshot) => ({
            recordedAt: snapshot.recordedAt,
            price: snapshot.price,
            label: formatDate(
                snapshot.recordedAt
            ),
        })
    );

    return (
        <div className="rounded-xl border border-white/10 bg-black/10 p-4">
            <div className="mb-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
                    Évolution du prix
                </p>

                <p className="mt-1 text-xs text-zinc-600">
                    Prix marché enregistré dans le temps.
                </p>
            </div>

            <div className="h-[260px] w-full">
                <ResponsiveContainer
                    width="100%"
                    height="100%"
                >
                    <LineChart
                        data={data}
                        margin={{
                            top: 8,
                            right: 8,
                            left: -12,
                            bottom: 0,
                        }}
                    >
                        <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="rgba(255,255,255,0.06)"
                            vertical={false}
                        />

                        <XAxis
                            dataKey="label"
                            tick={{
                                fill: "#71717a",
                                fontSize: 10,
                            }}
                            tickLine={false}
                            axisLine={false}
                        />

                        <YAxis
                            tick={{
                                fill: "#71717a",
                                fontSize: 10,
                            }}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) =>
                                `${value} €`
                            }
                            width={48}
                        />

                        <Tooltip
                            content={
                                <PriceTooltip />
                            }
                            cursor={{
                                stroke: "rgba(255,255,255,0.12)",
                                strokeDasharray: "4 4",
                            }}
                        />

                        <Line
                            type="monotone"
                            dataKey="price"
                            stroke="#34d399"
                            strokeWidth={2}
                            dot={{
                                r: 3,
                                fill: "#34d399",
                                strokeWidth: 0,
                            }}
                            activeDot={{
                                r: 5,
                                fill: "#34d399",
                                strokeWidth: 2,
                                stroke: "#111114",
                            }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}