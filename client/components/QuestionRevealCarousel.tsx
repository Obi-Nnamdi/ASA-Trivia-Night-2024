import { useEffect } from "react"
import QuestionRevealCategory from "./QuestionRevealCategory"

// Component that displays the currently selected category of a question.
interface Props {
    allCategories: string[]
    completedCategories: string[]
    selectedCategory: string
}

// Helper function for Fisher-Yates shuffling an array.
// From https://stackoverflow.com/a/2450976/20791863
function shuffle<T>(array: T[]): void {
    let currentIndex = array.length

    // While there remain elements to shuffle...
    while (currentIndex != 0) {
        // Pick a remaining element...
        const randomIndex = Math.floor(Math.random() * currentIndex)
        currentIndex--

        // And swap it with the current element.
        ;[array[currentIndex], array[randomIndex]] = [
            array[randomIndex] as T,
            array[currentIndex] as T,
        ]
    }
}

// TODO: animate this properly using smooth scrolling.
// https://stackoverflow.com/questions/635706/how-to-scroll-to-an-element-inside-a-div
function QuestionRevealCarousel({
    allCategories,
    completedCategories,
    selectedCategory,
}: Props) {
    const categoryCompletionMap = new Map<string, boolean>()
    // Shuffle our category array once, then make the middle element our desired category.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => shuffle(allCategories), [])

    const middleIndex = Math.floor(allCategories.length / 2)
    const middleElt = allCategories[middleIndex]
    const categoryIndex = allCategories.indexOf(selectedCategory)

    if (middleElt === undefined || categoryIndex === -1) {
        throw new Error("Bad array")
    }
    allCategories[middleIndex] = selectedCategory
    allCategories[categoryIndex] = middleElt

    // Display our carousel cards
    allCategories.forEach((category) => {
        categoryCompletionMap.set(
            category,
            completedCategories.includes(category)
        )
    })
    return (
        <div id="QuestionRevealPage-questionRevealCarousel">
            {allCategories.map((category, index) => (
                <QuestionRevealCategory
                    key={index}
                    category={category}
                    completed={categoryCompletionMap.get(category) ?? false}
                />
            ))}
        </div>
    )
}

export default QuestionRevealCarousel
