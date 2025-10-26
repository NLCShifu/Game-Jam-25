from fastapi import APIRouter, Response
from typing import List
import os

router = APIRouter(prefix="/sounds", tags=["sounds"])


@router.get("")
def get_sounds() -> List[str]:
    sounds: List[str] = []
    for element in os.listdir("./res/sounds/"):
        if os.path.isfile(os.path.join("./res/sounds/", element)):
            sounds.append(element)
    return sounds


@router.get("/{sound_name}")
def get_sound(sound_name: str):
    sound_path = os.path.join("./res/sounds/", sound_name)
    if os.path.isfile(sound_path):
        sound: bytes = open(sound_path, "rb").read()
        return Response(content=sound, media_type="sound/mpeg")
    else:
        return {"error": "Sound not found"}, 404
