from typing import List
from .session import Session
from .gameState import GameState

class Room:


    def __init__(
        self,
        uuid: str,
        sessions: dict[str, Session] | None = None,
    ):

        self.uuid = uuid
        self.gameState = GameState(self.uuid)
        self.sessions = sessions or {}

    def add_sessions(self, session: Session):
        self.sessions[session.session_id] = session

    def to_dict(self) -> dict[str, str | List[dict[str, str]]]:
        return {
            "uuid": self.uuid,
            "participants": [
                {"session_id": s.session_id, "username": s.username}
                for s in self.sessions.values()
            ],
        }
    
    async def start_game(self):
        if (self.gameState.start_if_ready(self.sessions)):
            for session in self.sessions.values():
                if session.ws_meta:
                    print(f"Notifying session {session.session_id} about game start")
                    await session.ws_meta.send_json({"game_started": True})
    

    def update(self):
        """
        Updates the room logic:
        - Sync the gameState from the players states
        - Evaluate end conditions
        - Broacasts clients if something changed
        """

    def __str__(self) -> str:
        return f"Room(uuid={self.uuid}, sessions={list(self.sessions.keys())})"


