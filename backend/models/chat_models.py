# backend/models/chat_models.py
from pydantic import BaseModel
from typing import Literal

class ChatMessage(BaseModel):
    type: Literal["user_message", "control"]
    content: str
