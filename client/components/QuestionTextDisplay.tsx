// Component displaying the text of a question.
interface Props {
    questionText: string
}

function QuestionTextDisplay({ questionText }: Props) {
    return (
        <div>
            <p>{questionText}</p>
        </div>
    )
}

export default QuestionTextDisplay
