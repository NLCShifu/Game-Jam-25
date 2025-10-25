from .session import Session
from typing import List


class Room:
    def __init__(
        self,
        uuid: str,
        sessions: dict[str, Session] = {},
    ):
        self.uuid = uuid
        self.sessions = sessions

    def add_sessions(self, session: Session) -> None:
        self.sessions[session.session_id] = session

    def to_dict(self) -> dict[str, str | List[dict[str, str]]]:
        return {
            "uuid": self.uuid,
            "participants": [
                {"session_id": s.session_id, "display_name": s.username}
                for s in self.sessions.values()
            ],
        }
