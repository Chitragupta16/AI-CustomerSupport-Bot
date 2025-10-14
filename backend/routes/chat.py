# backend/routes/chat.py
from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Query
import json
import uuid
import asyncio

from services.gemini_service import GeminiService
from services.redis_service import RedisService
from services.faiss_service import FAISSService
from models.chat_models import ChatMessage

router = APIRouter()
gemini = GeminiService()
redis = RedisService()
faiss = FAISSService()


@router.websocket("/stream")
async def websocket_chat(websocket: WebSocket, token: str | None = Query(None)):
    """
    WebSocket protocol:
      - Client sends {"type":"user_message","content":"..."}
      - Server streams {"type":"assistant_chunk","chunk":"..."} and final {"type":"assistant_done","content":"..."}
    """
    await websocket.accept()
    session_id = str(uuid.uuid4())

    try:
        while True:
            raw = await websocket.receive_text()
            try:
                data = json.loads(raw)
            except Exception:
                await websocket.send_json({"type": "error", "message": "invalid_json"})
                continue

            # validate shape
            try:
                message = ChatMessage(**data)
            except Exception:
                await websocket.send_json({"type": "error", "message": "invalid_message_schema"})
                continue

            if message.type != "user_message":
                await websocket.send_json({"type": "error", "message": "unsupported_message_type"})
                continue

            # store user message in session
            await redis.store_message(session_id, message.content)

            # RAG retrieval: get top-k docs from FAISS
            # (faiss.search returns list of {"doc","meta","score"})
            docs = await faiss.search(message.content, k=3)

            # Build prompt (system + retrieved docs + recent messages)
            recent_msgs = await redis.get_messages(session_id)
            prompt = gemini.build_prompt(user_message=message.content, retrieved_docs=docs, recent_messages=recent_msgs)

            # Stream response from Gemini and forward chunks
            try:
                async for chunk in gemini.stream_response(prompt=prompt, session_id=session_id):
                    await websocket.send_json({"type": "assistant_chunk", "chunk": chunk})
                # send done marker (could include confidence/sources)
                await websocket.send_json({"type": "assistant_done", "content": "stream_complete"})
            except Exception as e:
                await websocket.send_json({"type": "error", "message": f"llm_error: {str(e)}"})
    except WebSocketDisconnect:
        await redis.clear_session(session_id)
