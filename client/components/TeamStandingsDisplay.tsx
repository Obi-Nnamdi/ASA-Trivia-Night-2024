import { PlayerState } from "../../server/TriviaGameTypeDefs"
import CompletedCategoriesDisplay from "./CompletedCategoriesDisplay"
import IndicatorTriangle from "../assets/vectors/indicator-triangle.svg"

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
        <div className="u-flex-column u-align-center">
            {/* Add indicator triangle if we're the current player. */}
            {currentPlayer ? (
                <img
                    src={IndicatorTriangle}
                    className="StandingsPage-indicatorTriangle"
                />
            ) : (
                <></>
            )}
            <div className="StandingsPage-teamDisplay">{player.name}</div>
            <CompletedCategoriesDisplay
                completedCategories={player.completedCategories}
                allCategories={allQuestionCategories}
            />
        </div>
    )
}

export default TeamStandingsDisplay
