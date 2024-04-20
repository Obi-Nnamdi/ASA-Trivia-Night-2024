import axios from "axios"
import { createGameResponse } from "../../server/serverTypeDefs"
import { useNavigate } from "react-router-dom"
import { STANDINGS_PAGE_ROUTE_NAME } from "./pageRouteNames"
import { useEffect, useState } from "react"
import { generateUniqueId } from "../../server/helpers"
import TeamCreationSlot from "../components/TeamCreationSlot"

// import "../utilities.css"
import "./GameCreationPage.css"

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
// Impose limits for creating the game, there should be at least two players and no more than 5.
const MIN_NUM_TEAMS = 2 // TODO: use.
const MAX_NUM_TEAMS = 5
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
    >([makeTeamSlotObject(), makeTeamSlotObject()])

    // Creates a new team creation slot with a random id.
    function makeTeamSlotObject(): TeamCreationEntry {
        return {
            id: generateUniqueId(),
            name: "",
        }
    }
    function createTeamSlot() {
        const newTeamCreationSlot: TeamCreationEntry = makeTeamSlotObject()
        setTeamCreationSlots([...teamCreationSlots, newTeamCreationSlot])
        return newTeamCreationSlot
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
        <div
            className="u-flex-column main-page-centered-container"
            id="GameCreation-mainContainer"
        >
            <h2 className="page-main-title">Team Creation</h2>
            {teamCreationSlots.map((slot, index) => (
                <TeamCreationSlot
                    key={slot.id}
                    id={slot.id}
                    index={index}
                    changeTeamSlotName={changeTeamSlotName}
                    deleteTeamSlot={deleteTeamSlot}
                />
            ))}
            {/* Only display team addition dialogue if there's less than 5 teams. */}
            {teamCreationSlots.length < MAX_NUM_TEAMS ? (
                <button
                    className="u-no-margin u-pointer-cursor"
                    id="GameCreation-addTeamButton"
                    onClick={createTeamSlot}
                >
                    + Add Team
                </button>
            ) : (
                <></>
            )}
            <button
                id="GameCreation-beginButton"
                className="importantButton"
                onClick={sendStartGameRequest}
            >
                <p className="u-no-margin">Begin!</p>
            </button>
        </div>
    )
}

export default GameCreationPage
