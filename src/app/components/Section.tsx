import { ReactNode } from "react";

export default function Section({ children, className }: { children: ReactNode; className?: string }) {
    return (
        <section
            className={[
                "py-16 md:py-24",
                className || ""
            ].join(" ")}
        >
            <div className="max-w-7xl mx-auto px-3 w-full">{children}</div>
        </section>
    );
}
