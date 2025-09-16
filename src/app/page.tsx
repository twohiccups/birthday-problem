'use client'
import { motion } from "motion/react";
import Calendar from "./components/Calendar";
import { CollisionGraph } from "./components/CollisionGraph";
import Comparisons from "./components/Comparisons";
import Section from "./components/Section";
import Image from "next/image";

export default function Home() {
  return (
    <main className="font-sans h-dvh min-h-dvh overflow-y-scroll
                     snap-y snap-mandatory scroll-smooth overscroll-y-contain">
      <Section>
        <div className="flex flex-col">
          <div className="flex flex-col gap-6 text-center">
            <h1 className="text-6xl sm:text-8xl mb-6">The Birthday Problem</h1>
            <h2 className="text-3xl sm:text-5xl">Imagine you are at a party...</h2>
            <h2 className="text-3xl sm:text-5xl">How likely is it that two people share same birthday date?</h2>
            <h2 className="text-2xl">Scroll down or use arrow keys to navigate</h2>
          </div>
        </div>

        <div className="flex justify-between text-center">
          <Image src={"/assets/animal1.png"} alt={"Cake"} width={120} height={300} />
          <Image src={"/assets/animal2.png"} alt={"Cake"} width={120} height={300} />
          <motion.div
            className="flex flex-col justify-center"
            animate={{
              rotate: [0, 15, 0, -15, 0],
              x: [0, 10, 0, -10, 0]
            }}
            transition={{
              duration: 4,     // total time for one full cycle
              repeat: Infinity, // keep looping
              repeatType: "loop", // can be 'mirror' or 'reverse' too
              ease: "easeInOut",
            }}

          >
            <Image src={"/assets/cake.png"} alt={"Cake"} width={250} height={200} />
          </motion.div>
          <Image src={"/assets/animal3.png"} alt={"Cake"} width={120} height={300} />
          <Image src={"/assets/animal4.png"} alt={"Cake"} width={120} height={300} />
        </div>
      </Section>

      <Section>
        <div className="flex">
          <Calendar year={2025} />
          <h3>The truth is, this calendar could do little better but we're not yet letting it</h3>
        </div>
      </Section>

      {/* REMOVE the margin that breaks slide height */}
      <Section>
        <h3>hello</h3>
        <CollisionGraph />
      </Section>

      <Section>
        <h2 className="text-5xl sm:text-7xl">Simulations</h2>
      </Section>

      <Section>
        <Comparisons />
      </Section>
    </main>
  );
}
