// app/components/CollisionGraph.tsx
"use client";
import {
    ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip,
    ReferenceLine, ReferenceDot, ReferenceArea, Label,
} from "recharts";
import clsx from "clsx";

const N_MAX = 85;
const N_AT_50 = 23;
const N_AT_75 = 32;

function collisionProbability(n: number) {
    let p = 1;
    for (let i = 1; i < n; i++) p *= (365 - i) / 365;
    return 1 - p;
}

const data = Array.from({ length: N_MAX }, (_, i) => {
    const n = i + 1;
    return { n, p: collisionProbability(n) };
});

const colors = {
    line: "#60a5fa",
    grid: "rgba(255,255,255,0.08)",
    axis: "rgba(255,255,255,0.7)",
    axisLight: "rgba(255,255,255,0.4)",
    refBold: "#f59e0b",
    refSubtle: "rgba(245, 158, 11, 0.45)",
    fill50: "rgba(245, 158, 11, 0.075)",
    tooltipBg: "rgba(17,17,17,0.95)",
    tooltipBorder: "rgba(255,255,255,0.08)",
};

export function CollisionGraph({ className }: { className?: string }) {
    return (
        <div className={clsx(
            "font-geist-mono w-full h-full min-h-[220px]  h-[100px] rounded-2xl p-3",
            "bg-gradient-to-b from-white/5 to-white/0",
            className
        )}>
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data} margin={{ top: 24, right: 28, bottom: 56, left: 56 }}>
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
                        tickFormatter={(v) => `${Math.round(v * 100)}%`}
                        tick={{ fill: colors.axis, fontSize: 12, fontWeight: 700 }}
                        axisLine={{ stroke: colors.axisLight }}
                        tickLine={{ stroke: colors.axisLight }}
                        width={56}
                    >
                        <Label
                            value="P(at least one shared birthday)"
                            angle={-90}
                            position="insideLeft"
                            offset={12}
                            style={{ fill: colors.axis, fontSize: 12, fontWeight: 700 }}
                        />
                    </YAxis>
                    <Tooltip
                        cursor={{ strokeDasharray: "3 3" }}
                        contentStyle={{
                            background: colors.tooltipBg,
                            border: `1px solid ${colors.tooltipBorder}`,
                            borderRadius: 10,
                            padding: "8px 10px",
                        }}
                        labelStyle={{ color: colors.axis, fontWeight: 700 }}
                        formatter={(val: number) => [`~${(val * 100).toFixed(2)}%`, "P(collision)"]}
                        labelFormatter={(label: number) => `n = ${label}`}
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
                        <Label value={`n = ${N_AT_75}`} position="top" style={{ fill: colors.refSubtle, fontWeight: 700 }} />
                    </ReferenceLine>
                    <ReferenceDot x={N_AT_75} y={0.75} r={3.5} fill={colors.refSubtle} />
                    <defs>
                        <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
                            <stop offset="0%" stopColor={colors.line} stopOpacity={0.9} />
                            <stop offset="100%" stopColor={colors.line} stopOpacity={1} />
                        </linearGradient>
                    </defs>
                    <Line type="monotone" dataKey="p" name="P(collision)" stroke="url(#lineGrad)" strokeWidth={3} dot={false} activeDot={{ r: 5 }} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
