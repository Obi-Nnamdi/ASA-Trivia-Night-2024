import QuestionRevealCategory from "./QuestionRevealCategory"

// Component that displays the currently selected category of a question.
interface Props {
    allCategories: string[]
    completedCategories: string[]
    selectedCategory: string
}

function QuestionRevealCarousel({
    allCategories,
    completedCategories,
    selectedCategory,
}: Props) {
    const categoryCompletionMap = new Map<string, boolean>()
    allCategories.forEach((category) => {
        categoryCompletionMap.set(
            category,
            completedCategories.includes(category)
        )
    })
    return (
        <div>
            <h3>{selectedCategory}</h3>
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
