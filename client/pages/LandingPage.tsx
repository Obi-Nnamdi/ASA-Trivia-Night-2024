import { useNavigate } from "react-router-dom"
import { GAME_CREATION_PAGE_ROUTE_NAME } from "./pageRouteNames"
import "./LandingPage.css"
import CroppedAfricaMap from "../assets/vectors/cropped-africa-map.svg"

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
        <div id="LandingPage-mainContainer">
            <div
                id="LandingPage-mainContentContainer"
                className="u-hide-overflow u-max-height"
            >
                <div className="LandingPage-leftIndent u-flex-column">
                    <h1 id="LandingPage-title" className="u-no-margin">
                        ASA Jeopardy Night
                    </h1>
                    <h2 id="LandingPage-subtitle" className="u-no-margin">
                        Spring 2024
                    </h2>
                    <button
                        className="importantButton"
                        id="LandingPage-startButton"
                        onClick={createGame}
                    >
                        <p
                            id="LandingPage-startButtonText"
                            className="u-no-margin"
                        >
                            Start
                        </p>
                    </button>
                </div>
                <img
                    id="LandingPage-AfricaMap"
                    src={CroppedAfricaMap}
                    alt="Africa Map"
                />
            </div>
        </div>
    )
}

export default LandingPage
