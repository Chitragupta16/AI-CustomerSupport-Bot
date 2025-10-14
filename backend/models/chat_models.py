from pydantic import BaseModel
from typing import Literal

class ChatMessage(BaseModel):
    type: Literal["user_message"]
    content: str
