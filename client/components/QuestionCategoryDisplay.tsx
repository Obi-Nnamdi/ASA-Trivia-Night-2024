// Component displaying the category of a question and the player answering it.
interface Props {
    category: string
    player: string
}

function QuestionCategoryDisplay({ category, player }: Props) {
    // TODO: change styling depending on question category.
    return (
        <div
            className="u-flex-column u-align-center u-space-between"
            id="QuestionAnswerPage-questionCategoryDisplay"
        >
            <h1 className="u-no-margin u-center-text">{category}</h1>
            <h2 className="u-no-margin u-center-text">{player}</h2>
        </div>
    )
}

export default QuestionCategoryDisplay
