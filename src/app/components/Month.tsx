// app/components/Month.tsx
import { BirthdayCountForMonth } from "../lib/calendar/types";
import { AnimatePresence, motion } from "framer-motion";
import { useMemo } from "react";

export type MonthProps = {
    month: number;
    year: number;
    colorClass?: string;
    birthdaysForMonth?: BirthdayCountForMonth;
};

const MONTH_NAMES = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
];

const WEEKDAYS_SHORT = ["S", "M", "T", "W", "T", "F", "S"];

// Tiny, stable hash to distribute days into 5 phases
function phaseIndex(day: number, month: number, year: number, phases = 5) {
    // Simple LCG-ish mix to keep it deterministic but spread out
    let h = (day + 31 * (month + 12 * year)) >>> 0;
    h ^= (h << 13) ^ (h >>> 17) ^ (h << 5);
    return Math.abs(h) % phases;
}

export default function Month({
    month,
    year,
    colorClass = "bg-blue-100",
    birthdaysForMonth = {},
}: MonthProps) {
    const firstDayIndex = new Date(year, month, 1).getDay(); // 0=Sun … 6=Sat
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const leading = Array.from({ length: firstDayIndex }, () => null);
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    const cells = [...leading, ...days];
    while (cells.length % 7 !== 0) cells.push(null);

    const weeks: (number | null)[][] = [];
    for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));

    const collisions = Object.entries(birthdaysForMonth).filter(([_, c]) => c > 1).length;

    // Precompute phase delays for all highlighted days
    const delayMap = useMemo(() => {
        const map = new Map<number, number>();
        const PHASES = 4;
        const BASE_DELAY = 0.03;
        for (const d of Object.keys(birthdaysForMonth)) {
            const dayNum = Number(d);
            if (!Number.isFinite(dayNum)) continue;
            const phase = phaseIndex(dayNum, month, year, PHASES);
            map.set(dayNum, phase * BASE_DELAY);
        }
        return map;
    }, [birthdaysForMonth, month, year]);

    // A key that bumps when the highlight set changes — replays the wave
    const waveKey = useMemo(() => {
        const highlighted = Object.entries(birthdaysForMonth)
            .filter(([_, c]) => c > 0)
            .map(([d]) => d)
            .sort()
            .join(",");
        return `${year}-${month}-${highlighted}`;
    }, [birthdaysForMonth, month, year]);

    return (
        <div
            className="inline-block select-none rounded-md border border-neutral-200 bg-white text-neutral-900 shadow-sm w-56"
            aria-label={`${MONTH_NAMES[month]} ${year}`}
            role="group"
        >
            {/* Header */}
            <div
                className={`relative text-center font-semibold tracking-wide text-neutral-900 py-2 rounded-t-md ${colorClass}`}
            >
                <span>{MONTH_NAMES[month].toUpperCase()}</span>

                <AnimatePresence>
                    {collisions > 0 && (
                        <motion.span
                            key={`collision-badge-${waveKey}`}
                            initial={{ scale: 0.6, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                            className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex h-5 min-w-5 items-center justify-center rounded-full border border-red-400 bg-red-100 px-1 text-xs font-bold text-red-700"
                            aria-label={`${collisions} day(s) in ${MONTH_NAMES[month]} have collisions`}
                            title={`${collisions} day(s) have collisions`}
                        >
                            {collisions}
                        </motion.span>
                    )}
                </AnimatePresence>
            </div>

            {/* Weekday row */}
            <div className="grid grid-cols-7 text-center text-xs text-neutral-600 gap-y-1 px-2 pt-2">
                {WEEKDAYS_SHORT.map((d, i) => (
                    <div key={`${d}-${i}`} className="font-semibold">
                        {d}
                    </div>
                ))}
            </div>

            {/* Dates grid */}
            <div className="grid grid-cols-7 text-center text-sm px-1 pb-1">
                {weeks.map((week, wi) =>
                    week.map((day, di) => {
                        const hidden = day == null;
                        const count = hidden ? 0 : birthdaysForMonth[day] || 0;

                        const aria = hidden
                            ? { "aria-hidden": true as const }
                            : {
                                "aria-label": `${MONTH_NAMES[month]} ${day}, ${year}${count > 0 ? ` — ${count} birthday${count > 1 ? "s" : ""}` : ""
                                    }`,
                                role: "gridcell",
                            };

                        const highlightColor = count > 1 ? "bg-red-500" : "bg-sky-500";

                        // Phase delay for this cell (0..4) * 30ms — makes 5 “stages”
                        const delay = !hidden && count > 0 ? (delayMap.get(day!) ?? 0) : 0;

                        return (
                            <div
                                key={`${wi}-${di}`}
                                className={`relative h-7 flex items-center justify-center ${hidden ? "text-transparent" : "text-neutral-900"
                                    }`}
                                {...aria}
                            >
                                <AnimatePresence mode="popLayout">
                                    {count > 0 && !hidden && (
                                        <motion.div
                                            key={`hl-${waveKey}-${day}`}
                                            className={`absolute inset-0 rounded-md ${highlightColor}`}
                                            initial={{ scale: 0.6, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            exit={{ scale: 0.9, opacity: 0 }}
                                            transition={{
                                                type: "spring",
                                                stiffness: 260,
                                                damping: 18,
                                                mass: 0.3,
                                                delay,
                                            }}
                                            aria-hidden="true"
                                        />
                                    )}
                                </AnimatePresence>

                                <span className={`relative z-10 ${count > 0 ? "text-black font-medium" : ""}`}>
                                    {hidden ? "•" : day}
                                </span>

                                <AnimatePresence>
                                    {!hidden && count > 1 && (
                                        <motion.span
                                            key={`badge-${waveKey}-${day}`}
                                            initial={{ y: -6, opacity: 0, scale: 0.8 }}
                                            animate={{ y: 0, opacity: 1, scale: 1 }}
                                            exit={{ y: -6, opacity: 0, scale: 0.8 }}
                                            transition={{ type: "spring", stiffness: 350, damping: 18, delay }}
                                            className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full border border-white bg-red-600 text-[10px] font-bold text-white shadow"
                                            aria-label={`${count} birthdays`}
                                        >
                                            {count}
                                        </motion.span>
                                    )}
                                </AnimatePresence>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
