"use client";

import React, { useMemo } from "react";
import { motion } from "motion/react";

type ParticleBurstProps = {
    count?: number;
    radius?: number;
    duration?: number;
    repeat?: number | "Infinity";
    sizeRange?: [min: number, max: number];
};

export default function ParticleBurst({
    count = 14,
    radius = 150,
    duration = 1.2,
    repeat = 0,
    sizeRange = [8, 28],
}: ParticleBurstProps) {
    const bgClasses = [
        "bg-orange-400",
        "bg-red-500",
        "bg-yellow-400",
        "bg-lime-400",
        "bg-sky-400",
        "bg-violet-500",
        "bg-pink-500",
    ];

    const glowClasses = [
        "drop-shadow-[0_0_6px_rgba(249,115,22,0.6)]",  // orange-400
        "drop-shadow-[0_0_6px_rgba(239,68,68,0.6)]",   // red-500
        "drop-shadow-[0_0_6px_rgba(234,179,8,0.6)]",   // yellow-400
        "drop-shadow-[0_0_6px_rgba(132,204,22,0.6)]",  // lime-400
        "drop-shadow-[0_0_6px_rgba(56,189,248,0.6)]",  // sky-400
        "drop-shadow-[0_0_6px_rgba(139,92,246,0.6)]",  // violet-500
        "drop-shadow-[0_0_6px_rgba(236,72,153,0.6)]",  // pink-500
    ];

    const particles = useMemo(() => {
        return Array.from({ length: count }).map((_, i) => {
            const angle = Math.random() * Math.PI * 2;
            const dist = radius * (0.6 + Math.random() * 0.4);
            const dx = Math.cos(angle) * dist;
            const dy = Math.sin(angle) * dist;

            const size =
                sizeRange[0] +
                Math.random() * Math.max(0, sizeRange[1] - sizeRange[0]);

            const delay = (i / count) * (duration * 0.25);

            const idx = Math.floor(Math.random() * bgClasses.length);
            const bg = bgClasses[idx];
            const glow = glowClasses[idx];

            return { dx, dy, size, delay, i, bg, glow };
        });
    }, [count, radius, duration, sizeRange]);

    return (
        <div className="relative h-[175px]">
            <div className="absolute left-10 bottom-10">
                {particles.map(({ dx, dy, size, delay, i, bg, glow }) => (
                    <motion.div suppressHydrationWarning
                        key={i}
                        className={`absolute rounded-full ${bg} ${glow} mix-blend-screen`} // nice additive feel
                        style={{
                            width: `${size}px`,
                            height: `${size}px`,
                            left: "0px",
                            top: "0px",
                        }}
                        initial={{ opacity: 0, scale: 0.6 }}
                        animate={{
                            left: ["0px", `${dx}px`],
                            top: ["0px", `${dy}px`],
                            opacity: [0, 1, 0],
                            scale: [0.6, 1, 0.8],
                        }}
                        transition={{
                            duration,
                            delay,
                            ease: "easeInOut",
                            repeat: repeat === "Infinity" ? Infinity : repeat,
                        }}
                    />
                ))}
            </div>
        </div>
    );
}
