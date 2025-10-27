from datetime import datetime
from src.models.session import Session
from src.models.room import Room

rooms: dict[str, Room] = {}
sessions = {}


def validate_session(session_id: str, room_id: str) -> Session:
    if session_id not in sessions:
        raise ValueError("Invalid session")
    s = sessions[session_id]
    if s["room_id"] != room_id or s["expires"] < datetime.utcnow():
        raise ValueError("Session expired")
    return s
