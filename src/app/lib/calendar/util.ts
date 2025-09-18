
/**
* Generate a random set of birthdays for a given year.
*/

export type BirthdaysByMonth = Record<number, Record<number, number>>

export function generateBirthdays(n: number, year: number) {
    const isLeap = new Date(year, 1, 29).getMonth() === 1; // Feb has 29
    const daysInYear = isLeap ? 366 : 365;

    const byMonth: BirthdaysByMonth = {};


    for (let i = 0; i < n; i++) {
        const dOY = Math.floor(Math.random() * daysInYear); // 0..daysInYear-1
        const date = new Date(year, 0, 1);
        date.setDate(date.getDate() + dOY);
        const m = date.getMonth(); // 0..11
        const d = date.getDate(); // 1..31


        if (!byMonth[m]) byMonth[m] = {};
        byMonth[m][d] = (byMonth[m][d] || 0) + 1;
    }
    return byMonth;
}



export function getColorClass(index: number) {
    const mod = index % 4;
    return (
        {
            0: "bg-purple-200/60",
            1: "bg-sky-200/60",
            2: "bg-lime-200/60",
            3: "bg-orange-200/60",
        } as const
    )[mod];
}


export function collisionProbability(n: number) {
    let p = 1;
    for (let i = 1; i < n; i++) p *= (365 - i) / 365;
    return 1 - p;
}
