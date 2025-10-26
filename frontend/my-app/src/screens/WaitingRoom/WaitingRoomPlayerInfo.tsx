import { useEffect, useState, type PropsWithChildren, type ReactNode } from "react";
import PopupWindow from "../../components/PopupWindow";

type PlayerData = {
    playerNumber: number;
    hasJoined: boolean;
    displayName: string;
};

type PropTypes = {
    name: string;
    hasJoined: boolean;
    isOwn: boolean;
    cameraDisplay: ReactNode;
};

function WaitingRoomPlayerInfo({ name, hasJoined, isOwn, cameraDisplay }: Readonly<PropTypes>) {
    const [dots, setDots] = useState("");

    useEffect(() => {
        if (hasJoined) return; // stop animation if joined

        const interval = setInterval(() => {
            setDots((prev) => (prev.length < 3 ? prev + "." : ""));
        }, 500); // one dot every 0.5s

        return () => clearInterval(interval);
    }, [hasJoined]);

    return (
        <PopupWindow color="basic orange" className="playerInfo">
            <span style={{ fontSize: "12px" }}>
                {isOwn ? `You` : `Them`}
            </span>
            <span style={{ fontSize: "30px" }}>
                {hasJoined ? name : "waiting" + dots}
            </span>
            {/* <div className="placeholder" /> */}
            {cameraDisplay}
        </PopupWindow>
    );
}

export type { PlayerData };
export default WaitingRoomPlayerInfo;
