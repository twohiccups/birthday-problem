"use client";
import React from "react";
import Button from "./Button";

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
        <div className="flex flex-wrap items-end gap-2 sm:gap-4 rounded-xl border-3 border-neutral-200 p-2 sm:p-4 font-lexend-deca w-full">
            <div className="flex-1 min-w-[120px]">
                <label htmlFor="n" className="block text-xs sm:text-sm font-medium">
                    People
                </label>
                <input
                    id="n"
                    type="number"
                    min={1}
                    max={10000}
                    value={n}
                    onChange={(e) =>
                        setN(Math.max(1, Math.min(10000, Number(e.target.value))))
                    }
                    className="mt-1 w-full sm:w-40 rounded-md border-3 border-neutral-300 px-2 py-1.5 sm:px-3 sm:py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-400 text-sm"
                    aria-describedby="n-help"
                />
                <p id="n-help" className="mt-1 text-[10px] sm:text-xs">
                    Try 23 or 50.
                </p>
            </div>

            <div className="flex items-center gap-1 sm:gap-2">
                <Button
                    onClick={onRoll}> Roll
                </Button>
                <Button
                    onClick={() => onMultiRoll(10)}>
                    x10
                </Button>
                <Button
                    onClick={() => onMultiRoll(100)}>
                    x100
                </Button>

            </div>
        </div >
    );
}
