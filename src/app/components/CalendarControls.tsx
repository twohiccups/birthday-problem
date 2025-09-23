"use client";
import React from "react";
import Button from "./Button";
import NumberField from "./NumberField";

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
        <div className="w-full rounded-xl border-3 border-neutral-200 p-2 sm:p-4 font-lexend-deca">
            <div className="
        flex flex-wrap items-end gap-2 sm:gap-4
        md:grid md:grid-cols-[auto,1fr,auto] md:items-end md:gap-4
      ">
                {/* Input */}
                <div className="min-w-[160px]">
                    <NumberField
                        id="n"
                        label="People"
                        value={n}
                        min={1}
                        max={10000}
                        onCommit={(v) => setN(v)}
                        describedById="n-help"
                    />
                </div>

                {/* Spacer for desktop (keeps buttons to the right) */}
                <div className="hidden md:block" />

                {/* Buttons */}
                <div className="flex items-center gap-2 md:justify-end md:flex-nowrap">
                    <Button onClick={onRoll}>Roll</Button>
                    <Button onClick={() => onMultiRoll(10)}>x10</Button>
                    <Button onClick={() => onMultiRoll(100)}>x100</Button>
                </div>

                {/* Helper text on its own row, full width */}
                <p id="n-help" className="mt-1 text-[10px] sm:text-xs md:col-span-3">
                    Try 23 or 50
                </p>
            </div>
        </div>
    );
}
