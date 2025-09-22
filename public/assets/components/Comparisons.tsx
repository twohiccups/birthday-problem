'use client'

import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

function calculateComparisons(n: number) {
    return (n * (n - 1)) / 2;
}


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

function allEdges(n: number): Array<[number, number]> {
    const edges: Array<[number, number]> = [];
    for (let i = 0; i < n; i++) {
        for (let j = i + 1; j < n; j++) {
            edges.push([i, j]);
        }
    }
    return edges;
}

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
    const [playing, setPlaying] = useState(false);
    const [eps, setEps] = useState(40); // edges per second

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

    useEffect(() => {
        if (k >= edges.length && playing) setPlaying(false);
    }, [k, edges.length, playing]);

    const progress = Math.min(1, k / Math.max(1, edges.length));

    return (
        <div className="w-full mx-auto" ref={wrapRef}>
            <h2 className="my-6 text-center ">Comparisons Demo</h2>

            {/* Controls */}
            <div className="mb-4">
                <div className="flex flex-wrap items-center gap-3 sm:gap-4 py-1">

                    {/* Play / Pause */}
                    <button
                        className="px-3 py-1.5 rounded-2xl shadow-sm border hover:shadow transition min-w-20 shrink-0"
                        onClick={() => setPlaying((p) => !p)}
                        aria-label={playing ? "Pause" : "Play"}
                    >
                        {playing ? "Pause" : "Play"}
                    </button>

                    {/* Reset */}
                    <button
                        className="px-3 py-1.5 rounded-2xl shadow-sm border hover:shadow transition shrink-0"
                        onClick={() => {
                            setK(0);
                            setPlaying(false);
                        }}
                    >
                        Reset
                    </button>

                    {/* People input */}
                    <div className="flex flex-col items-start font-lexend-deca relative shrink-0">
                        <label
                            className="text-sm absolute -top-5 left-0 px-1"
                            htmlFor="comparisons-n"
                        >
                            People
                        </label>
                        <input
                            id="comparisons-n"
                            type="number"
                            className="h-9 w-24 rounded-md border border-neutral-300 px-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
                            min={2}
                            max={40}
                            value={n}
                            onChange={(e) => {
                                const nv = Math.max(2, Math.min(40, parseInt(e.target.value || "2", 10)));
                                setN(nv);
                                setK(0);
                            }}
                        />
                    </div>

                    {/* Speed slider */}
                    <div className="flex items-center gap-2 grow basis-full sm:basis-auto sm:grow-0">
                        <label className="text-sm" htmlFor="eps">Speed</label>
                        <input
                            id="eps"
                            type="range"
                            min={5}
                            max={120}
                            step={1}
                            value={eps}
                            onChange={(e) => setEps(parseInt(e.target.value, 10))}
                            className="w-full sm:w-56"
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

                {/* Chart Card */}
                <div className="relative rounded-3xl border shadow-sm bg-white">
                    <div
                        className="font-lexend-deca absolute top-2 left-2 z-10 rounded-full border bg-white/90 backdrop-blur px-3 py-1 text-xs font-medium text-gray-800 shadow-sm"
                        aria-live="polite"
                    >
                        Total comparisons: {total}
                    </div>

                    <svg
                        viewBox={`0 0 ${size} ${size}`}
                        width="100%"
                        height="100%"
                        role="img"
                        aria-label={`Complete graph with ${n} nodes and ${total} comparisons`}
                    >
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
                                    <motion.circle
                                        suppressHydrationWarning
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

                        <g>
                            {pts.map((p, i) => (
                                <text
                                    suppressHydrationWarning
                                    key={`t-${i}`}
                                    x={p.x}
                                    y={p.y - 12}
                                    fontSize={10}
                                    textAnchor="middle"
                                    fill="#374151"
                                >
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
