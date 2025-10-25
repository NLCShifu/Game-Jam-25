from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from services.rooms_service import validate_session, rooms
from services.laugh_detector import LaughterFeatureDetector
import cv2
import numpy as np
import json
import os
import time

MODEL_PATH = os.path.join("backend/res", "face_landmarker.task")

router = APIRouter()

# Initialize the laugh detector with the model path
laugh_detector = LaughterFeatureDetector(MODEL_PATH)


@router.websocket("/ws/video/{room_id}")
async def ws_video(websocket: WebSocket, room_id: str, session_id: str):
    session = validate_session(session_id, room_id)
    await websocket.accept()

    participant = rooms[room_id].sessions.get(session_id)
    if participant:
        participant.add_ws_video(websocket)

    lock_until = 0.0
    cooldown = 5.0  # seconds
    last_is_laughing = False

    try:
        while True:
            data = await websocket.receive_bytes()

            nparr = np.frombuffer(data, np.uint8)
            img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
            if img is None:
                continue
            img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)

            now = time.monotonic()

            if now < lock_until:
                # Still locked — skip detection
                is_laughing = last_is_laughing
            else:
                try:
                    blend_features = laugh_detector.detect_features(img_rgb)
                    is_laughing = blend_features.get("is_laughing", False)
                    last_is_laughing = is_laughing

                    if is_laughing:
                        # lock for 5 seconds
                        lock_until = now + cooldown
                except Exception as e:
                    print(f"Detection error: {e}")
                    is_laughing = False
                    
            #TODO Send laughter status to the meta WebSocket if available 
            # if participant and participant.ws_meta: 
            # await participant.ws_meta.send_text(json.dumps({ 
            # 'type': 'laugh_status', 
            # 'is_laughing': is_laughing, 
            # 'session_id': session_id 
            # }))

            # Broadcast the frame
            for sid, session in rooms[room_id].sessions.items():
                if (
                    participant
                    and participant.session_id != session.session_id
                    and session.ws_video
                ):
                    await session.ws_video.send_bytes(data)

    except WebSocketDisconnect:
        if participant:
            participant.ws_video = None
