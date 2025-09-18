'use client'

import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

function calculateComparisons(n: number) {
    return (n * (n - 1)) / 2;
}

// Helper to generate node positions on a circle
function circleLayout(n: number, size: number, margin = 24) {
    const r = (Math.min(size, size) - margin * 2) / 2;
    const cx = size / 2;
    const cy = size / 2;
    const pts = Array.from({ length: n }, (_, i) => {
        const theta = (2 * Math.PI * i) / n - Math.PI / 2; // start at top
        return {
            x: cx + r * Math.cos(theta),
            y: cy + r * Math.sin(theta),
        };
    });
    return { pts, r, cx, cy };
}

// Generate all undirected edges (i < j)
function allEdges(n: number): Array<[number, number]> {
    const edges: Array<[number, number]> = [];
    for (let i = 0; i < n; i++) {
        for (let j = i + 1; j < n; j++) {
            edges.push([i, j]);
        }
    }
    return edges;
}

// Small hook for intervals that respect React lifecycle
function useTick(enabled: boolean, fps: number, onTick: () => void) {
    const saved = useRef(onTick);
    useEffect(() => {
        saved.current = onTick;
    }, [onTick]);

    useEffect(() => {
        if (!enabled || fps <= 0) return;
        const interval = 1000 / fps;
        const id = setInterval(() => saved.current(), interval);
        return () => clearInterval(id);
    }, [enabled, fps]);
}

export default function Comparisons() {
    const [n, setN] = useState(23);
    const total = useMemo(() => calculateComparisons(n), [n]);
    const edges = useMemo(() => allEdges(n), [n]);
    const [k, setK] = useState(0); // how many edges are revealed
    const [playing, setPlaying] = useState(true);
    const [eps, setEps] = useState(40); // edges per second

    // Compute dynamic canvas size based on container width
    const wrapRef = useRef<HTMLDivElement | null>(null);
    const [size, setSize] = useState(560);
    useEffect(() => {
        function handleResize() {
            const w = wrapRef.current?.clientWidth ?? 560;
            setSize(Math.max(360, Math.min(800, w)));
        }
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const { pts } = useMemo(() => circleLayout(n, size, 28), [n, size]);

    // ticking animation
    useTick(playing, eps, () => {
        setK((prev) => {
            if (prev >= edges.length) return prev; // stop at end
            return prev + 1;
        });
    });

    // Auto-pause when finished
    useEffect(() => {
        if (k >= edges.length && playing) setPlaying(false);
    }, [k, edges.length, playing]);

    const progress = Math.min(1, k / Math.max(1, edges.length));

    return (
        <div className="w-full mx-auto p-4" ref={wrapRef}>
            <div className="flex flex-col   md:flex-row md:items-end md:justify-between gap-4 mb-4">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">Building K
                        <sub className="align-super text-base">{n}</sub>
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Edges revealed: <span className="font-medium">{k}</span> / {total} ({(progress * 100).toFixed(1)}%)
                    </p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                    <button
                        className="px-3 py-1.5 rounded-2xl shadow-sm border hover:shadow transition"
                        onClick={() => setPlaying((p) => !p)}
                        aria-label={playing ? "Pause" : "Play"}
                    >
                        {playing ? "Pause" : "Play"}
                    </button>
                    <button
                        className="px-3 py-1.5 rounded-2xl shadow-sm border hover:shadow transition"
                        onClick={() => {
                            setK(0);
                            setPlaying(true);
                        }}
                    >
                        Reset
                    </button>
                    <div className="flex items-center gap-2">
                        <label className="text-sm whitespace-nowrap" htmlFor="eps">Speed</label>
                        <input
                            id="eps"
                            type="range"
                            min={5}
                            max={120}
                            step={1}
                            value={eps}
                            onChange={(e) => setEps(parseInt(e.target.value, 10))}
                        />
                        <span className="text-sm tabular-nums w-10 text-right">{eps}</span>
                        <span className="text-sm">edges/s</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <label className="text-sm whitespace-nowrap" htmlFor="n">n</label>
                        <input
                            id="n"
                            type="number"
                            className="w-20 px-2 py-1 border rounded-lg"
                            min={2}
                            max={40}
                            value={n}
                            onChange={(e) => {
                                const nv = Math.max(2, Math.min(40, parseInt(e.target.value || "2", 10)));
                                setN(nv);
                                setK(0);
                                setPlaying(true);
                            }}
                        />
                    </div>
                </div>
            </div>

            {/* Progress bar */}
            <div className="w-full max-w-xl">
                <div className="h-2 bg-gray-200/70 rounded-full overflow-hidden mb-4">
                    <motion.div
                        className="h-full bg-black/80"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress * 100}%` }}
                        transition={{ type: "tween", ease: "linear" }}
                    />
                </div>

                <div className=" rounded-3xl border shadow-sm bg-white">
                    <svg viewBox={`0 0 ${size} ${size}`} width="100%" height="100%" role="img" aria-label={`Complete graph with ${n} nodes`}>
                        {/* Edges */}
                        <g>
                            {edges.slice(0, k).map(([i, j], idx) => {
                                const a = pts[i];
                                const b = pts[j];
                                return (
                                    <motion.line
                                        key={`e-${i}-${j}`}
                                        x1={a.x}
                                        y1={a.y}
                                        x2={b.x}
                                        y2={b.y}
                                        strokeWidth={1}
                                        stroke="#1f2937"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 0.7 }}
                                        transition={{ duration: 0.12, delay: Math.min(idx, 8) * 0.002 }}
                                    />
                                );
                            })}
                        </g>

                        {/* Nodes */}
                        <g>
                            {pts.map((p, i) => (
                                <AnimatePresence key={`n-${i}`}>
                                    <motion.circle suppressHydrationWarning
                                        cx={p.x}
                                        cy={p.y}
                                        r={6}
                                        stroke="#111827"
                                        strokeWidth={1}
                                        fill="#ffffff"
                                        initial={{ scale: 0, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ type: "spring", stiffness: 240, damping: 20 }}
                                    />
                                </AnimatePresence>
                            ))}
                        </g>

                        {/* Optional labels (small to avoid clutter) */}
                        <g>
                            {pts.map((p, i) => (
                                <text suppressHydrationWarning key={`t-${i}`} x={p.x} y={p.y - 12} fontSize={10} textAnchor="middle" fill="#374151">
                                    {i + 1}
                                </text>
                            ))}
                        </g>
                    </svg>
                </div>
            </div>
        </div>
    );
}
