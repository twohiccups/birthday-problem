export default function CollisionProbabilityText() {
    return (
        <div className="px-4 pt-1 space-y-10  md:space-y-10">
            <h2 className="text-center">
                High collision probability
            </h2>
            <h3 className="text-justify">
                In a group of just 23 people, there&apos;s already a 50% chance that two share the same birthday.
                Kinda surprising, right? With 365 days in a year, you&apos;d expect
                collisions to be rare. But as the group grows, the number of pairwise
                comparisons grows even faster. In a group of 80, probability approaches
                100%. Graph below shows how quickly the probability skyrockets.
            </h3>
        </div>
    )
}