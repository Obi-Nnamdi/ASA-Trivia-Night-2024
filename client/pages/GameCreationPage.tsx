import axios from "axios"
import { createGameResponse } from "../../server/serverTypeDefs"
import { useNavigate } from "react-router-dom"
import { STANDINGS_PAGE_ROUTE_NAME } from "./pageRouteNames"
import { useState } from "react"
import { generateUniqueId } from "../../server/helpers"
import TeamCreationSlot from "../components/TeamCreationSlot"

// Page for starting a new game.
interface Props {
    // Basically takes in a setGameId state change function from another component.
    setGameId: React.Dispatch<React.SetStateAction<string | undefined>>
}

// Interface representing the data for a single team creation slot.
interface TeamCreationEntry {
    id: string
    name: string
}

// TODO: when generating team creation slots, be sure to map the index of the team creation slot to the team's actual index.
// TODO: define defualt team slots
// TODO: impose limits for creating the game, there should be at least two players and no more than 5.
// Add a property to the button such that it's only clickable when the form is valid (2-5 players, all team names are unique/non-empty).

function GameCreationPage({ setGameId }: Props) {
    const navigate = useNavigate()
    async function sendStartGameRequest() {
        // Create a new game and save its id
        // TODO: handle errors here more gracefully instead of just letting the function fail completely?
        const response = await axios.post("/api/game/createNew", {
            teamNames: teamCreationSlots.map((slot) => slot.name),
        })
        const data: createGameResponse = response.data
        const newGameId = data
        setGameId(newGameId)

        // Navigate to the standings page for the new game
        navigate(".." + STANDINGS_PAGE_ROUTE_NAME)
    }

    const [teamCreationSlots, setTeamCreationSlots] = useState<
        TeamCreationEntry[]
    >([])

    // Creates a new team creation slot with a random id.
    function createTeamSlot() {
        const newTeamCreationSlot: TeamCreationEntry = {
            id: generateUniqueId(),
            name: "",
        }
        setTeamCreationSlots([...teamCreationSlots, newTeamCreationSlot])
    }

    // Updates a slot with the given id to have the new name.
    function changeTeamSlotName(id: string, name: string) {
        const updatedSlots = teamCreationSlots.map((slot) => {
            // Make a new object with the updated name if the id matches.
            if (slot.id === id) {
                return { ...slot, name: name }
            }
            return slot
        })

        setTeamCreationSlots(updatedSlots)
    }

    // Delete the slot with the given id.
    function deleteTeamSlot(id: string) {
        const updatedSlots = teamCreationSlots.filter((slot) => slot.id !== id)
        setTeamCreationSlots(updatedSlots)
    }

    return (
        <>
            <h2>Team Creation</h2>
            {teamCreationSlots.map((slot, index) => (
                <TeamCreationSlot
                    key={slot.id}
                    id={slot.id}
                    index={index}
                    changeTeamSlotName={changeTeamSlotName}
                    deleteTeamSlot={deleteTeamSlot}
                />
            ))}
            <button onClick={createTeamSlot}>Add Team</button>
            <button onClick={sendStartGameRequest}>Begin!</button>
        </>
    )
}

export default GameCreationPage
