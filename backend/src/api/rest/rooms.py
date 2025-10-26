import random
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from datetime import datetime, timedelta
from services.rooms_service import rooms, sessions
from services.id_service import generate_unique_id
from models.room import Room
from models.session import Session

router = APIRouter(prefix="/rooms", tags=["rooms"])


@router.post("")
def create_room():
    room_id = generate_unique_id()
    room = Room(room_id)
    rooms[room_id] = room
    return {"room_id": room_id}


@router.get("/{room_id}")
def get_room(room_id: str):
    print(rooms.get(room_id))
    return (
        rooms.get(room_id).to_dict()
        if room_id in rooms
        else HTTPException(404, "Room not found")
    )


@router.post("/{room_id}/join")
def join_room(room_id: str):
    if room_id not in rooms:
        raise HTTPException(404, "Room not found")
    session_id = generate_unique_id()
    with open("res/usernames.txt", "r") as file:
        lines = file.readlines()
    usernames = [line.strip() for line in lines]

    username = random.choice(usernames)
    # if len(rooms[room_id].sessions) >= 1:
    #     print(rooms[room_id].sessions)
    #     while username == rooms[room_id].sessions[0].username:
    #         username = random.choice(usernames)
    print(username)

    session = Session(session_id, username)
    sessions[session_id] = {
        "room_id": room_id,
        "user_name": username,
        "expires": datetime.utcnow() + timedelta(minutes=10),
    }
    rooms[room_id].add_sessions(session)
    return {"session_id": session_id}
