// ...existing code...
import { useNavigate, useParams } from "react-router"
import axios from "axios"

import "./WaitingRoom.css"
import WaitingRoomPlayerInfo, { type PlayerData } from "./WaitingRoomPlayerInfo"
import { useEffect, useState, useRef } from "react";
import { RoomMediaProvider } from "./RoomMediaContext";
import OwnCamera from "./OwnCamera";
import PartnerCamera from "./PartnerCamera";
// ...existing code...

type ParticipantInfo = {
    session_id: string,
    display_name: string,
    joined_at: string
}

function WaitingRoom() {
    const navigate = useNavigate();
    const { room_id, session_id } = useParams<{ room_id: string, session_id: string }>()

    const [participants, setParticipants] = useState<ParticipantInfo[]>([])
    const [canStart, setCanStart] = useState(false);
    const [isStreaming, setIsStreaming] = useState(false);
    const autoStartRef = useRef(false);

    useEffect(() => {
        if (!room_id) {
            navigate("/");
            return;
        }

        let mounted = true;

        const fetchParticipants = async () => {
            try {
                const resp = await axios.get(`http://localhost:8000/rooms/${room_id}`, {
                    headers: { "Accept": "application/json" }
                })
                console.log(resp.data);
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
        // TODO: appeler un endpoint pour quitter proprement si existant
        navigate("/");
    }

    const makePlayerData = (playerNumber: number): PlayerData => {
        const idx = playerNumber - 1
        const hasJoined = participants.length > idx
        let displayName = ""

        if (hasJoined) {
            const p = participants[idx]
            // Mettre "Vous" si c'est la session courante
            if (p.session_id === session_id) {
                displayName = `${p.display_name} (Vous)`
            } else {
                displayName = p.display_name
            }
        } else {
            // message quand personne n'a encore rejoint cette place
            displayName = "Personne n'a encore rejoint"
        }

        return {
            playerNumber,
            hasJoined,
            displayName
        }
    }

    const playerOneData = makePlayerData(1)
    const playerTwoData = makePlayerData(2)

    return (
        <div className="waitingRoom">
            <div style={{ "flexGrow": 1 }} />

            <div className="playerInfoPanels">
                <WaitingRoomPlayerInfo playerData={playerOneData} />
                <WaitingRoomPlayerInfo playerData={playerTwoData} />
            </div>

            {room_id && session_id && (
                <RoomMediaProvider roomId={room_id} sessionId={session_id}>
                    <div style={{ display: 'flex', gap: 18, alignItems: 'flex-start', justifyContent: 'center', marginTop: 18 }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                            <div style={{ color: '#555', fontSize: 14 }}>Toi</div>
                            <OwnCamera
                                active={isStreaming}
                                style={{
                                    width: 360,
                                    maxWidth: '42vw',
                                    border: '2px solid #333',
                                    borderRadius: 8,
                                    overflow: 'hidden',
                                    background: '#000'
                                }}
                                videoStyle={{ borderRadius: 4, height: 202 }}
                            />
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                            <div style={{ color: '#555', fontSize: 14 }}>Ton pote</div>
                            <PartnerCamera
                                style={{
                                    width: 360,
                                    maxWidth: '42vw',
                                    border: '2px solid #333',
                                    borderRadius: 8,
                                    overflow: 'hidden',
                                    background: '#000'
                                }}
                                imageStyle={{ borderRadius: 4, background: '#000', height: 202 }}
                            />
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginLeft: 12 }}>
                            <div className="startButton">
                                <button className="startButton" disabled={!canStart}>START</button>
                            </div>

                            <button disabled={!canStart} onClick={() => setIsStreaming((prev) => !prev)}>
                                {isStreaming ? 'Stop streaming' : 'Start streaming'}
                            </button>
                        </div>
                    </div>
                </RoomMediaProvider>
            )}

            <button className="exitButton" onClick={exitRoom}>X</button>
        </div>
    )
}

export default WaitingRoom