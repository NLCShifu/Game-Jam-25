// ...existing code...
import { useNavigate, useParams } from "react-router"
import axios from "axios"

import "./WaitingRoom.css"
import WaitingRoomPlayerInfo, { type PlayerData } from "./WaitingRoomPlayerInfo"
import { useEffect, useReducer, useRef, useState } from "react";
import ButtonSquare from "../../components/Buttons/ButtonSquare";
import ButtonWide from "../../components/Buttons/ButtonWide";
import PopupWindow from "../../components/PopupWindow";
import RoomId from "./RoomId";
import { useVideo } from "../../contexts/VideoContext";
import WebcamDisplay from "../../components/Webcam/WebcamDisplay";
import OtherCameraDisplay from "../../components/Webcam/OtherCameraDisplay";
import { useAudio } from "../../contexts/AudioContext";
import { useMeta } from "../../contexts/MetaContext";

type ParticipantInfo = {
    session_id: string,
    display_name: string,
    joined_at: string
}

function WaitingRoom() {
    const navigate = useNavigate();

    let { room_id, session_id } = useParams()

    const { openConnection: openVideoConnection, closeConnection: closeVideoConnection, sendVideoFrame } = useVideo();
    const { openConnection: openAudioConnection, closeConnection: closeAudioConnection, sendAudioFrame } = useAudio();
    const { openConnection: openMetaConnection, closeConnection: closeMetaConnection, roomState } = useMeta();

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

    const [participants, setParticipants] = useState<ParticipantInfo[]>([])
    const [canStart, setCanStart] = useState(false);
    const [isStreaming, setIsStreaming] = useState(false);
    const autoStartRef = useRef(false);

    useEffect(() => {
        openVideoConnection(room_id!, session_id!);

        openAudioConnection(room_id!, session_id!);

        openMetaConnection(room_id!, session_id!);
    }, []);

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

        let mounted = true;

        const fetchParticipants = async () => {
            try {
                const resp = await axios.get(`http://localhost:8000/rooms/${room_id}`, {
                    headers: { "Accept": "application/json" }
                })
                // console.log(resp.data);
                if (!mounted) return;
                const list: ParticipantInfo[] = resp.data.participants || []
                setParticipants(list)
                setCanStart(list.length === 2)
            } catch (e) {
                console.error("Failed to fetch participants", e)
            }
        }

        fetchParticipants()
        const interval = setInterval(fetchParticipants, 2000)

        return () => {
            mounted = false
            clearInterval(interval)
        }
    }, [room_id, navigate])

    useEffect(() => {
        if (!canStart) {
            setIsStreaming(false)
            autoStartRef.current = false
            return
        }
        if (!autoStartRef.current) {
            setIsStreaming(true)
            autoStartRef.current = true
        }
    }, [canStart])

    const exitRoom = () => {
        console.log("EXIT");

        closeVideoConnection();
        closeAudioConnection();
        closeMetaConnection();

        // TODO: appeler un endpoint pour quitter proprement si existant
        navigate("/");
    }

    const getOwn = (session_id: string | undefined) => {
        if (!session_id) return undefined;
        return roomState?.participants.find((p) => p.session_id == session_id)
    }

    const getOther = (session_id: string | undefined) => {
        if (!session_id) return undefined;
        return roomState?.participants.find((p) => p.session_id != session_id)
    }

    const ownParticipant = getOwn(session_id);
    const otherParticipant = getOther(session_id);

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
                <WaitingRoomPlayerInfo name={ownParticipant?.username ?? ""} hasJoined={!!ownParticipant} isOwn={true} cameraDisplay={<WebcamDisplay sendVideoData={sendVideoFrame} sendAudioData={sendAudioFrame} />} />
                <WaitingRoomPlayerInfo name={otherParticipant?.username ?? ""} hasJoined={!!otherParticipant} isOwn={false} cameraDisplay={<OtherCameraDisplay />} />
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