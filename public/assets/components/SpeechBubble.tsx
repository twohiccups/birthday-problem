"use client"

import { motion } from "motion/react";

export default function SpeechBubble({ text, reflect = false }: { text: string, reflect?: boolean; }) {
    return (
        <motion.div
            className="relative h-[175px] z-50"
            animate={{ rotate: [-5, 5, 0] }}
            transition={{ duration: 1.2, repeat: 0, ease: "easeInOut" }}
        >
            <p className={`absolute bottom-0  w-3 h-3 border-2 rounded-full bg-black ${reflect ? "-right-52" : "-left-20"} `} />
            <p className={`absolute bottom-3  w-5 h-5 border-2 rounded-full bg-black ${reflect ? "-right-48" : "-left-16"}`} />
            <p className={`absolute bottom-5  w-7 h-7 border-2 rounded-full bg-black ${reflect ? "-right-42" : "-left-8"}  `} />
            < p className="absolute border-[3px] text-wrap rounded-full p-6 bg-black text-white shadow-xl">
                {text}
            </p>
        </motion.div>
    );
}
