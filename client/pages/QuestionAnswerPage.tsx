import axios from "axios"
import { useState, useEffect } from "react"
import { currentQuestionResponse } from "../../server/serverTypeDefs"
import { Link, Navigate } from "react-router-dom"
import { STANDINGS_PAGE_ROUTE_NAME } from "./pageRouteNames"
import { randomChoice } from "../../server/helpers"

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

    // If the game state is undefined, display a loading message.
    if (currentQuestion === undefined) {
        return <div>Loading...</div>
    }

    // Define function for randomly answering the current question
    function randomlyAnswerQuestion() {
        if (currentQuestion !== undefined) {
            const randomAnswerChoice = randomChoice(
                currentQuestion.possibleAnswers
            )
            axios.post(`/api/game/${gameId}/submitAnswer`, {
                answer: randomAnswerChoice,
                questionId: currentQuestion.id,
            })
        }
    }
    // Display the current game question.
    return (
        <div>
            <pre>
                Current question: {JSON.stringify(currentQuestion, null, 2)}
            </pre>

            <button onClick={randomlyAnswerQuestion}>Answer randomly.</button>
            <Link to={STANDINGS_PAGE_ROUTE_NAME}>Next.</Link>
        </div>
    )
}

export default QuestionAnswerPage
