// Component displaying the text of a question.
interface Props {
    questionText: string
}

function QuestionTextDisplay({ questionText }: Props) {
    return (
        <div id="QuestionAnswerPage-questionTextDisplay">
            <p className="u-no-margin u-center-text">{questionText}</p>
        </div>
    )
}

export default QuestionTextDisplay
