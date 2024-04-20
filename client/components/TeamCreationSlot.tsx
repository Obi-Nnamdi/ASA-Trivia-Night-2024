// Component representing a single team creation slot.
interface Props {
    id: string
    index: number
    changeTeamSlotName: (id: string, name: string) => void
    deleteTeamSlot: (id: string) => void
}

function TeamCreationSlot({
    id,
    index,
    changeTeamSlotName,
    deleteTeamSlot,
}: Props) {
    return (
        <span className="TeamCreationSlot-mainContainer">
            <button
                className="u-pointer-cursor"
                onClick={() => deleteTeamSlot(id)}
            >
                Remove
            </button>
            <label htmlFor={id}>{index + 1}</label>
            <div className="TeamCreationSlot-dividingLine"></div>
            <input
                type="text"
                id={id}
                placeholder={`Team ${index + 1}`}
                onChange={(e) => changeTeamSlotName(id, e.target.value)}
            />
        </span>
    )
}

export default TeamCreationSlot
