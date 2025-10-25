from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from services.rooms_service import validate_session, rooms

router = APIRouter()


@router.websocket("/ws/video/{room_id}")
async def ws_video(websocket: WebSocket, room_id: str, session_id: str):
    # Auth minimale
    session = validate_session(session_id, room_id)

    await websocket.accept()
    participant = rooms[room_id].sessions[session_id] if session else None
    if participant:
        participant.add_ws_video(websocket)

    try:
        while True:
            # reçoit un chunk vidéo (bytes ou base64)
            data = await websocket.receive_bytes()

            # broadcast à tous les autres participants du même room
            for session_id, session in rooms[room_id].sessions.items():
                if (
                    participant
                    and participant.session_id != session.session_id
                    and session.ws_video
                ):
                    await session.ws_video.send_bytes(data)
    except WebSocketDisconnect:
        if participant:
            participant.ws_video = None
