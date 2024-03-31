// Component that displays a single category of the question reveal carousel
interface Props {
    category: string
    completed: boolean
}

// TODO: have different styling based on completion status.
function QuestionRevealCategory({ category, completed }: Props) {
    return (
        <div>
            <p>Category: {category}</p>
            <p>Completed: {completed ? "Yes" : "No"}</p>
        </div>
    )
}

export default QuestionRevealCategory
