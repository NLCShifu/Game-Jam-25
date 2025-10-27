from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.api.rest.rooms import router as rooms_router
from src.api.rest.images import router as images_router
from src.api.rest.sounds import router as sounds_router
from src.api.ws.video import router as video_router
from src.api.ws.meta import router as meta_router
from src.api.ws.audio import router as audio_router

app = FastAPI()

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://game-jam-25-y5ge.vercel.app"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # ou ["*"] pour tester rapidement
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# Les REST endpoints sont montés directement à la racine
app.include_router(rooms_router)
app.include_router(images_router)
app.include_router(sounds_router)

# Les websockets aussi
app.include_router(video_router)
app.include_router(audio_router)
app.include_router(meta_router)
