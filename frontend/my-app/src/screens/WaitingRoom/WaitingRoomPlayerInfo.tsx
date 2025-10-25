import { useEffect, useState } from "react";
import PopupWindow from "../../components/PopupWindow";

type PlayerData = {
    playerNumber: number;
    hasJoined: boolean;
    displayName: string;
};

type PropTypes = {
    playerData: PlayerData;
};

function WaitingRoomPlayerInfo({ playerData }: Readonly<PropTypes>) {
    const [dots, setDots] = useState("");

    useEffect(() => {
        if (playerData.hasJoined) return; // stop animation if joined

        const interval = setInterval(() => {
            setDots((prev) => (prev.length < 3 ? prev + "." : ""));
        }, 500); // one dot every 0.5s

        return () => clearInterval(interval);
    }, [playerData.hasJoined]);

    return (
        <PopupWindow color="basic orange" className="playerInfo">
            <span style={{ fontSize: "12px" }}>

                {`Player ${playerData.playerNumber}`}

            </span>
            <span style={{ fontSize: "30px" }}>
                {playerData.hasJoined ? playerData.displayName : "waiting" + dots}
            </span>
            <div className="placeholder" />
        </PopupWindow>
    );
}

export type { PlayerData };
export default WaitingRoomPlayerInfo;
