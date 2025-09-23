import { ReactNode } from "react";

export default function Section({ children, className }: { children: ReactNode; className?: string }) {
    return (
        <section
            className={[
                className || ""
            ].join(" ")}
        >
            <div className="px-3 w-full">{children}</div>
        </section>
    );
}
