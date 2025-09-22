import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";

// ------------------------------
// DigitReel: a single rolling digit
// ------------------------------
function DigitReel({
    targetDigit,
    cycles = 3,
    duration = 1.2,
    delay = 0,
    spinId = 0,
}) {
    const wrapperRef = useRef(null);
    const [digitH, setDigitH] = useState(0);

    // Measure the digit height once mounted (so translation equals exact pixel height)
    useEffect(() => {
        if (!wrapperRef.current) return;
        const el = wrapperRef.current.querySelector(".digit");
        if (el) setDigitH(el.getBoundingClientRect().height);
    }, [spinId]);

    // Build the reel digits (0-9 repeated `cycles` times) + final target
    const sequence = useMemo(() => {
        const full = [];
        const total = cycles * 10 + (Number(targetDigit) % 10) + 1; // +1 to land on the target
        for (let i = 0; i < total; i++) full.push(i % 10);
        return full;
    }, [targetDigit, cycles]);

    // Final translateY so the last digit in the stack is perfectly centered
    const finalY = useMemo(() => {
        const steps = sequence.length - 1;
        return -steps * digitH;
    }, [sequence, digitH]);

    return (
        <div
            ref={wrapperRef}
            className="relative w-12 sm:w-14 md:w-16 h-16 sm:h-20 md:h-24 overflow-hidden select-none rounded-xl bg-white/60 dark:bg-white/5 shadow-inner border border-black/5 backdrop-blur flex items-center justify-center"
        >
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/5 via-transparent to-black/5" />

            {/* Reel */}
            <motion.div
                key={spinId + "-reel"}
                initial={{ y: 0 }}
                animate={{ y: finalY }}
                transition={{
                    duration,
                    delay,
                    ease: [0.15, 0.85, 0.15, 1],
                }}
                className="will-change-transform"
            >
                {sequence.map((d, idx) => (
                    <div
                        key={idx}
                        className="digit h-16 sm:h-20 md:h-24 flex items-center justify-center font-mono text-3xl sm:text-4xl md:text-5xl font-semibold text-gray-900 dark:text-gray-100"
                    >
                        {d}
                    </div>
                ))}
            </motion.div>
        </div>
    );
}

// ------------------------------
// CombinationLock component
// ------------------------------
export function CombinationLock({
    value = "1234",
    cycles = 3,
    durationPerDigit = 1.1,
    stagger = 0.15,
    spinId = 0,
}) {
    const digits = String(value).replace(/\D/g, "").split("");
    return (
        <div className="inline-flex gap-2 p-2 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 border border-black/10 shadow-xl">
            {digits.map((d, i) => (
                <DigitReel
                    key={`${spinId}-${i}-${d}`}
                    targetDigit={Number(d)}
                    cycles={cycles}
                    duration={durationPerDigit + i * 0.05}
                    delay={i * stagger}
                    spinId={spinId}
                />
            ))}
        </div>
    );
}

// ------------------------------
// Demo: default export with controls
// ------------------------------
export default function DemoCombinationLock() {
    const [target, setTarget] = useState("4279");
    const [cycles, setCycles] = useState(4);
    const [stagger, setStagger] = useState(0.12);
    const [speed, setSpeed] = useState(1.1); // duration per digit
    const [spinId, setSpinId] = useState(0);

    function spin() {
        // changing spinId retriggers animations across reels
        setSpinId((s) => s + 1);
    }

    return (
        <div className="min-h-[60vh] w-full flex items-center justify-center p-6 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-50 via-white to-transparent dark:from-indigo-950 dark:via-slate-950">
            <div className="w-full max-w-3xl">
                <div className="flex items-center gap-3 mb-6">
                    <h1 className="text-2xl font-bold tracking-tight">Combination Lock</h1>
                </div>

                <div className="flex items-center gap-3 flex-wrap mb-5">
                    <input
                        value={target}
                        onChange={(e) => setTarget(e.target.value)}
                        className="px-3 py-2 rounded-xl border bg-white/70 dark:bg-slate-900/60 border-black/10 font-mono"
                        placeholder="Enter digits e.g. 1234"
                    />

                    <label className="text-sm opacity-80">Cycles</label>
                    <input
                        type="number"
                        min={1}
                        max={10}
                        value={cycles}
                        onChange={(e) => setCycles(parseInt(e.target.value || "1", 10))}
                        className="w-20 px-3 py-2 rounded-xl border bg-white/70 dark:bg-slate-900/60 border-black/10"
                    />

                    <label className="text-sm opacity-80">Stagger</label>
                    <input
                        type="number"
                        step="0.01"
                        value={stagger}
                        onChange={(e) => setStagger(parseFloat(e.target.value || "0"))}
                        className="w-24 px-3 py-2 rounded-xl border bg-white/70 dark:bg-slate-900/60 border-black/10"
                    />

                    <label className="text-sm opacity-80">Duration / digit</label>
                    <input
                        type="number"
                        step="0.05"
                        value={speed}
                        onChange={(e) => setSpeed(parseFloat(e.target.value || "1.1"))}
                        className="w-28 px-3 py-2 rounded-xl border bg-white/70 dark:bg-slate-900/60 border-black/10"
                    />

                    <button
                        onClick={spin}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-indigo-600 text-white font-medium shadow hover:opacity-90 active:translate-y-px"
                    >
                    </button>
                </div>

                <CombinationLock
                    value={target}
                    cycles={cycles}
                    stagger={stagger}
                    durationPerDigit={speed}
                    spinId={spinId}
                />

                <p className="mt-6 text-sm opacity-70">
                    Tip: change the value and press <span className="font-medium">Spin</span> to animate the reels.
                    You can control how many full cycles each reel does and how much stagger there is between digits.
                </p>

                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm opacity-80">
                    <div>
                        <h3 className="font-semibold mb-1">Use in your app</h3>
                        <pre className="bg-black/5 dark:bg-white/5 rounded-xl p-3 overflow-auto text-xs">
                            {`import { CombinationLock } from "./CombinationLock";

<CombinationLock
  value="1234"
  cycles={3}
  durationPerDigit={1.1}
  stagger={0.15}
  spinId={someChangingNumber}
/>`}
                        </pre>
                    </div>
                    <div>
                        <h3 className="font-semibold mb-1">Notes</h3>
                        <ul className="list-disc pl-4">
                            <li>Pure client-side animation using Framer Motion.</li>
                            <li>Exact pixel measurement ensures the reel stops perfectly on the target digit.</li>
                            <li>Change <code>spinId</code> (e.g., increment it) to retrigger the animation.</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
