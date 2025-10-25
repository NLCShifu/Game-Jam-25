import { useNavigate, useParams } from "react-router"

import "./WaitingRoom.css"
import WaitingRoomPlayerInfo, { type PlayerData } from "./WaitingRoomPlayerInfo"
import { useEffect, useReducer, useState } from "react";
import ButtonSquare from "../../components/Buttons/ButtonSquare";
import ButtonWide from "../../components/Buttons/ButtonWide";
import PopupWindow from "../../components/PopupWindow";
import RoomId from "./RoomId";

type ParticipantInfo = {
    session_id: string,
    display_name: string,
    joined_at: string
}

function WaitingRoom() {
    const navigate = useNavigate();
    let { room_id, session_id } = useParams()

    // retrieve players currently in room
    // this will use useWebsocket to automatically update when new data is received

    const reducer = (state: PlayerData, participants: ParticipantInfo[]): PlayerData => {
        const hasJoined = participants.length >= state.playerNumber;

        return {
            playerNumber: state.playerNumber,
            hasJoined,
            displayName: hasJoined ? participants[state.playerNumber-1].display_name : ""
        }
    }
    
    const [playerOneData, playerOneDispatch] = useReducer(reducer, { playerNumber: 1, hasJoined: false, displayName: "" })
    const [playerTwoData, playerTwoDispatch] = useReducer(reducer, { playerNumber: 2, hasJoined: false, displayName: "" })

    const [canStart, setCanStart] = useState(false);

    useEffect(() => {
        // test participants
        let participants = {
            "participants": [
                {
                    "session_id": "test_id",
                    "display_name": "Name",
                    "joined_at": "never. they aren't real. you have to move on."
                },
                // {
                //     "session_id": "fhjkhf",
                //     "display_name": "FBWEOFOWF",
                //     "joined_at": "fnkdon."
                // }
            ]
        };

        playerOneDispatch(participants.participants);
        playerTwoDispatch(participants.participants);

        setCanStart(participants.participants.length === 2);
    }, [])

    const exitRoom = () => {
        // POST leaving the room using room id and session id

        navigate("/");
    }

    return (
        <div className="waitingRoom imageBackground">
            <div style={{ "flexGrow": 1 }} />

            {/* <div onClick={async () => await navigator.clipboard.writeText(room_id!)}>
                <PopupWindow color="basic pink" className="roomId">
                    <div>room code:<br />(click to copy)</div> <span>{room_id}</span>
                </PopupWindow>
            </div> */}
            <RoomId room_id={room_id!} />

            <div className="playerInfoPanels">
                <WaitingRoomPlayerInfo playerData={playerOneData} />
                <WaitingRoomPlayerInfo playerData={playerTwoData} />
            </div>

            {/* <div className="startButton">
                <button disabled={!canStart}>START</button>
                
            </div> */}
            <div className="startButton">
                <ButtonWide color="basic yellow" text="START" size={0.6} />
            </div>
            
            {/* <button className="exitButton" onClick={exitRoom}>X</button> */}
            <div className="exitButton">
                <ButtonSquare iconName="icons cross.png" color="basic red" onClick={exitRoom} size={40} />
            </div>
        </div>
    )
}

export default WaitingRoom