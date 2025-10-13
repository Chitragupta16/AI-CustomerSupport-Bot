```python
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from services.gemini_service import GeminiService
from services.redis_service import RedisService
from models.chat_models import ChatMessage
import uuid

router = APIRouter()
gemini = GeminiService()
redis = RedisService()

@router.websocket("/stream")
async def websocket_chat(websocket: WebSocket):
    await websocket.accept()
    session_id = str(uuid.uuid4())
    
    try:
        while True:
            data = await websocket.receive_json()
            message = ChatMessage(**data)
            
            if message.type == "user_message":
                await redis.store_message(session_id, message.content)
                
                async for chunk in gemini.stream_response(
                    message.content,
                    session_id
                ):
                    await websocket.send_json({
                        "type": "assistant_chunk",
                        "content": chunk
                    })
                
                await websocket.send_json({
                    "type": "assistant_done",
                    "content": "Stream complete"
                })
    except WebSocketDisconnect:
        await redis.clear_session(session_id)
```
