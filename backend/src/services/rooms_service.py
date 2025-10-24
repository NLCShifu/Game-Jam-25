from datetime import datetime

rooms = {}
sessions = {}


def validate_session(session_id: str, room_id: str):
    if session_id not in sessions:
        raise ValueError("Invalid session")
    s = sessions[session_id]
    if s["room_id"] != room_id or s["expires"] < datetime.utcnow():
        raise ValueError("Session expired")
    return s
