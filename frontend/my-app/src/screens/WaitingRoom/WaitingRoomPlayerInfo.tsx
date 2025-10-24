type PropTypes = {
    playerNumber: number,
    hasJoined: boolean,
    displayName: string
};

function WaitingRoomPlayerInfo({
    playerNumber,
    hasJoined,
    displayName
}: Readonly<PropTypes>) {
    return (
        <div>
            {playerNumber} - {hasJoined} - {displayName}
        </div>
    )
}

export default WaitingRoomPlayerInfo