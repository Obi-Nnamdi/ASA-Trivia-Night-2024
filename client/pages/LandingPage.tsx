import { useNavigate } from "react-router-dom"
import { GAME_CREATION_PAGE_ROUTE_NAME } from "./pageRouteNames"

// Landing page for the website.
function LandingPage() {
    const navigate = useNavigate()

    // Function to create a new game.
    function createGame() {
        // Create a new game by navigating to the create game page.
        navigate(GAME_CREATION_PAGE_ROUTE_NAME)
    }

    // Render the landing page.
    return (
        <>
            <h1>ASA Jeopardy Night</h1>
            <h2>Spring 2024</h2>
            <button onClick={createGame}>Start</button>
        </>
    )
}

export default LandingPage
