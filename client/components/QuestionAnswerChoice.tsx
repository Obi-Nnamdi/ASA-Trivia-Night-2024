import Checkmark from "../assets/vectors/checkmark.svg"
import IncorrectX from "../assets/vectors/incorrect_x.svg"
// Component representing a single question answer choice.
interface Props {
    answerChoice: string
    answerIndex: number
    feedbackDisplayType: "correct" | "incorrect" | "none"
    submitAnswer: (answer: string) => void
}

function QuestionAnswerChoice({
    answerChoice,
    answerIndex,
    feedbackDisplayType,
    submitAnswer,
}: Props) {
    return (
        <div className="u-flex-column u-align-center QuestionAnswerPage-questionChoiceContainer">
            <div>
                {feedbackDisplayType !== "none" ? (
                    feedbackDisplayType === "correct" ? (
                        <img src={Checkmark} />
                    ) : (
                        <img src={IncorrectX} />
                    )
                ) : (
                    <></>
                )}
            </div>
            <button
                className="u-pointer-cursor"
                onClick={() => submitAnswer(answerChoice)}
            >
                <span>
                    {answerIndex + 1}. {answerChoice}
                </span>
            </button>
        </div>
    )
}

export default QuestionAnswerChoice
