import axios from "axios"
import { useState, useEffect } from "react"
import { checkGameStateResponse } from "../../server/serverTypeDefs"
import { Link, Navigate } from "react-router-dom"
import {
    GAME_WINNER_PAGE_ROUTE_NAME,
    QUESTION_REVEAL_PAGE_ROUTE_NAME,
} from "./pageRouteNames"
import { TriviaGameStatus } from "../../server/TriviaGameTypeDefs"

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

    // Display the current game state, and add a button to navigate to the question reveal page.
    return (
        <>
            <pre>Current game state: {JSON.stringify(gameState, null, 2)}</pre>
            {gameState.gameStatus === TriviaGameStatus.IN_PROGRESS ? (
                <Link to={".." + QUESTION_REVEAL_PAGE_ROUTE_NAME}>
                    Navigate to question reveal page.
                </Link>
            ) : (
                <Link to={".." + GAME_WINNER_PAGE_ROUTE_NAME}>
                    Navigate to winner page.
                </Link>
            )}
        </>
    )
}

export default StandingsPage
