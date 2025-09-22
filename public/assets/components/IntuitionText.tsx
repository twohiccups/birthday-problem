import Link from "next/link";
import { FormulaDiv } from "./FormulaDiv";
import Image from "next/image";

export default function IntuitionText() {
    return (
        <div className="space-y-8">
            <h2 className="text-center my-6">Intuition</h2>
            <h3 className="text-justify">Why does the probability of collision grow so fast? With each new person, we have to compare their birthday to everyone else&apos;s
                When a 24<sup>th</sup> person joins, we need to make sure they are not born on the same day as the previous 23. And so, The larger the group, the more connections we have to consider.
                Mathematically, this can be represented with a <Link className="text-sky-500" href="https://en.wikipedia.org/wiki/Complete_graph">complete graph</Link>.
                See how complex the graph gets as the number of people increases.
            </h3>
            <FormulaDiv>
                <Image
                    src="/assets/equation3.svg"
                    alt="Equation showing product of decreasing choices"
                    width={350}
                    height={140}
                    className="dark:invert max-w-full h-auto"
                    priority
                />
            </FormulaDiv>
        </div>
    )
}