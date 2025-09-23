import { ReactNode } from "react";

export function FormulaDiv({ children }: { children: ReactNode }) {
    return (
        <div className="flex justify-center p-4 border-1 border-dashed">{children}</div>
    )
}