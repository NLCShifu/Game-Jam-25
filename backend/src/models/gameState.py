from typing import Dict, List
from unittest.mock import DEFAULT

from .gamePhase import GamePhase
from .session import Session
from .round import Round


class GameState:
    def __init__(self, room_id: str):
        self.room_id: str = room_id
        self.phase: GamePhase = GamePhase.WAITING
        self.current_winner: Session | None
        self.final_winner: Session | None
        self.round: Round = Round.DEFAULT


    def _alive_players(self, sessions: Dict[str, Session]) -> List[Session]:
        return [
            s for s in sessions.values()
            if not s.state.has_lost and s.state.lives > 0
        ]

    def _enough_players(self, sessions: Dict[str, Session]) -> bool:
        return len(sessions) > 2

    def start_if_ready(self, sessions: Dict[str, Session]) -> None:
        if self.phase == GamePhase.WAITING and self._enough_players(sessions):
            self.phase = GamePhase.PLAYING
            self.round = DEFAULT  # changer + tard

    def update(self, sessions: Dict[str, Session]) -> None:
        """
        Main tick to call from Room.update()
        """
        self.start_if_ready(sessions)

        # If ongoing game
        if self.phase == GamePhase.PLAYING:
            alive = self._alive_players(sessions)

            if len(alive) == 1:
                self.current_winner = alive[0].session_id
                self.final_winner = alive[0].session_id
                self.phase = GamePhase.FINISHED
            else:
                # Determiner qui gagne pour le moment, où si c'est un tie
                if alive[0].state.lives == alive[1].state.lives:
                    # it's a tie
                    self.current_winner = None
                elif alive[0].state.lives > alive[1].state.lives:
                    self.current_winner = alive[0].session_id
                else:
                    self.current_winner = alive[1].session_id

    def new_round(self, new_round: Round):
        self.round = new_round

    def new_game(self, sessions: Dict[str, Session]):
        for s in sessions.values():
            s.state.reset()  # resets lives, but not score.

        self.current_winner = None
        self.final_winner = None
        self.round = Round.DEFAULT
        self.phase = GamePhase.WAITING


