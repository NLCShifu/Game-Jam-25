from models.session import Session



def won_round(winner_session: Session, loser_session: Session, room_id: str):
    winner.session.ws_meta.send_json({
        "your_life": winner.session.state.lives,
        "opponent_life": loser.session.state.lives,
        "won_round": True,
    })
    loser.session.ws_meta.send_json({
        "your_life": loser.session.state.lives,
        "opponent_life": winner.session.state.lives,
        "won_round": False,
    })
    
def game_over(final_winner: Session, final_loser: Session, room_id: str):
    final_winner.session.ws_meta.send_json({
        "game_over": True,
        "you_won": True,
    })
    final_loser.session.ws_meta.send_json({
        "game_over": True,
        "you_won": False,
    })
