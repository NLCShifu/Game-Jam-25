from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from services.rooms_service import validate_session, rooms

router = APIRouter()

async def send_room_info(room_id: str):
    room = rooms[room_id]
    participants = [{"username": s.username, "session_id": s.session_id} for s in room.sessions.values()]
    for s in room.sessions.values():
        if s.ws_meta:
            try:
                await s.ws_meta.send_json({"room_update": {"participants": participants}})
            except Exception:
                # Si l'envoi échoue, nettoyer la référence
                s.ws_meta = None

@router.websocket("/ws/meta/{room_id}")
async def ws_meta(websocket: WebSocket, room_id: str, session_id: str):
    auth_info = validate_session(session_id, room_id)  # évite la confusion avec 'participant'
    await websocket.accept()

    participant = rooms[room_id].sessions.get(session_id)
    if participant:
        participant.add_ws_meta(websocket)

    try:
        await send_room_info(room_id)
        while True:
            request: dict[str, int | str] = await websocket.receive_json()
            print(request)
            for request_key, request_value in request.items():
                match request_key:
                    case "meme":
                        for s in rooms[room_id].sessions.values():
                            if s.session_id != session_id and s.ws_meta:
                                await s.ws_meta.send_json({"meme": request_value})
                        break
                    case "sound":
                        for s in rooms[room_id].sessions.values():
                            if s.session_id != session_id and s.ws_meta:
                                await s.ws_meta.send_json({"sound": request_value})
                        break
                    case "action":
                        if request_value == "start_game":
                            # AVANT: rooms[room_id].start_game()
                            await rooms[room_id].start_game()
                            print(rooms[room_id].gameState)
                            await send_room_info(room_id)
                    case _:
                        print(f"Unknown ws_meta request key: {request_key}")
    except WebSocketDisconnect:
        if participant and participant.ws_meta:
            participant.ws_meta = None
        await send_room_info(room_id)
