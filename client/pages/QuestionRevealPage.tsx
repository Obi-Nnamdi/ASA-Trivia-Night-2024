import axios from "axios"
import { useState, useEffect } from "react"
import { currentQuestionResponse } from "../../server/serverTypeDefs"
import { Link, Navigate } from "react-router-dom"
import { QUESTION_ANSWER_PAGE_ROUTE_NAME } from "./pageRouteNames"

// Page for revealing the question for a game.
// Props:
// - gameId: The id of the game to display the game state for.
interface Props {
    gameId: string | undefined
}

function QuestionRevealPage({ gameId }: Props) {
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

    // If the game state is undefined, display a loading message.
    if (currentQuestion === undefined) {
        return <div>Loading...</div>
    }

    // Display the current game question and navigate to the next page.
    return (
        <div>
            <pre>
                Current question: {JSON.stringify(currentQuestion, null, 2)}
            </pre>
            <Link to={".." + QUESTION_ANSWER_PAGE_ROUTE_NAME}>
                Answer Question.
            </Link>
        </div>
    )
}

export default QuestionRevealPage
