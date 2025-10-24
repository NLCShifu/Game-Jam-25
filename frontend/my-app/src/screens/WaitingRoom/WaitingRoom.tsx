import { useParams } from "react-router"

import "./WaitingRoom.css"
import WaitingRoomPlayerInfo from "./WaitingRoomPlayerInfo"

function WaitingRoom() {
    let { room_id, session_id } = useParams()

    // retrieve players currently in room
    let participants = {
        "participants": [
            {
                "session_id": "test_id",
                "display_name": "Name",
                "joined_at": "never. they aren't real. you have to move on."
            }
        ]
    };

    return (
        <div className="waitingRoom">
            <p>{room_id}</p><br />
            <p>{session_id}</p>
            {/* <WaitingRoomPlayerInfo playerNumber={1} /> */}
        </div>
    )
}

export default WaitingRoom