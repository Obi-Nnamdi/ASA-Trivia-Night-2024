import axios from "axios"
import { useState, useEffect } from "react"
import { checkGameStateResponse } from "../../server/serverTypeDefs"
import { Link, Navigate } from "react-router-dom"
import { LANDING_PAGE_ROUTE_NAME } from "./pageRouteNames"

// Page for displaying the winner of a game.
// Props:
// - gameId: The id of the game to display the game state for.
interface Props {
    gameId: string | undefined
}

function WinnerPage({ gameId }: Props) {
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

    // Display the current game winner, and add a button to navigate to the landing page.
    // TODO: end game.
    return (
        <>
            <pre>Winner: {JSON.stringify(gameState.winner, null, 2)}</pre>
            <Link to={".." + LANDING_PAGE_ROUTE_NAME}>Back to Home Page.</Link>
        </>
    )
}

export default WinnerPage
