'use client'
import { motion } from "motion/react";
import Calendar from "./components/Calendar";
import { CollisionProbabilityGraph } from "./components/CollisionProbabilityGraph";
import Comparisons from "./components/Comparisons";
import Section from "./components/Section";
import Image from "next/image";
import Formula from "./components/Formula";
import IntuitionText from "./components/IntuitionText";

export default function Home() {
  return (
    <main className="font-sans h-dvh min-h-dvh overflow-y-scroll snap-y snap-mandatory scroll-smooth overscroll-y-contain">
      <Section>
        <div className="flex flex-col">
          <div className="flex flex-col gap-6 text-center">
            <h1 className="my-6">The Birthday Problem</h1>
            <h2 >Imagine you are at a party...</h2>
            <h2 >How likely is it that two people share same birthday date?</h2>
            <h3>Scroll down or use arrow keys to navigate</h3>
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
        <div className="h-full">
          <div className="h-1/3">
            <h2 className="text-center my-6">Just 23 people means 50% collision probability</h2>
            <h3>Kinda surprising, right? With 365 days in a year, you&apos;d expect collisions to be rare. But as the group grows, the number of comparisons between each pair of people grows even faster! In a group of 80, probability approaches 100%. Graph below shows how quickly the probability skyrockets.</h3>

          </div>
          {/* <div className=""> */}
          <div className="h-2/3">
            <CollisionProbabilityGraph />
          </div>
        </div>
        {/* </div> */}
      </Section>



      <Section>
        <Formula />
      </Section>



      <Section>
        <Calendar />
      </Section>



      <Section>
        <div className="flex">
          <div className="w-1/2">
            <IntuitionText />
          </div>
          <div className="w-1/2">
            <Comparisons />
          </div>
        </div>
      </Section>
    </main >
  );
}
