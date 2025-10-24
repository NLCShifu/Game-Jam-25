class Session:
    session_id: str
    username: str
    created_at: str

    def __init__(self, session_id: str, username: str, created_at: str):
        self.session_id = session_id
        self.username = username
        self.created_at = created_at

    def to_dict(self):
        return {
            "session_id": self.session_id,
            "username": self.username,
            "created_at": self.created_at,
        }
