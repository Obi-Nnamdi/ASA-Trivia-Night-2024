// Component that displays a single category of the question reveal carousel
interface Props {
    category: string
    completed: boolean
}

const baseClassName = "QuestionRevealPage-categoryCarouselCard" // base CSS class for styling carousel cards.
const generalCompletedClass = "QuestionRevealPage-completedCarouselCard"

// TODO: have different styling based on completion status.
function QuestionRevealCategory({ category, completed }: Props) {
    // Build the specific CSS class for our category card based on the given category
    // and its completion status.
    const cardCategoryClass = `${baseClassName}-${category}${
        completed ? "-Completed" : ""
    }`
    return (
        <div
            className={`u-flex-column u-justify-center ${baseClassName} ${cardCategoryClass} ${
                completed ? generalCompletedClass : ""
            }`}
        >
            <p className="u-no-margin">{category}</p>
        </div>
    )
}

export default QuestionRevealCategory
