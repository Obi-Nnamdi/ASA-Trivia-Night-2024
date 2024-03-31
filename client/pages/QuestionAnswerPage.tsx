import axios from "axios"
import { useState, useEffect } from "react"
import { currentQuestionResponse } from "../../server/serverTypeDefs"
import { Link, Navigate } from "react-router-dom"
import { STANDINGS_PAGE_ROUTE_NAME } from "./pageRouteNames"
import QuestionTextDisplay from "../components/QuestionTextDisplay"
import QuestionCategoryDisplay from "../components/QuestionCategoryDisplay"
import QuestionChoicesDisplay from "../components/QuestionChoicesDisplay"

// Page for answering a game's current question.
// Props:
// - gameId: The id of the game to display the game state for.
interface Props {
    gameId: string | undefined
}

function QuestionAnswerPage({ gameId }: Props) {
    const [currentQuestion, setcurrentQuestion] =
        useState<currentQuestionResponse>()

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
    function answerQuestion(answer: string) {
        if (currentQuestion !== undefined) {
            axios.post(`/api/game/${gameId}/submitAnswer`, {
                answer: answer,
                questionId: currentQuestion.id,
            })
        }
    }
    // Display the current game question.
    return (
        <div>
            {currentQuestion !== undefined && (
                <>
                    <QuestionCategoryDisplay
                        category={currentQuestion.category}
                        player={currentQuestion.assignedPlayer.name}
                    />
                    <QuestionTextDisplay
                        questionText={currentQuestion.questionText}
                    />
                    <QuestionChoicesDisplay
                        answerChoices={currentQuestion.possibleAnswers}
                        submitAnswer={answerQuestion}
                    />
                    <Link to={STANDINGS_PAGE_ROUTE_NAME}>Next.</Link>{" "}
                </>
            )}
        </div>
    )
}

export default QuestionAnswerPage
