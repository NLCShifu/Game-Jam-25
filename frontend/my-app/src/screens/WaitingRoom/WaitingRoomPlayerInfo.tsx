type PlayerData = {
    playerNumber: number,
    hasJoined: boolean,
    displayName: string
}

type PropTypes = {
    playerData: PlayerData
};

function WaitingRoomPlayerInfo({ playerData }: Readonly<PropTypes>) {
    return (
        <div className="playerInfo">
            {playerData.playerNumber} - {playerData.hasJoined.toString()} - {playerData.displayName}
        </div>
    )
}

export type { PlayerData }

export default WaitingRoomPlayerInfo