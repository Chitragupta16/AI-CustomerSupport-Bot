from fastapi import APIRouter, WebSocket, WebSocketDisconnect
import uuid, json
from services.gemini_service import GeminiService
# from services.redis_service import RedisService
from models.chat_models import ChatMessage

router = APIRouter()
gemini = GeminiService()
# redis = RedisService()

@router.websocket("/stream")
async def chat_socket(websocket: WebSocket):
    await websocket.accept()
    session_id = str(uuid.uuid4())

    try:
        while True:
            data = await websocket.receive_text()
            message = ChatMessage(**json.loads(data))

            if message.type == "user_message":
                # await redis.store_message(session_id, message.content)

                response = await gemini.simple_response(message.content)
                await websocket.send_json({"type": "assistant_chunk", "content": response})
                await websocket.send_json({"type": "assistant_done", "content": "Stream complete"})
    except WebSocketDisconnect:
        pass
        # await redis.clear_session(session_id)
