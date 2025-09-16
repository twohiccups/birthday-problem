// app/components/Month.tsx

type MonthProps = {
    month: number;
    year: number;
    colorClass?: string;
};

const MONTH_NAMES = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
];



const WEEKDAYS_SHORT = ["S", "M", "T", "W", "T", "F", "S"];

export default function Month({ month, year, colorClass = 'bg-blue-100' }: MonthProps) {
    const firstDayIndex = new Date(year, month, 1).getDay(); // 0=Sun … 6=Sat
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const leading = Array.from({ length: firstDayIndex }, () => null);
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    const cells = [...leading, ...days];
    while (cells.length % 7 !== 0) cells.push(null);

    const weeks: (number | null)[][] = [];
    for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));

    return (
        <div
            className="font-ultra inline-block select-none rounded-md border border-neutral-200 bg-white
             text-neutral-900 shadow-sm w-56"
            aria-label={`${MONTH_NAMES[month]} ${year}`}
        >
            {/* Header */}
            <div className={`text-center font-semibold tracking-wide text-neutral-900 py-2 rounded-t-md ${colorClass ? colorClass : 'bg-blue-100'} `}>
                {MONTH_NAMES[month].toUpperCase()}
            </div>

            {/* Weekday row */}
            <div className="grid grid-cols-7 text-center text-xs text-neutral-600 gap-y-1 px-2 pt-2">
                {WEEKDAYS_SHORT.map((d, i) => (
                    <div key={`${d}-${i}`} className="font-semibold">
                        {d}
                    </div>
                ))
                }
            </div >

            {/* Dates grid */}
            < div className="grid grid-cols-7 text-center text-sm px-1 pb-1" >
                {
                    weeks.map((week, wi) =>
                        week.map((day, di) => {
                            const base = "h-7 flex items-center justify-center";
                            const visible = day == null ? " text-transparent" : " text-neutral-900";

                            return (
                                <div
                                    key={`${wi}-${di}`}
                                    className={base + visible}
                                    aria-hidden={day == null}
                                    aria-label={
                                        day == null ? undefined : `${MONTH_NAMES[month]} ${day}, ${year}`
                                    }
                                >
                                    {day ?? "•"}
                                </div>
                            );
                        })
                    )
                }
            </div >
        </div >
    );
}
