import PopupWindow from "../../components/PopupWindow";

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
        // <div className="playerInfo">
        //     {playerData.playerNumber} - {playerData.hasJoined.toString()} - {playerData.displayName}
        // </div>
        <PopupWindow color="basic orange" className="playerInfo">
            <span style={{ fontSize: "12px" }}>{playerData.hasJoined ? `Player ${playerData.playerNumber} ` : "..."}</span>
            <span style={{ fontSize: "30px" }}>{playerData.hasJoined ? `${playerData.displayName}` : "..."}</span>
            <div className="placeholder" />
        </PopupWindow>
    )
}

export type { PlayerData }

export default WaitingRoomPlayerInfo