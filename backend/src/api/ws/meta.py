from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from services.rooms_service import validate_session, rooms

router = APIRouter()


@router.websocket("/ws/meta/{room_id}")
async def ws_meta(websocket: WebSocket, room_id: str, session_id: str):
    session = validate_session(session_id, room_id)
    ws = await websocket.accept()

    session.add_ws_meta(ws)

    try:
        while True:
            request: dict[str, int | str] = await ws.receive_json()
            for request_key, request_value in request.items():
                match request_key:
                    case "meme":
                        for session in rooms[room_id].sessions.values():
                            if session.session_id != session_id and session.ws_meta:
                                await session.ws_meta.send_json({"meme": request_value})
                        break
                    case "sound":
                        for session in rooms[room_id].sessions.values():
                            if session.session_id != session_id and session.ws_meta:
                                await session.ws_meta.send_json(
                                    {"sound": request_value}
                                )
                        break
                    case _:
                        print(f"Unknown ws_meta request key: {request_key}")
    except WebSocketDisconnect:
        if session.ws_meta:
            session.ws_meta = None
