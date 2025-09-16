import Calendar from "./components/Calendar";
import { CollisionGraph } from "./components/CollisionGraph";
import Section from "./components/Section";
import Image from "next/image"


export default function Home() {
  return (
    <main className="font-sans h-screen overflow-y-scroll snap-y snap-mandatory scroll-smooth">
      <Section>
        <div className="flex flex-col">
          <div className="flex flex-col gap-6 text-center">
            <h1 className="text-6xl sm:text-8xl mb-6">The Birthday Problem</h1>
            <h2 className="text-3xl sm:text-5xl">Imagine you are at a party...</h2>
            <h2 className="text-3xl sm:text-5xl">How likely is it that two people share same birthday date?</h2>
            <h2 className="text-2xl ">Srcoll down or use arrow keys to navigate</h2>
          </div>
        </div>
        <div className="flex text-center justify-between">
          <Image src={"/assets/animal1.png"} alt={"Cake"} width={100} height={300} />
          <Image src={"/assets/animal2.png"} alt={"Cake"} width={100} height={300} />
          <Image src={"/assets/cake.png"} alt={"Cake"} width={250} height={200} />
          <Image src={"/assets/animal3.png"} alt={"Cake"} width={100} height={300} />
          <Image src={"/assets/animal4.png"} alt={"Cake"} width={100} height={300} />
        </div>
      </Section>


      <Section>
        <div className="flex flex-row">
          <Calendar year={2025} />
        </div>
      </Section>

      <Section>
        <h3>hello</h3>
        <CollisionGraph />

      </Section>

      <Section>
        <h2 className="text-5xl sm:text-7xl">Simulations</h2>
      </Section>
    </main>
  );
}
