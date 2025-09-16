// components/Section.tsx
import { ReactNode } from "react";

type Props = { children: ReactNode; className?: string };

export default function Section({ children, className }: Props) {
    return (
        <section
            className={[
                "h-dvh min-h-dvh snap-start snap-always",
                "px-6 sm:px-20 overflow-hidden",
                "flex items-center",             // center vertically
                className || ""
            ].join(" ")}
        >
            {/* key: min-h-0 so inner flex children can actually shrink inside the viewport */}
            <div className="w-full h-full min-h-0">{children}</div>
        </section>
    );
}
