import axios from "axios"
import { createGameResponse } from "../../server/serverTypeDefs"
import { useNavigate } from "react-router-dom"
import { STANDINGS_PAGE_ROUTE_NAME } from "./pageRouteNames"

// Page for starting a new game.
interface Props {
    // Basically takes in a setGameId state change function from another component.
    setGameId: React.Dispatch<React.SetStateAction<string | undefined>>
}

function GameCreationPage({ setGameId }: Props) {
    const navigate = useNavigate()
    async function sendStartGameRequest() {
        // Create a new game and save its id
        const response = await axios.post("/api/game/createNew", {
            teamNames: ["test1", "test2"],
        })
        const data: createGameResponse = response.data
        const newGameId = data
        setGameId(newGameId)

        // Navigate to the standings page for the new game
        navigate(".." + STANDINGS_PAGE_ROUTE_NAME)
    }

    return (
        <div>
            <button onClick={sendStartGameRequest}>Start Game</button>
        </div>
    )
}

export default GameCreationPage
