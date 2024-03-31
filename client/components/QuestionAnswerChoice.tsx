// Component representing a single question answer choice.
interface Props {
    answerChoice: string
    submitAnswer: (answer: string) => void
}

function QuestionAnswerChoice({ answerChoice, submitAnswer }: Props) {
    return (
        <li>
            <button onClick={() => submitAnswer(answerChoice)}>
                <span>{answerChoice}</span>
            </button>
        </li>
    )
}

export default QuestionAnswerChoice
