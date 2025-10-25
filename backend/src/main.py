from fastapi import FastAPI
from api.rest.rooms import router as rooms_router
from api.ws.video import router as video_router
from api.ws.meta import router as meta_router
from api.ws.audio import router as audio_router

app = FastAPI()

# Les REST endpoints sont montés directement à la racine
app.include_router(rooms_router)

# Les websockets aussi
app.include_router(video_router)
app.include_router(audio_router)
app.include_router(meta_router)
