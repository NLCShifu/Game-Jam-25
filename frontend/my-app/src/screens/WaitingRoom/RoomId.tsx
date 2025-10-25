import { useState } from "react";
import PopupWindow from "../../components/PopupWindow";

type PropTypes = {
    room_id: string;
};

function RoomId({ room_id }: Readonly<PropTypes>) {
    const [copied, setCopied] = useState(false);

    const copy = async () => {
        await navigator.clipboard.writeText(room_id);
        setCopied(true);

        // Hide the "copied" message after 1.5 seconds
        setTimeout(() => setCopied(false), 1500);
    };

    return (
        <div style={{ position: "relative", textAlign: "center" }}>
            <div
                onClick={copy}
                style={{ cursor: "pointer" }}
                title="Click to copy the room code"
            >
                <PopupWindow color="basic pink" className="roomId">
                    <div id="roomCopy">
                        <strong>Room code:</strong>
                        <br />
                        <small>(click to copy)</small>
                    </div>
                    <span>{room_id}</span>
                </PopupWindow>
            </div>


            <span
                style={{
                    position: "absolute",
                    left: "50%",                 // center horizontally
                    bottom: "calc(100% + 8px)",  // place above the popup
                    // transform: "translate(-50%, -8px)", // -50% centers it; -8px adds a gap
                    marginLeft: "-50%",
                    width: "100%",
                    backgroundColor: "rgba(255, 192, 203, 0.9)",
                    opacity: copied ? 1 : 0,
                    color: "#333",
                    // padding: "4px 10px 4px 10px",
                    borderRadius: "8px",
                    fontSize: "0.9rem",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
                    whiteSpace: "nowrap",
                    transition: "opacity 0.1s ease-in-out",
                }}
            >
                Copied!
            </span>


        </div>
    );
}

export default RoomId;
