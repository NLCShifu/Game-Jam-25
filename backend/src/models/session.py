class Session:
    session_id: str
    display_name: str

    def __init__(self, session_id: str, display_name: str):
        self.session_id = session_id
        self.username = display_name

    def to_dict(self):
        return {
            "session_id": self.session_id,
            "display_name": self.username,
        }
