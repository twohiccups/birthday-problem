'use client'

import Calendar from "./components/Calendar";
import { CollisionProbabilityGraph } from "./components/CollisionProbabilityGraph";
import Comparisons from "./components/Comparisons";
import Section from "./components/Section";
import Formula from "./components/Formula";
import IntuitionText from "./components/IntuitionText";
import FunIntro from "./components/FunIntro";

export default function Home() {
  return (
    <main className="font-sans min-h-screen overflow-y-auto space-y-12 md:space-y-16">
      <Section>

        <FunIntro />
      </Section>

      <Section>
        <div className="flex flex-col gap-4 md:gap-6">
          <div className="px-4 pt-1 space-y-3 md:space-y-4">
            <h2 className="text-center my-1 md:my-2">
              Just 23 people means 50% collision probability
            </h2>
            <h3 className="text-balance">
              Kinda surprising, right? With 365 days in a year, you&apos;d expect
              collisions to be rare. But as the group grows, the number of pairwise
              comparisons grows even faster. In a group of 80, probability approaches
              100%. Graph below shows how quickly the probability skyrockets.
            </h3>
          </div>

          {/* Give the chart real height; remove flex-1 */}
          <div className="px-2 pb-2">
            <CollisionProbabilityGraph className="max-h-[340px] md:h-[440px]" />
          </div>
        </div>
      </Section>

      <Section>
        <Formula />
      </Section>

      <Section>
        <Calendar />
      </Section>

      <Section>
        <div className="flex flex-col sm:flex-row gap-6">
          <div className="sm:w-1/2">
            <IntuitionText />
          </div>
          <div className="sm:w-1/2">
            <Comparisons />
          </div>
        </div>
      </Section>

    </main>
  );
}
