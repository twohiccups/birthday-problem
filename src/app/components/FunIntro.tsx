import { motion } from "motion/react";
import Image from "next/image";

export default function FunIntro() {
    return (
        <>
            <div className="flex flex-col">
                <div className="flex flex-col gap-6 text-center">
                    <h1 className="mt-2 mb-2">The Birthday Problem</h1>
                    <h2>Picture yourself at a party...</h2>
                    <h2>What are the chances that two guests share the same birthday?</h2>
                    <h3>Scroll down or use arrow keys to navigate</h3>
                </div>
            </div>
            <div className="flex justify-between text-center">
                <div>
                    <Image src={"/assets/animal1.png"} alt={"Bear"} width={120} height={300} />
                    <p></p>
                </div>
                <div>
                    <Image src={"/assets/animal2.png"} alt={"Goat"} width={100} height={300} />
                </div>
                <motion.div
                    className="flex flex-col justify-center"
                    animate={{
                        rotate: [0, 15, 0, -15, 0],
                        x: [0, 10, 0, -10, 0]
                    }}
                    transition={{
                        duration: 4,
                        repeat: Infinity,
                        repeatType: "loop",
                        ease: "easeInOut",
                    }}

                >
                    <Image src={"/assets/cake.png"} alt={"Cake"} width={250} height={200} />
                </motion.div>

                <div>
                    <Image src={"/assets/animal3.png"} alt={"Bird"} width={120} height={300} />
                </div>
                <div>
                    <Image src={"/assets/animal4.png"} alt={"Elk"} width={120} height={300} />
                </div>
            </div>
        </>
    )
}