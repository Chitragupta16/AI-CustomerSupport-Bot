# backend/services/redis_service.py
import os
import aioredis
from typing import List, Optional

REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379")

class RedisService:
    def __init__(self):
        self._redis = None

    async def _get(self):
        if self._redis is None:
            self._redis = await aioredis.from_url(REDIS_URL, encoding="utf-8", decode_responses=True)
        return self._redis

    async def store_message(self, session_id: str, message: str) -> None:
        r = await self._get()
        await r.rpush(f"session:{session_id}:messages", message)

    async def get_messages(self, session_id: str) -> List[str]:
        r = await self._get()
        return await r.lrange(f"session:{session_id}:messages", 0, -1)

    async def clear_session(self, session_id: str) -> None:
        r = await self._get()
        await r.delete(f"session:{session_id}:messages")

    async def log_escalation(self, email: str) -> None:
        r = await self._get()
        await r.incr(f"user:{email}:escalations")

    async def get_escalation_count(self, email: str) -> int:
        r = await self._get()
        v = await r.get(f"user:{email}:escalations")
        return int(v or 0)
