from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from services.rooms_service import validate_session, rooms

router = APIRouter()


@router.websocket("/ws/meta/{room_id}")
async def ws_meta(websocket: WebSocket, room_id: str, session_id: str):
    session = validate_session(session_id, room_id)
    await websocket.accept()
    participant = {"name": session["user_name"], "ws_meta": websocket, "ws_video": None}
    rooms[room_id]["participants"][session_id] = participant

    try:
        while True:
            msg = await websocket.receive_text()
            for sid, p in rooms[room_id]["participants"].items():
                if sid != session_id and p["ws_meta"]:
                    await p["ws_meta"].send_text(f"{participant['name']}: {msg}")
    except WebSocketDisconnect:
        del rooms[room_id]["participants"][session_id]
