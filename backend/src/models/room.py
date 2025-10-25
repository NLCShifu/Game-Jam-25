from typing import List
from .session import Session
from .gameState import GameState

class Room:
    def __init__(
        self,
        uuid: str,
        title: str,
        sessions: dict[str, Session] = {},
        meta_history: list = [],
        video_history: list = [],
    ):
        self.uuid = uuid
        self.title = title
        self.sessions = sessions
        self.gameState = GameState(self.uuid)
        self.meta_history = meta_history
        self.video_history = video_history

    def add_sessions(self, session: Session):
        self.sessions[session.session_id] = session

    def to_dict(self):
        return {
            "uuid": self.uuid,
            "title": self.title,
            "session": self.sessions,
        }

    def update(self):
        """
        Updates the room logic:
        - Sync the gameState from the players states
        - Evaluate end conditions
        - Broacasts clients if something changed
        """


