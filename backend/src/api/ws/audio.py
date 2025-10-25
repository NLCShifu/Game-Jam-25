from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from services.rooms_service import validate_session, rooms

router = APIRouter()


@router.websocket("/ws/audio/{room_id}")
async def ws_audio(websocket: WebSocket, room_id: str, session_id: str):
    session = validate_session(session_id, room_id)
    await websocket.accept()
    participant = rooms[room_id].sessions.get(session_id) if session else None

    if participant:
        participant.add_ws_audio(websocket)

    try:
        while True:
            data = await websocket.receive_bytes()
            if participant is None:
                continue

            # broadcast to others (no echo)
            for sid, sess in list(rooms[room_id].sessions.items()):
                if sid == participant.session_id:
                    continue
                target_ws = sess.ws_audio
                if target_ws:
                    try:
                        await target_ws.send_bytes(data)
                    except Exception:
                        # cible déconnectée -> cleanup
                        sess.ws_audio = None

    except WebSocketDisconnect:
        if participant:
            participant.ws_audio = None
