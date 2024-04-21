import { submitAnswerResponse } from "../../server/serverTypeDefs"
import QuestionAnswerChoice from "./QuestionAnswerChoice"

// Component displaying the choices of a question (and eventually the correct/incorrect choices)
interface Props {
    answerChoices: string[]
    answerFeedback: undefined | submitAnswerResponse
    submitAnswer: (answer: string) => void
}

function QuestionChoicesDisplay({
    answerChoices,
    answerFeedback,
    submitAnswer,
}: Props) {
    return (
        <div
            id="QuestionAnswerPage-questionChoicesContainer"
            className="u-flex-row"
        >
            {answerChoices.map((answerChoice, index) => {
                let feedbackDisplayType: "none" | "correct" | "incorrect" =
                    "none"
                // Always display a correct indicator if the answer choice is correct.
                if (answerFeedback?.correctAnswer === answerChoice) {
                    feedbackDisplayType = "correct"
                }
                // The answer choice should display an "incorrect"
                // indicator if the answer was picked and the answer was incorrect.
                else if (
                    answerFeedback?.givenAnswer === answerChoice &&
                    !answerFeedback.correct
                ) {
                    feedbackDisplayType = "incorrect"
                }
                return (
                    <QuestionAnswerChoice
                        key={index}
                        answerChoice={answerChoice}
                        answerIndex={index}
                        submitAnswer={submitAnswer}
                        feedbackDisplayType={feedbackDisplayType}
                    />
                )
            })}
        </div>
    )
}

export default QuestionChoicesDisplay
