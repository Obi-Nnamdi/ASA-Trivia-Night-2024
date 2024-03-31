import { PlayerState } from "../../server/TriviaGameTypeDefs"
import CompletedCategoriesDisplay from "./CompletedCategoriesDisplay"

// Component displaying the standings of a team/player, including the categories they have completed/incompleted.
interface Props {
    player: PlayerState
    allQuestionCategories: string[]
    currentPlayer: boolean
}

function TeamStandingsDisplay({
    player,
    allQuestionCategories,
    currentPlayer,
}: Props) {
    return (
        <div>
            <span>
                {player.name + (currentPlayer ? " (Current Player)" : "")}
            </span>
            <CompletedCategoriesDisplay
                completedCategories={player.completedCategories}
                allCategories={allQuestionCategories}
            />
        </div>
    )
}

export default TeamStandingsDisplay
