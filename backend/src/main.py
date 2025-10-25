from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.rest.rooms import router as rooms_router
from api.ws.video import router as video_router
from api.ws.meta import router as meta_router
from api.ws.audio import router as audio_router

app = FastAPI()

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,      # ou ["*"] pour tester rapidement
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# Les REST endpoints sont montés directement à la racine
app.include_router(rooms_router)

# Les websockets aussi
app.include_router(video_router)
app.include_router(audio_router)
app.include_router(meta_router)
