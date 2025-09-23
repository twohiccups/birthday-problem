"use client";
import { useState, useCallback, useEffect } from "react";
import Month from "./Month";
import {
    BirthdaysByMonth,
    collisionProbability,
    generateBirthdays,
    getColorClass,
    getMaxOnADay,
    getTotalSharedDays,
    yearHasCollision,
} from "@/app/lib/calendar/util";
import CalendarControls from "./CalendarControls";

function CalendarGrid({ year, birthdaysByMonth }: { year: number; birthdaysByMonth: BirthdaysByMonth }) {
    return (
        <div
            className="
    sm:w-max
    origin-top-left
    grid grid-cols-[repeat(4,theme(width.32))] 
    sm:grid-cols-[repeat(4,theme(width.56))]
    gap-x-5 sm:gap-x-2 gap-y-1 sm:gap-y-4 justify-start
  "
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


function Stat({ label, value, sublabel }: { label: string; value: string; sublabel?: string }) {
    return (
        <div className="rounded-2xl p-3 shadow-sm">
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

    const totalSharedDays = getTotalSharedDays(birthdaysByMonth);
    const maxOnADay = getMaxOnADay(birthdaysByMonth);
    const theoreticalP = collisionProbability(n);
    const empiricalP = totalNumRolls > 0 ? numRollsWithCollision / totalNumRolls : 0


    useEffect(() => {
        setNumRollsWithCollision(0);
        setTotalNumRolls(0);
    }, [n])


    function roll() {
        const sample = generateBirthdays(n, YEAR);
        setBirthdaysByMonth(sample);
        setTotalNumRolls((t) => t + 1);
        if (yearHasCollision(sample)) {
            setNumRollsWithCollision((c) => c + 1)
        }
    };

    const multiRoll = useCallback(
        (times: number) => {
            let localCollisions = 0;
            let last: BirthdaysByMonth | null = null;
            for (let i = 0; i < times; i++) {
                const s = generateBirthdays(n, YEAR);
                if (yearHasCollision(s)) localCollisions++;
                last = s;
            }
            if (last) setBirthdaysByMonth(last);
            setTotalNumRolls((t) => t + times);
            setNumRollsWithCollision((c) => c + localCollisions);
        },
        [n]
    );

    return (
        <section className="px-4 space-y-10">
            <h2 className="text-center">Birthday Simulator</h2>
            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_24rem] xl:grid-cols-[minmax(0,1fr)_26rem]">
                <div className="min-w-0 order-2 md:order-1 overflow-x-scroll">
                    <CalendarGrid year={YEAR} birthdaysByMonth={birthdaysByMonth} />
                </div>
                <aside
                    className="order-1 md:order-2
                        min-w-0 lg:min-w-[24rem] xl:min-w-[26rem]
                        w-full lg:w-auto rounded-2xl shadow-sm"
                    aria-label="Controls and statistics"
                >
                    <h3 className="text-justify">Click &quot;Roll&quot; to generate a random set of birthdays. Collisions will be marked with red color.</h3>
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
