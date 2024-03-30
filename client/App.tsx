import { useEffect, useState } from "react"
import { Routes, Route, useLoaderData } from "react-router-dom"
import GameCreationPage from "./pages/GameCreationPage"
import StandingsPage from "./pages/StandingsPage"
import LandingPage from "./pages/LandingPage"
import QuestionRevealPage from "./pages/QuestionRevealPage"
import {
    GAME_CREATION_PAGE_ROUTE_NAME,
    GAME_WINNER_PAGE_ROUTE_NAME,
    LANDING_PAGE_ROUTE_NAME,
    QUESTION_ANSWER_PAGE_ROUTE_NAME,
    QUESTION_REVEAL_PAGE_ROUTE_NAME,
    STANDINGS_PAGE_ROUTE_NAME,
} from "./pages/pageRouteNames"
import QuestionAnswerPage from "./pages/QuestionAnswerPage"
import WinnerPage from "./pages/WinnerPage"

const gameIdKey = "gameId"
function App() {
    // Upon page load, try to load a saved Game Id from session storage.
    const savedGameId = (useLoaderData() ?? undefined) as string | undefined
    const [gameId, setGameId] = useState(savedGameId)

    useEffect(() => {
        // Update our session storage upon every gameId change.
        if (gameId !== undefined) {
            sessionStorage.setItem(gameIdKey, gameId)
        } else {
            sessionStorage.removeItem(gameIdKey)
        }
    }, [gameId])

    // Route between our pages.
    return (
        <>
            <Routes>
                <Route
                    path={LANDING_PAGE_ROUTE_NAME}
                    element={<LandingPage />}
                />
                <Route
                    path={GAME_CREATION_PAGE_ROUTE_NAME}
                    element={<GameCreationPage setGameId={setGameId} />}
                />
                <Route
                    path={STANDINGS_PAGE_ROUTE_NAME}
                    element={<StandingsPage gameId={gameId} />}
                />
                <Route
                    path={QUESTION_REVEAL_PAGE_ROUTE_NAME}
                    element={<QuestionRevealPage gameId={gameId} />}
                />
                <Route
                    path={QUESTION_ANSWER_PAGE_ROUTE_NAME}
                    element={<QuestionAnswerPage gameId={gameId} />}
                />
                <Route
                    path={GAME_WINNER_PAGE_ROUTE_NAME}
                    element={<WinnerPage gameId={gameId} />}
                />

                {/* 404 Page. */}
                <Route path="*" element={<div>404 Not Found.</div>} />
                {/* <Route path="/game/:gameId" element={<Game gameId={gameId} />} /> */}
            </Routes>
        </>
    )
}

export default App
