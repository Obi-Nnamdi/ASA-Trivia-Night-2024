import QuestionAnswerChoice from "./QuestionAnswerChoice"

// Component displaying the choices of a question (and eventually the correct/incorrect choices)
interface Props {
    answerChoices: string[]
    submitAnswer: (answer: string) => void
}

function QuestionChoicesDisplay({ answerChoices, submitAnswer }: Props) {
    return (
        <div>
            <ul>
                {answerChoices.map((answerChoice, index) => (
                    <QuestionAnswerChoice
                        key={index}
                        answerChoice={answerChoice}
                        submitAnswer={submitAnswer}
                    />
                ))}
            </ul>
        </div>
    )
}

export default QuestionChoicesDisplay
