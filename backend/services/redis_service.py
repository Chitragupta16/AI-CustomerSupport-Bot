```python
import redis
import os
from typing import Optional
import json

class RedisService:
    def __init__(self):
        self.redis = redis.from_url(os.getenv("REDIS_URL"))
    
    async def store_message(self, session_id: str, message: str) -> None:
        self.redis.rpush(f"session:{session_id}:messages", message)
    
    async def get_messages(self, session_id: str) -> list[str]:
        return self.redis.lrange(f"session:{session_id}:messages", 0, -1)
    
    async def clear_session(self, session_id: str) -> None:
        self.redis.delete(f"session:{session_id}:messages")
    
    async def log_escalation(self, email: str) -> None:
        self.redis.incr(f"user:{email}:escalations")
    
    async def get_escalation_count(self, email: str) -> int:
        return int(self.redis.get(f"user:{email}:escalations") or 0)
```
