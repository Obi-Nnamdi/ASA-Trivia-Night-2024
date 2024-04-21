import axios from "axios"
import { useState, useEffect } from "react"
import {
    currentQuestionResponse,
    submitAnswerResponse,
} from "../../server/serverTypeDefs"
import { Link, Navigate } from "react-router-dom"
import { STANDINGS_PAGE_ROUTE_NAME } from "./pageRouteNames"
import QuestionTextDisplay from "../components/QuestionTextDisplay"
import QuestionCategoryDisplay from "../components/QuestionCategoryDisplay"
import QuestionChoicesDisplay from "../components/QuestionChoicesDisplay"
import "./QuestionAnswerPage.css"

// Page for answering a game's current question.
// Props:
// - gameId: The id of the game to display the game state for.
interface Props {
    gameId: string | undefined
}

function QuestionAnswerPage({ gameId }: Props) {
    const [currentQuestion, setcurrentQuestion] =
        useState<currentQuestionResponse>()

    const [answerFeedback, setAnswerFeedback] = useState<submitAnswerResponse>()

    // Get the current trivia question from the server
    useEffect(() => {
        if (gameId !== undefined) {
            axios.get(`/api/game/${gameId}/currentQuestion`).then((res) => {
                const currentQuestion: currentQuestionResponse = res.data
                setcurrentQuestion(currentQuestion)
            })
        }
    }, [gameId])

    // If the game id is undefined, redirect to the home page.
    if (gameId === undefined) {
        return <Navigate to="/" />
    }

    // Define function for randomly answering the current question
    async function answerQuestion(answer: string) {
        // Only submit the answer to the server if we have a question and don't have our answer feedback
        if (currentQuestion !== undefined && answerFeedback === undefined) {
            const response: submitAnswerResponse = (
                await axios.post(`/api/game/${gameId}/submitAnswer`, {
                    answer: answer,
                    questionId: currentQuestion.id,
                })
            ).data
            setAnswerFeedback(response)
        }
    }
    // Display the current game question.
    return (
        <div>
            {currentQuestion !== undefined && (
                <>
                    <div id="QuestionAnswerPage-toolbar">
                        <p>Timer</p>
                        <Link
                            id="QuestionAnswerPage-nextButton"
                            style={
                                answerFeedback === undefined
                                    ? { opacity: 0.3, pointerEvents: "none" }
                                    : {}
                            }
                            className="u-remove-underline importantButton"
                            to={STANDINGS_PAGE_ROUTE_NAME}
                        >
                            Next
                        </Link>
                    </div>
                    <div className="u-flex-column u-align-center u-max-height u-space-between">
                        <QuestionCategoryDisplay
                            category={currentQuestion.category}
                            player={currentQuestion.assignedPlayer.name}
                        />
                        <QuestionTextDisplay
                            questionText={currentQuestion.questionText}
                        />
                        <QuestionChoicesDisplay
                            answerChoices={currentQuestion.possibleAnswers}
                            answerFeedback={answerFeedback}
                            submitAnswer={answerQuestion}
                        />
                    </div>
                </>
            )}
        </div>
    )
}

export default QuestionAnswerPage
