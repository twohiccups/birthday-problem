"use client";
import Month from "./Month";

export default function Calendar({ year }: { year: number }) {

    function getColorClass(index: number) {
        const mod = index % 4
        return {
            0: 'bg-purple-200/60',
            1: 'bg-sky-200/60',
            2: 'bg-lime-200/60',
            3: 'bg-orange-200/60'
        }[mod]
    }
    const months = Array.from({ length: 12 }, (_, i) => i); // 0..11

    return (
        <div className="w-full">
            {/* Title */}
            <h2 className="text-2xl font-bold tracking-tight text-neutral-900 mb-4">
                {year} Calendar
            </h2>

            <div
                className="grid gap-4 grid-cols-4"
                role="grid"
                aria-label={`All months for ${year}`}
            >
                {months.map((m, i) => (
                    <Month key={m} month={m} year={year} colorClass={getColorClass(i)} />
                ))}
            </div>
        </div>
    );
}
