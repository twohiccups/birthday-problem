'use client'

import Calendar from "./components/Calendar";
import { CollisionProbabilityGraph } from "./components/CollisionProbabilityGraph";
import Comparisons from "./components/Comparisons";
import Section from "./components/Section";
import Formula from "./components/Formula";
import IntuitionText from "./components/IntuitionText";
import FunIntro from "./components/FunIntro";
import CollisionProbabilityText from "./components/CollisionProbabilityText";

export default function Home() {
  return (
    <main className="font-sans min-h-screen overflow-y-auto space-y-16 md:space-y-22">
      <Section className="max-w-7xl mx-auto">
        <FunIntro />
      </Section>

      <Section className="max-w-7xl mx-auto">
        <div className="flex flex-col gap-4 md:gap-6">
          <CollisionProbabilityText />
          <div className="pb-2">
            <CollisionProbabilityGraph className="max-h-[340px] md:h-[440px]" />
          </div>
        </div>
      </Section>

      <Section className="max-w-7xl mx-auto">
        <Formula />
      </Section>

      <Section className="max-w-7xl mx-auto">
        <Calendar />
      </Section>

      <Section className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row gap-6">
          <div className="sm:w-1/2 p-2">
            <IntuitionText />
          </div>
          <div className="sm:w-1/2 p-2">
            <Comparisons />
          </div>
        </div>
      </Section>

      <Section >{' '}
        <h2 className="text-center">Thank you</h2>
        <h2 className="text-center">More stuff coming soon!</h2>
      </Section>

      <Section className="h-1/4" >{' '}</Section>
    </main>
  );
}
