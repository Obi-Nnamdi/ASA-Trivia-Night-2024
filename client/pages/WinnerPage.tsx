import axios from "axios"
import { useState, useEffect } from "react"
import { checkGameStateResponse } from "../../server/serverTypeDefs"
import { Link, Navigate } from "react-router-dom"
import {
    LANDING_PAGE_ROUTE_NAME,
    STANDINGS_PAGE_ROUTE_NAME,
} from "./pageRouteNames"
import "./WinnerPage.css"

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
        return <Navigate to={".." + LANDING_PAGE_ROUTE_NAME} />
    }

    // If the game state is undefined, display a loading message.
    if (gameState === undefined) {
        return <div>Loading...</div>
    }

    // If the game hasn't been won, redirect back to the standings page.
    if (gameState.winner === undefined) {
        return <Navigate to={".." + STANDINGS_PAGE_ROUTE_NAME} />
    }

    // Display the current game winner, and add a button to navigate to the landing page.
    // TODO: end game.
    return (
        <div className="u-flex-column u-justify-center u-max-height">
            <div
                className="u-flex-column u-align-center u-space-between"
                id="WinnerPage-mainContainer"
            >
                <h1 className="u-no-margin">Winner</h1>
                <h2 className="u-no-margin">{gameState.winner.name}</h2>
                <Link
                    className="u-remove-underline importantButton"
                    id="WinnerPage-nextButton"
                    to={".." + LANDING_PAGE_ROUTE_NAME}
                >
                    Back to Home Page.
                </Link>
            </div>
        </div>
    )
}

export default WinnerPage
