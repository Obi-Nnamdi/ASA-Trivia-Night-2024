// Component displaying the completed categories of a player.
interface Props {
    allCategories: string[]
    completedCategories: string[]
}

function CompletedCategoriesDisplay({
    allCategories,
    completedCategories,
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
            <ul>
                {allCategories.map((category) => (
                    <li key={category}>
                        {category}
                        {categoryCompletionMap.get(category)
                            ? " (complete)"
                            : " (incomplete)"}
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default CompletedCategoriesDisplay
