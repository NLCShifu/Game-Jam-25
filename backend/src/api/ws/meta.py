from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from services.rooms_service import validate_session, rooms

router = APIRouter()

def send_room_info(room_id: str):
    room = rooms[room_id]
    for session in room.sessions.values():
        if session.ws_meta:
            participants = [
                {
                    "username": s.username,
                }
                for s in room.sessions.values()
            ]
            session.ws_meta.send_json({"room_update" :{
                "participants": participants
                }})

@router.websocket("/ws/meta/{room_id}")
async def ws_meta(websocket: WebSocket, room_id: str, session_id: str):
    session = validate_session(session_id, room_id)
    await websocket.accept()

    participant = rooms[room_id].sessions.get(session_id)
    if participant:
        participant.add_ws_meta(websocket)

    try:
        send_room_info(room_id)
        while True:
            request: dict[str, int | str] = await websocket.receive_json()
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
                    case "action":
                        if request_value == "start_game":
                            rooms[room_id].gameState.start_game()
                            send_room_info(room_id)
                    case _:
                        print(f"Unknown ws_meta request key: {request_key}")
    except WebSocketDisconnect:
        if session.ws_meta:
            session.ws_meta = None
