from fastapi import WebSocket
from .state import State


class Session:
    session_id: str
    username: str
    ws_video: WebSocket | None
    ws_audio: WebSocket | None

    def __init__(self, session_id: str, username: str):
        self.session_id = session_id
        self.username = username
        self.state = State()
        self.ws_video = None
        self.ws_audio = None

    def to_dict(self):
        return {
            "session_id": self.session_id,
            "username": self.username,
        }

    def add_ws_video(self, websocket):
        self.ws_video = websocket

    def add_ws_audio(self, websocket):
        self.ws_audio = websocket
