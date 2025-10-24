from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException, Header
from pydantic import BaseModel
from datetime import datetime, timedelta
import uuid, asyncio

rooms = {}
sessions = {}

app = FastAPI()


class JoinRequest(BaseModel):
    display_name: str


@app.post("/rooms")
def create_room(title: str):
    room_id = str(uuid.uuid4())
    rooms[room_id] = {
        "title": title,
        "participants": {},
        "meta_history": [],
        "video_history": [],
    }
    return {"room_id": room_id}


@app.post("/rooms/{room_id}/join")
def join_room(room_id: str, body: JoinRequest):
    if room_id not in rooms:
        raise HTTPException(404, "Room not found")
    session_id = str(uuid.uuid4())
    expires = datetime.utcnow() + timedelta(minutes=10)
    sessions[session_id] = {
        "room_id": room_id,
        "user_name": body.display_name,
        "expires": expires,
    }
    return {"session_id": session_id}


def validate_session(session_id: str, room_id: str):
    if session_id not in sessions:
        raise HTTPException(401, "Invalid session")
    s = sessions[session_id]
    if s["room_id"] != room_id or s["expires"] < datetime.utcnow():
        raise HTTPException(401, "Session expired")
    return s


@app.websocket("/ws/meta/{room_id}")
async def ws_meta(websocket: WebSocket, room_id: str, session_id: str):
    session = validate_session(session_id, room_id)
    await websocket.accept()
    participant = {"name": session["user_name"], "ws_meta": websocket, "ws_video": None}
    rooms[room_id]["participants"][session_id] = participant
    try:
        while True:
            msg = await websocket.receive_text()
            # broadcast to other participants
            for sid, p in rooms[room_id]["participants"].items():
                if sid != session_id and p["ws_meta"]:
                    await p["ws_meta"].send_text(f"{participant['name']}: {msg}")
    except WebSocketDisconnect:
        del rooms[room_id]["participants"][session_id]


@app.websocket("/ws/video/{room_id}")
async def ws_video(websocket: WebSocket, room_id: str, session_id: str):
    session = validate_session(session_id, room_id)
    await websocket.accept()
    participant = rooms[room_id]["participants"][session_id]
    participant["ws_video"] = websocket
    try:
        while True:
            frame = await websocket.receive_bytes()
            # broadcast to other participants
            for sid, p in rooms[room_id]["participants"].items():
                if sid != session_id and p["ws_video"]:
                    await p["ws_video"].send_bytes(frame)
    except WebSocketDisconnect:
        participant["ws_video"] = None
