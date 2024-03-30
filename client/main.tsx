import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import axios from "axios"
import { gameExistsResponse } from "../server/serverTypeDefs.ts"

const gameIdKey = "gameId"

async function loadSavedGameId(): Promise<string | null> {
    // Get our saved game Id from our session storage.
    const gameId = sessionStorage.getItem(gameIdKey) ?? undefined

    // Early return if the game id doesn't exist
    if (gameId === undefined) {
        return null
    }

    // Validate our saved game id and make sure it's still running
    const serverResponse = await axios.get(`/api/game/${gameId}/exists`)

    // If the game doesn't exist, remove our game id from our session storage
    // and return null.
    const gameExists: gameExistsResponse = serverResponse.data
    if (!gameExists) {
        sessionStorage.removeItem(gameIdKey)
        return null
    }

    // Otherwise, we're good.
    return gameId
}
const router = createBrowserRouter([
    {
        path: "*",
        element: <App />,
        loader: loadSavedGameId,
    },
])

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>
)
