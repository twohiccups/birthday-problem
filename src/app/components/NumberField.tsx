"use client";
import React from "react";

/**
 * NumberField — mobile-friendly numeric input with unified behavior.
 *
 * Unified rule for all devices:
 *  - While typing: allow empty/partial digits. If the draft is parseable and within [min, max],
 *    call onCommit(draftNumber) immediately (no clamping yet).
 *  - On blur/Enter: clamp to [min, max] and commit the final value.
 */

export interface NumberFieldProps {
    id: string;
    label?: string;
    value: number;
    onCommit: (next: number) => void;
    min?: number;
    max?: number;
    step?: number;
    className?: string;
    inputClassName?: string;
    disabled?: boolean;
    steppers?: boolean;
    describedById?: string;
}

export default function NumberField({
    id,
    label,
    value,
    onCommit,
    min = Number.NEGATIVE_INFINITY,
    max = Number.POSITIVE_INFINITY,
    step = 1,
    className = "",
    inputClassName = "",
    disabled = false,
    steppers = false,
    describedById,
}: NumberFieldProps) {
    const [draft, setDraft] = React.useState<string>(String(value));
    const [focused, setFocused] = React.useState(false);
    const lastCommitted = React.useRef<number>(value);

    // Keep draft in sync when value changes from outside and we're not actively editing
    React.useEffect(() => {
        if (!focused) setDraft(String(value));
        lastCommitted.current = value;
    }, [value, focused]);

    function clampInt(n: number) {
        if (Number.isNaN(n)) return Number.isFinite(min) ? Math.max(0, Math.ceil(min)) : 0;
        return Math.max(min, Math.min(max, Math.round(n)));
    }

    function commitFromDraft() {
        const n = draft.trim() === "" ? lastCommitted.current : parseInt(draft, 10);
        const clamped = clampInt(n);
        if (clamped !== lastCommitted.current) onCommit(clamped);
        setDraft(String(clamped));
    }

    function increment(dir: 1 | -1) {
        const base = focused ? (draft.trim() === "" ? lastCommitted.current : parseInt(draft, 10)) : value;
        const next = clampInt((Number.isNaN(base) ? 0 : base) + dir * step);
        setDraft(String(next));
        onCommit(next);
    }

    return (
        <div className={`flex flex-col items-start font-lexend-deca relative ${className}`}>
            {label && (
                <label htmlFor={id} className="block text-xs sm:text-sm font-medium">
                    {label}
                </label>
            )}

            <div className="flex items-center gap-2">
                <input
                    id={id}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    autoComplete="off"
                    autoCorrect="off"
                    enterKeyHint="done"
                    spellCheck={false}
                    className={`mt-1 h-10 w-24 rounded-md border-3 border-neutral-300 px-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-400 text-sm ${inputClassName}`}
                    aria-describedby={describedById}
                    value={draft}
                    disabled={disabled}
                    onFocus={() => setFocused(true)}
                    onBlur={() => {
                        setFocused(false);
                        commitFromDraft();
                    }}
                    onChange={(e) => {
                        const next = e.target.value;
                        // Allow empty and digits only; ignore other characters
                        if (next === "" || /^\d+$/.test(next)) {
                            setDraft(next);
                            // Unified live-commit: only if parseable and within [min, max]
                            if (next !== "") {
                                const n = parseInt(next, 10);
                                if (!Number.isNaN(n) && n >= min && n <= max) {
                                    onCommit(n); // do not clamp here; clamp happens on blur/Enter
                                }
                            }
                        }
                    }}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            e.currentTarget.blur(); // commit via onBlur
                        } else if (e.key === "Escape") {
                            // revert to last committed
                            setDraft(String(lastCommitted.current));
                            e.currentTarget.blur();
                        }
                    }}
                    onWheel={(e) => {
                        // Prevent scroll from changing value on desktop trackpads
                        (e.target as HTMLElement).blur();
                    }}
                />

                {steppers && (
                    <div className="flex items-center gap-1">
                        <button
                            type="button"
                            className="h-9 px-2 rounded-md border-2 border-neutral-300 text-sm"
                            onClick={() => increment(-1)}
                            disabled={disabled || value <= min}
                            aria-label="Decrement"
                        >
                            −
                        </button>
                        <button
                            type="button"
                            className="h-9 px-2 rounded-md border-2 border-neutral-300 text-sm"
                            onClick={() => increment(1)}
                            disabled={disabled || value >= max}
                            aria-label="Increment"
                        >
                            +
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
