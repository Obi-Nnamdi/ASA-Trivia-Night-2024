// Component displaying the completed categories of a player.
import EntertainmentIcon from "../assets/icons/entertainment_icon.svg"
import SportsIcon from "../assets/icons/sports_icon.svg"
import GeographyIcon from "../assets/icons/geography_icon.svg"
import HistoryIcon from "../assets/icons/history_icon.svg"
import GovernmentIcon from "../assets/icons/government_icon.svg"
interface Props {
    allCategories: string[]
    completedCategories: string[]
}

const categoryIconsMap: Map<string, string> = new Map([
    ["Entertainment", EntertainmentIcon],
    ["Sports", SportsIcon],
    ["Geography", GeographyIcon],
    ["History", HistoryIcon],
    ["Government", GovernmentIcon],
])

function CompletedCategoriesDisplay({
    allCategories,
    completedCategories,
}: Props) {
    const categoryCompletionMap = new Map<string, boolean>()
    allCategories.forEach((category) => {
        categoryCompletionMap.set(
            category,
            completedCategories.includes(category)
        )
    })
    // Create an image for each category, changing its class based on if the category is completed or not */
    return (
        <div className="u-flex-column u-align-center">
            {Array.from(categoryIconsMap.entries()).map(
                ([category, assetLocation], index) => (
                    <img
                        src={assetLocation}
                        key={index}
                        className={
                            (categoryCompletionMap.get(category)
                                ? "StandingsPage-completedCategory"
                                : "StandingsPage-incompleteCategory") +
                            " StandingsPage-categoryIcon"
                        }
                    />
                )
            )}
        </div>
    )
}

export default CompletedCategoriesDisplay
