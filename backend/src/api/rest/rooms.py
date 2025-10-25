from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import uuid
from datetime import datetime, timedelta
from services.rooms_service import rooms, sessions
from models.room import Room
from models.session import Session

router = APIRouter(prefix="/rooms", tags=["rooms"])


@router.post("")
def create_room():
    room_id = str(uuid.uuid4())
    room = Room(room_id)
    rooms[room_id] = room
    return {"room_id": room_id}


@router.get("/{room_id}")
def get_room(room_id: str):
    return (
        rooms.get(room_id).to_dict()
        if room_id in rooms
        else HTTPException(404, "Room not found")
    )


@router.post("/{room_id}/join")
def join_room(room_id: str):
    if room_id not in rooms:
        raise HTTPException(404, "Room not found")
    session_id = str(uuid.uuid4())
    username = "blank"
    session = Session(session_id, username)
    sessions[session_id] = {
        "room_id": room_id,
        "user_name": username,
        "expires": datetime.utcnow() + timedelta(minutes=10),
    }
    rooms[room_id].add_sessions(session)
    return {"session_id": session_id}
