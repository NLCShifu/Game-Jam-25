import { forwardRef, useState } from "react";
import PopupWindow from "../../components/PopupWindow"

type PropTypes = {
    room_id: string
}

function RoomId({ room_id }: Readonly<PropTypes>) {
    const [copied, setCopied] = useState(false);

    // const notif = forwardRef(<span id="copyNotification">copied!</span>);

    const copy = async () => {
        await navigator.clipboard.writeText(room_id);

        // console.log("JFKLDSJF");
        // setCopied(true);
        // notif.
    }

    return (
        <div style={{ position: "relative" }}>
            <div onClick={copy}>
                <PopupWindow color="basic pink" className="roomId">
                    <div id="roomCopy">
                        room code:<br />(click to copy)
                    </div> 
                    <span>{room_id}</span>
                </PopupWindow>
            </div>
            <span id="copyNotification">copied!</span>
        </div>
    )
}

export default RoomId