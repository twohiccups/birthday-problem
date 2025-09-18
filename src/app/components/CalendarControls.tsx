"use client";
import React from "react";

export default function CalendarControls({
    n,
    setN,
    onRoll,
    onMultiRoll,
}: {
    n: number;
    setN: (n: number) => void;
    onRoll: () => void;
    onMultiRoll: (times: number) => void;
}) {
    return (
        <div className="flex flex-wrap items-end gap-4 border-6 rounded-xl  border-neutral-200 p-4">
            <div>
                <label htmlFor="n" className="block text-sm font-medium">
                    Number of people
                </label>
                <input
                    id="n"
                    type="number"
                    min={1}
                    max={10000}
                    value={n}
                    onChange={(e) => setN(Math.max(1, Math.min(10000, Number(e.target.value))))}
                    className="mt-1 w-40 rounded-md border border-neutral-300 px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
                    aria-describedby="n-help"
                />
                <p id="n-help" className="mt-1 text-xs">
                    Try classic values like 23 or 50.
                </p>
            </div>

            <div className="flex items-center gap-2">
                <button
                    type="button"
                    className="rounded-lg border border-neutral-300 px-4 py-2 shadow-sm hover:bg-neutral-50 active:scale-[.99]"
                    aria-label="Generate a new random set of birthdays"
                    onClick={onRoll}
                >
                    Roll
                </button>
                <button
                    type="button"
                    className="rounded-lg border border-neutral-300 px-3 py-2 shadow-sm hover:bg-neutral-50 active:scale-[.99]"
                    onClick={() => onMultiRoll(10)}
                    aria-label="Run 10 rolls"
                >
                    ×10
                </button>
                <button
                    type="button"
                    className="rounded-lg border border-neutral-300 px-3 py-2 shadow-sm hover:bg-neutral-50 active:scale-[.99]"
                    onClick={() => onMultiRoll(100)}
                    aria-label="Run 100 rolls"
                >
                    ×100
                </button>
                <button
                    type="button"
                    className="rounded-lg border border-neutral-300 px-3 py-2 shadow-sm hover:bg-neutral-50 active:scale-[.99]"
                    onClick={() => onMultiRoll(1000)}
                    aria-label="Run 1000 rolls"
                >
                    ×1000
                </button>
            </div>
        </div>
    );
}
