from fastapi import WebSocket


class Session:
    session_id: str
    display_name: str
    ws_video: WebSocket | None

    def __init__(self, session_id: str, display_name: str):
        self.session_id = session_id
        self.username = display_name
        self.ws_video = None

    def to_dict(self):
        return {
            "session_id": self.session_id,
            "display_name": self.username,
        }

    def add_ws_video(self, websocket):
        self.ws_video = websocket
