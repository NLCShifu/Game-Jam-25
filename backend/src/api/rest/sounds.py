from fastapi import APIRouter, Response
from typing import List
import os

router = APIRouter(prefix="/sounds", tags=["sounds"])


@router.get("")
def get_images() -> List[str]:
    images: List[str] = []
    for element in os.listdir("./res/sounds/"):
        if os.path.isfile(os.path.join("./res/sounds/", element)):
            images.append(element)
    return images


@router.get("/{image_name}")
def get_image(image_name: str):
    image_path = os.path.join("./res/sounds/", image_name)
    if os.path.isfile(image_path):
        image: bytes = open(image_path, "rb").read()
        return Response(content=image, media_type="sound/mpeg")
    else:
        return {"error": "Sound not found"}, 404
