"use client";

import { useRef, useState } from "react";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import SpeechBubble from "./SpeechBubble";
import ParticleBurst from "./ParticleBurst";

type Animal = {
    key: string;
    src: string,
    alt: string;
    width: number;
    height: number;
    text: string;
    bubbleClass: string;
    reflect?: boolean;
}

const ANIMALS: Animal[] = [
    {
        key: "bear",
        src: "/assets/animal1.png",
        alt: "Bear",
        width: 123,
        height: 300,
        text: "It's unbearable to share the same birthday!",
        bubbleClass: "-top-40 -right-20",
    },
    {
        key: "goat",
        src: "/assets/animal2.png",
        alt: "Goat",
        width: 93,
        height: 300,
        text: "I often goat to birthday parties >_<",
        bubbleClass: "-top-40 -right-20",
    },
    {
        key: "bird",
        src: "/assets/animal3.png",
        alt: "Bird",
        width: 120,
        height: 300,
        text: "Tweet fact: I share a birthday with my twin!",
        bubbleClass: "-top-40 -left-50",
        reflect: true
    },
    {
        key: "elk",
        src: "/assets/animal4.png",
        alt: "Elk",
        width: 96,
        height: 300,
        text: "Statistically speaking... I can't be only one",
        bubbleClass: "-top-40 -left-50",
        reflect: true

    },
];


export default function FunIntro() {
    const [active, setActive] = useState<string | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);

    const [playFireworks, setPlayFireworks] = useState(false);
    const [fireworksKey, setFireworksKey] = useState(0);
    function fire() {
        setFireworksKey(k => k + 1);
        setPlayFireworks(true);
    }

    return (
        <>
            <div className="flex flex-col">
                <div className="flex flex-col gap-6 text-center">
                    <h1 className="mt-2 mb-2">The Birthday Problem</h1>
                    <h2>Picture yourself at a party...</h2>
                    <h2>What are the chances that two guests share the same birthday?</h2>
                    <div className="w-70 mx-auto text-sm p-2 border-2 rounded-full text-wrap bg-white/10 backdrop-blur">
                        Art by
                        <Link
                            className="ml-1 underline"
                            href={"https://www.freepik.com/author/rawpixel-com"}
                        >
                            rawpixel
                        </Link>{" "}
                        and{" "}
                        <Link
                            className="underline"
                            href={"https://www.freepik.com/author/vector4stock"}
                        >
                            vector4stock
                        </Link>
                    </div>
                </div>
            </div>

            {/* Animals + cake row */}
            <div
                ref={containerRef}
                className="relative flex justify-between items-end text-center gap-6 min-h-[125px]"
            >
                {ANIMALS.slice(0, 1).map((a) => (
                    <AnimalWithSpeech
                        key={a.key}
                        animal={a}
                        active={active}
                        setActive={setActive}
                    />
                ))}

                {/* Goat */}
                {ANIMALS.slice(1, 2).map((a) => (
                    <AnimalWithSpeech
                        key={a.key}
                        animal={a}
                        active={active}
                        setActive={setActive}
                    />
                ))}

                {/* Cake */}
                <motion.div
                    className="flex flex-col justify-center relative"
                    animate={{ rotate: [0, 15, 0, -15, 0], x: [0, 10, 0, -10, 0] }}
                    transition={{
                        duration: 4,
                        repeat: Infinity,
                        repeatType: "loop",
                        ease: "easeInOut",
                    }}
                    aria-hidden
                >
                    <Image
                        src={"/assets/cake.png"}
                        alt={"Cake"}
                        width={231}
                        height={250}
                        onClick={() => fire()} />
                    <div className={`absolute -top-20 ${playFireworks ? 'inline' : 'hidden'} `}>
                        <ParticleBurst key={fireworksKey} />
                    </div>
                </motion.div>

                {/* Bird */}
                {ANIMALS.slice(2, 3).map((a) => (
                    <AnimalWithSpeech
                        key={a.key}
                        animal={a}
                        active={active}
                        setActive={setActive}
                    />
                ))}

                {/* Elk */}
                {ANIMALS.slice(3, 4).map((a) => (
                    <AnimalWithSpeech
                        key={a.key}
                        animal={a}
                        active={active}
                        setActive={setActive}
                    />
                ))}

            </div>
        </>
    );
}

function AnimalWithSpeech({
    animal,
    active,
    setActive,
}: {
    animal: Animal;
    active?: string | null;
    setActive: (k: string | null) => void;
}) {
    const isActive = active === animal.key;

    const handleToggle = () => {
        setActive(isActive ? null : animal.key);
    };

    const handleKeyDown: React.KeyboardEventHandler<HTMLButtonElement> = (e) => {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleToggle();
        }
    };

    return (
        <div className="relative">
            <button
                type="button"
                className="relative outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-xl"
                aria-pressed={isActive}
                aria-expanded={isActive}
                aria-controls={`${animal.key}-bubble`}
                onClick={handleToggle}
                onKeyDown={handleKeyDown}
            >
                <Image
                    src={animal.src}
                    alt={animal.alt}
                    width={animal.width}
                    height={animal.height}
                />
            </button>

            {/* Bubble */}
            {isActive && (
                <div
                    id={`${animal.key}-bubble`}
                    className={`pointer-events-auto absolute z-50 ${animal.bubbleClass}`}
                >
                    <SpeechBubble text={animal.text} reflect={animal.reflect} />
                </div>
            )}
        </div>
    );
}
