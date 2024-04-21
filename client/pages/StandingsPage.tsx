import axios from "axios"
import { useState, useEffect } from "react"
import { checkGameStateResponse } from "../../server/serverTypeDefs"
import { Link, Navigate } from "react-router-dom"
import {
    GAME_WINNER_PAGE_ROUTE_NAME,
    QUESTION_REVEAL_PAGE_ROUTE_NAME,
} from "./pageRouteNames"
import { TriviaGameStatus } from "../../server/TriviaGameTypeDefs"
import TeamStandingsDisplay from "../components/TeamStandingsDisplay"
import "./StandingsPage.css"

// Page for displaying the current standings of a game.
// Props:
// - gameId: The id of the game to display the game state for.
interface Props {
    gameId: string | undefined
}

function StandingsPage({ gameId }: Props) {
    const [gameState, setGameState] = useState<checkGameStateResponse>()

    // Get the game from the server
    useEffect(() => {
        if (gameId !== undefined) {
            axios.get(`/api/game/${gameId}/gameState`).then((res) => {
                const gameState: checkGameStateResponse = res.data
                setGameState(gameState)
            })
        }
    }, [gameId])

    // If the game id is undefined, redirect to the home page.
    if (gameId === undefined) {
        return <Navigate to="/" />
    }

    // If the game state is undefined, display a loading message.
    if (gameState === undefined) {
        return <div>Loading...</div>
    }

    // Display the current game state, and add a button to navigate to the question reveal page (or winner page if the game is over).
    return (
        <div className="u-flex-column main-page-centered-container">
            <h1 className="page-main-title">Standings</h1>
            <div className="u-flex-row StandingsPage-teamStandingsContainer">
                {gameState.playerStates.map((playerState, index) => (
                    <TeamStandingsDisplay
                        key={index}
                        player={playerState}
                        allQuestionCategories={gameState.questionCategories}
                        currentPlayer={index === gameState.currentPlayerIndex}
                    />
                ))}
            </div>
            {gameState.winner === undefined ? (
                <Link
                    className="importantButton u-remove-underline StandingsPage-nextPageButton"
                    to={".." + QUESTION_REVEAL_PAGE_ROUTE_NAME}
                >
                    Next Question
                </Link>
            ) : (
                <Link
                    className="importantButton u-remove-underline StandingsPage-nextPageButton"
                    to={".." + GAME_WINNER_PAGE_ROUTE_NAME}
                >
                    Results
                </Link>
            )}
        </div>
    )
}

export default StandingsPage
