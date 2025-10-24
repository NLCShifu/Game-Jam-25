from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import uuid
from datetime import datetime, timedelta
from services.rooms_service import rooms, sessions

router = APIRouter(prefix="/rooms", tags=["rooms"])


class JoinRequest(BaseModel):
    display_name: str


@router.post("")
def create_room(title: str):
    room_id = str(uuid.uuid4())
    rooms[room_id] = {
        "title": title,
        "participants": {},
        "meta_history": [],
        "video_history": [],
    }
    return {"room_id": room_id}


@router.post("/{room_id}/join")
def join_room(room_id: str, body: JoinRequest):
    if room_id not in rooms:
        raise HTTPException(404, "Room not found")
    session_id = str(uuid.uuid4())
    sessions[session_id] = {
        "room_id": room_id,
        "user_name": body.display_name,
        "expires": datetime.utcnow() + timedelta(minutes=10),
    }
    return {"session_id": session_id}
