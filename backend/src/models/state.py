from .emotion import Emotion


class State:
    emotion: Emotion = Emotion.DEFAULT
    lives: int = 3
    has_lost: bool = False

    def reset(self):
        self.emotion = Emotion.DEFAULT
        self.lives = 3
        self.has_lost = False

    def laugh(self):
        self.emotion = Emotion.LAUGHING
        self.lives -= 1
        if self.lives == 0:
            self.has_lost = True

    def update_emotion(self, new_emotion: Emotion):
        self.emotion = new_emotion
        if self.emotion == Emotion.LAUGHING:
            self.laugh()

    def to_dict(self):
        return {
            "emotion": self.emotion.value,
            "lives": self.lives,
            "has_lost": self.has_lost,
        }
