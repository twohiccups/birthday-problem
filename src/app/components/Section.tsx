import { ReactNode } from "react";

type Props = { children: ReactNode; className?: string };

export default function Section({ children, className }: Props) {
    return (
        <section
            className={`h-screen snap-start px-6 sm:px-20 ${className || ""}`}
        >
            {children}
        </section>
    );
}
