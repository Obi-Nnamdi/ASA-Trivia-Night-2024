// Component displaying the category of a question and the player answering it.
interface Props {
    category: string
    player: string
}

function QuestionCategoryDisplay({ category, player }: Props) {
    // TODO: change styling depending on question category.
    return (
        <div>
            <h1>{category}</h1>
            <h2>{player}</h2>
        </div>
    )
}

export default QuestionCategoryDisplay
