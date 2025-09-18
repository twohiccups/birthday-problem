// app/components/CollisionGraph.tsx
"use client";
import React, { useMemo, useState, forwardRef, useImperativeHandle } from "react";
import {
    ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip,
    ReferenceLine, ReferenceDot, ReferenceArea, Label,
} from "recharts";
import clsx from "clsx";
import { collisionProbability } from "../lib/calendar/util";

const N_MAX = 80;
const N_AT_50 = 23;
const N_AT_75 = 32;

const baseData = Array.from({ length: N_MAX }, (_, i) => {
    const n = i + 1;
    return { n, p: collisionProbability(n) };
});

// 🎨 Colors come from CSS vars so they adapt to light/dark automatically.
const colors = {
    line: "var(--chart-line)",
    grid: "var(--chart-grid)",
    axis: "var(--chart-axis)",
    axisLight: "var(--chart-axisLight)",
    refBold: "var(--chart-refBold)",
    refSubtle: "var(--chart-refSubtle)",
    fill50: "var(--chart-fill50)",
    tooltipBg: "var(--chart-tooltipBg)",
    tooltipBorder: "var(--chart-tooltipBorder)",
    tooltipLabel: "var(--chart-tooltipLabel)",
};

export type CollisionGraphHandle = { play: () => void };

export const CollisionProbabilityGraph = forwardRef<CollisionGraphHandle, { className?: string }>(
    function CollisionGraph({ className }, ref) {
        const data = useMemo(() => baseData, []);
        const [runId, setRunId] = useState<number | null>(null);
        const [isAnimating, setIsAnimating] = useState(false);

        useImperativeHandle(ref, () => ({
            play: () => {
                setRunId(Date.now());
                setIsAnimating(true);
            },
        }), []);

        return (
            <div
                className={clsx(
                    "tabular-nums font-geist-mono w-ful min-h-[280px] rounded-2xl p-3",
                    "bg-gradient-to-b from-white/5 to-white/0",
                    "dark:from-white/5 dark:to-white/0",
                    className
                )}>
                <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={data} margin={{ top: 24, right: 12, bottom: 56, left: 12 }}>
                        <CartesianGrid stroke={colors.grid} vertical horizontal />
                        <XAxis
                            dataKey="n"
                            tickMargin={16}
                            interval="preserveStartEnd"
                            tickCount={10}
                            tick={{ fill: colors.axis, fontSize: 12, fontWeight: 600 }}
                            axisLine={{ stroke: colors.axisLight }}
                            tickLine={{ stroke: colors.axisLight }}
                        >
                            <Label
                                value="Number of People (n)"
                                position="bottom"
                                offset={8}
                                style={{ fill: colors.axis, fontSize: 12, fontWeight: 700 }}
                            />
                        </XAxis>
                        <YAxis
                            domain={[0, 1]}
                            width={64}
                            tickFormatter={(v) => `${Math.round(v * 100)}%`}
                            tick={{ fill: colors.axis, fontSize: 12, fontWeight: 700 }}
                            axisLine={{ stroke: colors.axisLight }}
                            tickLine={{ stroke: colors.axisLight }}
                        >
                            <Label
                                value="P(at least one shared birthday)"
                                angle={-90}
                                position="insideLeft"
                                offset={10}
                                style={{ fill: colors.axis, fontSize: 12, fontWeight: 700, textAnchor: "middle" }}
                            />
                        </YAxis>
                        <Tooltip
                            cursor={{ strokeDasharray: "3 3" }}
                            contentStyle={{
                                background: colors.tooltipBg,
                                border: `1px solid ${colors.tooltipBorder}`,
                                borderRadius: 10,
                                padding: "8px 10px",
                                minWidth: 120,
                            }}
                            labelStyle={{ color: "var(--chart-tooltipLabel)", fontWeight: 700 }}
                            formatter={(val: number) => [`~${(val * 100).toFixed(2)}%`, "P(collision)"]}
                            labelFormatter={(label: number) => `n = ${label}`}
                            wrapperStyle={{ fontVariantNumeric: "tabular-nums" as never }}
                        />
                        <ReferenceLine y={0.5} stroke={colors.refBold} strokeDasharray="4 4" strokeWidth={2}>
                            <Label value="50%" position="insideTopRight" style={{ fill: colors.refBold, fontWeight: 800 }} />
                        </ReferenceLine>
                        <ReferenceArea x1={1} x2={N_AT_50} y1={0} y2={1} fill={colors.fill50} />
                        <ReferenceLine x={N_AT_50} stroke={colors.refBold} strokeDasharray="4 4" strokeWidth={2}>
                            <Label value={`n = ${N_AT_50}`} position="top" style={{ fill: colors.refBold, fontWeight: 800 }} />
                        </ReferenceLine>
                        <ReferenceDot x={N_AT_50} y={0.5} r={4} fill={colors.refBold} />
                        <ReferenceLine y={0.75} stroke={colors.refSubtle} strokeDasharray="2 6" strokeWidth={1.25}>
                            <Label value="75%" position="insideTopRight" style={{ fill: colors.refSubtle, fontWeight: 700 }} />
                        </ReferenceLine>
                        <ReferenceLine x={N_AT_75} stroke={colors.refSubtle} strokeDasharray="2 6" strokeWidth={1.25}>
                            <Label className="hidden sm:inline" value={`n = ${N_AT_75}`} position="top" style={{ fill: colors.refSubtle, fontWeight: 700 }} />
                        </ReferenceLine>
                        <ReferenceDot x={N_AT_75} y={0.75} r={3.5} fill={colors.refSubtle} />

                        <defs>
                            <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
                                <stop offset="0%" stopColor="var(--chart-line)" stopOpacity={0.9} />
                                <stop offset="100%" stopColor="var(--chart-line)" stopOpacity={1} />
                            </linearGradient>
                        </defs>

                        <Line
                            key={runId ?? "static"}
                            type="monotone"
                            dataKey="p"
                            name="P(collision)"
                            stroke="url(#lineGrad)"
                            strokeWidth={3}
                            dot={false}
                            activeDot={{ r: 5 }}
                            isAnimationActive={!!isAnimating}
                            animationDuration={900}
                            animationBegin={0}
                            onAnimationEnd={() => setIsAnimating(false)}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div >
        );
    }
);
