from enum import Enum

class GamePhase(Enum):
    WAITING = "waiting"
    PLAYING = "playing"
    FINISHED = "finished"