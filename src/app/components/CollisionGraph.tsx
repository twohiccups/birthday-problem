import {
    ResponsiveContainer,
    LineChart,
    Line,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    ReferenceLine,
    Label,
} from "recharts";

function collisionProbability(n: number) {
    let p = 1;
    for (let i = 1; i < n; i++) {
        p *= (365 - i) / 365;
    }
    return 1 - p;
}

function generateGraphData() {
    const x: number[] = [];
    const y: Record<number, number> = {};

    for (let i = 1; i <= 365; i++) {
        y[i] = collisionProbability(i);
    }
    return y;
}


export function CollisionGraph() {
    const data = Object.entries(generateGraphData()).map(([i, j]) => ({
        n: Number(i),
        p: j as number,
    }));

    const nAt50 =
        data.find((d) => d.p >= 0.5)?.n ??
        data[data.length - 1]?.n;

    return (
        <div style={{ width: "100%", height: 420 }}>
            <ResponsiveContainer>
                <LineChart data={data} margin={{ top: 20, right: 24, bottom: 24, left: 8 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="n" tickMargin={8}>
                        <Label value="Number of People (n)" offset={-10} position="insideBottom" />
                    </XAxis>
                    <YAxis
                        domain={[0, 1]}
                        tickFormatter={(v) => `${Math.round(v * 100)}%`}
                        width={48}
                    >
                        <Label
                            value="P(at least one shared birthday)"
                            angle={-90}
                            position="insideLeft"
                            offset={10}
                        />
                    </YAxis>
                    <Tooltip
                        formatter={(val: number) => [`${(val * 100).toFixed(2)}%`, "P(collision)"]}
                        labelFormatter={(label: number) => `n = ${label}`}
                    />

                    {/* 50% probability reference line */}
                    <ReferenceLine y={0.5} strokeDasharray="4 4">
                        <Label value="50%" position="insideTopRight" />
                    </ReferenceLine>

                    {/* Vertical line at the n where probability first reaches 50% */}
                    {Number.isFinite(nAt50) && (
                        <ReferenceLine x={nAt50} strokeDasharray="4 4">
                            <Label value={`n ≈ ${nAt50}`} position="top" />
                        </ReferenceLine>
                    )}

                    <Line type="monotone" dataKey="p" name="P(collision)" strokeWidth={2} dot={false} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
