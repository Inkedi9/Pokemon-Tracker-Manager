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

type ProgressMetric =
    | "cards"
    | "value"
    | "invested"
    | "sets"
    | "languages";

type ChartData = {
    id: string;
    date: string;
    value: number;
};

type ProgressLineChartProps = {
    data: ChartData[];
    metric: ProgressMetric;
};

function formatTooltipValue(
    value: number,
    metric: ProgressMetric
) {
    if (
        metric === "value" ||
        metric === "invested"
    ) {
        return `${value.toFixed(2)} €`;
    }

    return value.toLocaleString("fr-FR");
}

function formatAxisValue(
    value: number,
    metric: ProgressMetric
) {
    if (
        metric === "value" ||
        metric === "invested"
    ) {
        return `${Math.round(value)} €`;
    }

    return value.toLocaleString("fr-FR");
}

export function ProgressLineChart({
    data,
    metric,
}: ProgressLineChartProps) {
    return (
        <ResponsiveContainer
            width="100%"
            height="100%"
        >
            <LineChart
                data={data}
                margin={{
                    top: 10,
                    right: 12,
                    left: 0,
                    bottom: 0,
                }}
            >
                <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(255,255,255,0.05)"
                    vertical={false}
                />

                <XAxis
                    dataKey="date"
                    axisLine={false}
                    tickLine={false}
                    tick={{
                        fill: "#52525b",
                        fontSize: 10,
                    }}
                    dy={8}
                />

                <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{
                        fill: "#52525b",
                        fontSize: 10,
                    }}
                    tickFormatter={(value) =>
                        formatAxisValue(
                            value,
                            metric
                        )
                    }
                    width={55}
                />

                <Tooltip
                    cursor={{
                        stroke: "rgba(255,255,255,0.1)",
                    }}
                    contentStyle={{
                        backgroundColor: "#111114",
                        border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: "8px",
                        fontSize: "11px",
                    }}
                    labelStyle={{
                        color: "#a1a1aa",
                        marginBottom: "4px",
                    }}
                    formatter={(value) => [
                        formatTooltipValue(
                            Number(value),
                            metric
                        ),
                        "Valeur",
                    ]}
                />

                <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#60a5fa"
                    strokeWidth={2}
                    dot={{
                        r: 3,
                        fill: "#111114",
                        stroke: "#60a5fa",
                        strokeWidth: 2,
                    }}
                    activeDot={{
                        r: 5,
                        strokeWidth: 2,
                    }}
                />
            </LineChart>
        </ResponsiveContainer>
    );
}