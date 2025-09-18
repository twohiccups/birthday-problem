"use client";
import { useMemo, useState, useCallback, useEffect } from "react";
import Month from "./Month";
import {
    BirthdaysByMonth,
    collisionProbability,
    generateBirthdays,
    getColorClass,
} from "../lib/calendar/util";
import CalendarControls from "./CalendarControls";

// --- Presentational calendar (no state) ---
function CalendarGrid({
    year,
    birthdaysByMonth,
}: {
    year: number;
    birthdaysByMonth: BirthdaysByMonth;
}) {
    return (
        <div
            className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            role="grid"
            aria-label={`All months for ${year}`}
        >
            {Array.from({ length: 12 }, (_, m) => (
                <Month
                    key={m}
                    month={m}
                    year={year}
                    colorClass={getColorClass(m)}
                    birthdaysForMonth={birthdaysByMonth[m] || {}}
                />
            ))}
        </div>
    );
}

// --- Helper: check for any duplicates ---
function hasCollision(bm: BirthdaysByMonth): boolean {
    for (const month of Object.values(bm)) {
        for (const count of Object.values(month)) if (count > 1) return true;
    }
    return false;
}

// --- Stats UI ---
function Stat({ label, value, sublabel }: { label: string; value: string; sublabel?: string }) {
    return (
        <div className="rounded-2xl  p-3 shadow-sm">
            <div className="text-xs uppercase tracking-wide ">{label}</div>
            <div className="mt-1 text-2xl font-semibold tabular-nums">{value}</div>
            {sublabel ? (
                <div className="mt-1 text-xs">{sublabel}</div>
            ) : null}
        </div>
    );
}

export default function BirthdayParadoxSection() {
    const YEAR = 2025;
    const [n, setN] = useState<number>(23);
    const [birthdaysByMonth, setBirthdaysByMonth] = useState<BirthdaysByMonth>({});

    const [numRollsWithCollision, setNumRollsWithCollision] = useState<number>(0);
    const [totalNumRolls, setTotalNumRolls] = useState<number>(0);

    const totalSharedDays = useMemo(
        () =>
            Object.values(birthdaysByMonth).reduce(
                (acc, month) => acc + Object.values(month).filter((c) => c > 1).length,
                0
            ),
        [birthdaysByMonth]
    );

    const maxOnADay = useMemo(
        () =>
            Object.values(birthdaysByMonth).reduce(
                (acc, month) => Math.max(acc, ...Object.values(month), 0),
                0
            ),
        [birthdaysByMonth]
    );

    const theoreticalP = useMemo(() => collisionProbability(n), [n]);

    const empiricalP = useMemo(() => {
        return (totalNumRolls > 0 ? numRollsWithCollision / totalNumRolls : 0)
    }, [totalNumRolls, numRollsWithCollision])


    useEffect(() => {
        setNumRollsWithCollision(0);
        setTotalNumRolls(0);
    }, [n])


    function roll() {
        const sample = generateBirthdays(n, YEAR);
        setBirthdaysByMonth(sample);
        setTotalNumRolls((t) => t + 1);
        if (hasCollision(sample)) {
            setNumRollsWithCollision((c) => c + 1)
        }
    };

    const multiRoll = useCallback(
        (times: number) => {
            let localCollisions = 0;
            let last: BirthdaysByMonth | null = null;
            for (let i = 0; i < times; i++) {
                const s = generateBirthdays(n, YEAR);
                if (hasCollision(s)) localCollisions++;
                last = s;
            }
            if (last) setBirthdaysByMonth(last);
            setTotalNumRolls((t) => t + times);
            setNumRollsWithCollision((c) => c + localCollisions);
        },
        [n]
    );

    return (
        <section className="px-4">
            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_24rem] xl:grid-cols-[minmax(0,1fr)_26rem]">
                <div className="min-w-0">
                    <CalendarGrid year={YEAR} birthdaysByMonth={birthdaysByMonth} />
                </div>

                <aside
                    className="min-w-[24rem] xl:min-w-[26rem] rounded-2xl  p-5 shadow-sm"
                    aria-label="Controls and statistics"
                >
                    <h2 className="my-6">Try yourself</h2>
                    <h3 className="">Click roll to generate a random set of birthdays. See the </h3>
                    <div className="mt-4">
                        <CalendarControls n={n} setN={setN} onRoll={roll} onMultiRoll={multiRoll} />
                    </div>

                    <div className="mt-5 space-y-4 font-lexend-deca">
                        <div>
                            <div className="mt-2 grid grid-cols-2 gap-2">
                                <div className="border-6 rounded-xl">
                                    <Stat label="Empirical P" value={`${(empiricalP * 100).toFixed(2)}%`} sublabel={`(${numRollsWithCollision}/${totalNumRolls} runs)`} />
                                </div>
                                <div className="border-6 rounded-xl">
                                    <Stat label="Theoretical P" value={`${(theoreticalP * 100).toFixed(2)}%`} />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                            <div className="border-6 rounded-xl">
                                <Stat label="Shared days" value={`${totalSharedDays}`} sublabel="Days with ≥2 birthdays" />
                            </div>
                            <div className="border-6 rounded-xl">
                                <Stat label="Max on a day" value={`${maxOnADay}`} sublabel="Largest same‑day crowd" />
                            </div>
                        </div>
                    </div>
                </aside>
            </div>
        </section>
    );
}
