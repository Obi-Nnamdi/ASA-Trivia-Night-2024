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
        <>
            <button onClick={() => deleteTeamSlot(id)}>X</button>
            <label htmlFor={id}>Team {index + 1}</label>
            <input
                type="text"
                id={id}
                placeholder={`Team ${index + 1}`}
                onChange={(e) => changeTeamSlotName(id, e.target.value)}
            />
        </>
    )
}

export default TeamCreationSlot
