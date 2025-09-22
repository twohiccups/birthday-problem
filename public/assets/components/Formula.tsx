import Image from "next/image";
import { FormulaDiv } from "./FormulaDiv";


export default function Formula() {
    const FORMULA_HEIGHT = 140;
    return (
        <div className="">
            <h2 className="text-center my-6">Formula</h2>

            <div className="space-y-10">
                <h3>
                    Here&apos;s some math. The probability that at least two people in a group of n share a
                    birthday is
                </h3>
                <FormulaDiv>

                    <Image
                        src="/assets/equation.svg"
                        alt="Equation showing product of decreasing choices"
                        width={750}
                        height={FORMULA_HEIGHT}
                        className="dark:invert max-w-full h-auto"
                        priority
                    />
                </FormulaDiv>

                <h3>
                    Since the first person has 365 choices, the second 364, the third 363, etc...
                </h3>

                <FormulaDiv>
                    <Image
                        src="/assets/equation1.svg"
                        alt="Equation for probability all birthdays are different"
                        width={750}
                        height={FORMULA_HEIGHT}
                        className="dark:invert max-w-full h-auto"
                    />
                </FormulaDiv>

                <h3>Thus,</h3>
                <FormulaDiv>
                    <Image
                        src="/assets/equation2.svg"
                        alt="Closed-form probability formula"
                        // make this one smaller so it doesn't dominate
                        width={350}
                        height={FORMULA_HEIGHT}
                        className="dark:invert max-w-full h-auto"
                    />
                </FormulaDiv>
            </div >
        </div>
    );
}
