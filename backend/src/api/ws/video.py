from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from services.rooms_service import validate_session, rooms

router = APIRouter()


@router.websocket("/ws/video/{room_id}")
async def ws_video(websocket: WebSocket, room_id: str, session_id: str):
    # Auth minimale
    session = validate_session(session_id, room_id)

    await websocket.accept()
    participant = rooms[room_id]["participants"].get(session_id)
    if participant:
        participant["ws_video"] = websocket

    try:
        while True:
            # reçoit un chunk vidéo (bytes ou base64)
            data = await websocket.receive_bytes()

            # broadcast à tous les autres participants du même room
            for sid, p in rooms[room_id]["participants"].items():
                if sid != session_id and p["ws_video"]:
                    await p["ws_video"].send_bytes(data)
    except WebSocketDisconnect:
        if participant:
            participant["ws_video"] = None
