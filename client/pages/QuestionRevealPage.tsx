import axios from "axios"
import { useState, useEffect } from "react"
import {
    checkGameStateResponse,
    currentQuestionResponse,
} from "../../server/serverTypeDefs"
import { Link, Navigate } from "react-router-dom"
import { QUESTION_ANSWER_PAGE_ROUTE_NAME } from "./pageRouteNames"
import { PlayerState } from "../../server/TriviaGameTypeDefs"
import QuestionRevealCarousel from "../components/QuestionRevealCarousel"
import "./QuestionRevealPage.css"
import RightArrow from "../assets/vectors/right_arrow.svg"

// Page for revealing the question for a game.
// Props:
// - gameId: The id of the game to display the game state for.
interface Props {
    gameId: string | undefined
}

function QuestionRevealPage({ gameId }: Props) {
    const [currentQuestion, setcurrentQuestion] =
        useState<currentQuestionResponse>()
    const [gameState, setGameState] = useState<checkGameStateResponse>()

    // Get the current trivia question and game state from the server
    useEffect(() => {
        if (gameId !== undefined) {
            axios.get(`/api/game/${gameId}/currentQuestion`).then((res) => {
                const currentQuestion: currentQuestionResponse = res.data
                setcurrentQuestion(currentQuestion)
            })
            axios.get(`/api/game/${gameId}/gameState`).then((res) => {
                const gameState: checkGameStateResponse = res.data
                setGameState(gameState)
            })
        }
    }, [gameId])

    // Sum up the amount of questions each player has been asked to get the number of total questions
    // asked previously
    const numAskedQuestions =
        gameState?.playerStates.reduce(
            (total, playerState) => total + playerState.questionsAnswered,
            0
        ) ?? 0

    // Get the current player
    let currentPlayer: PlayerState | undefined
    if (gameState !== undefined) {
        currentPlayer = gameState.playerStates[gameState.currentPlayerIndex]
    }

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
        <div id="QuestionRevealPage-mainContainer">
            {currentQuestion && gameState && currentPlayer && (
                <div className="u-flex-row u-align-center u-space-between u-max-height">
                    <div
                        className="u-flex-column u-align-center u-primary-font-family"
                        id="QuestionRevealPage-contextContainer"
                    >
                        <h1>Question {numAskedQuestions + 1}</h1>
                        <h1>{currentPlayer.name}</h1>
                    </div>
                    <QuestionRevealCarousel
                        allCategories={gameState.questionCategories}
                        completedCategories={currentPlayer.completedCategories}
                        selectedCategory={currentQuestion.category}
                    />
                    <div
                        className="u-flex-column u-align-center"
                        id="QuestionRevealPage-nextPageButtonContainer"
                    >
                        <Link
                            id="QuestionRevealPage-nextPageButton"
                            className="importantButton"
                            to={".." + QUESTION_ANSWER_PAGE_ROUTE_NAME}
                        >
                            <img src={RightArrow} />
                        </Link>
                    </div>
                </div>
            )}
        </div>
    )
}

export default QuestionRevealPage
