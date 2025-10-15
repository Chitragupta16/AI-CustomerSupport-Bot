import os
import redis.asyncio as redis
import json

class RedisService:
    def __init__(self):
        # Use a default for local development
        self.url = os.getenv("REDIS_URL", "redis://localhost:6379")
        # Create a reusable connection
        self._redis = redis.from_url(self.url, decode_responses=True)

    async def store_message(self, session_id: str, message: str) -> None:
        """Store chat messages for the session"""
        await self._redis.rpush(f"session:{session_id}:messages", message)

    async def get_messages(self, session_id: str) -> list[str]:
        """Retrieve all chat messages for a session"""
        return await self._redis.lrange(f"session:{session_id}:messages", 0, -1)

    async def clear_session(self, session_id: str) -> None:
        """Clear session message history"""
        await self._redis.delete(f"session:{session_id}:messages")

    async def log_escalation(self, email: str) -> None:
        """Increment escalation counter for a user"""
        await self._redis.incr(f"user:{email}:escalations")

    async def get_escalation_count(self, email: str) -> int:
        """Return escalation count for a user"""
        count = await self._redis.get(f"user:{email}:escalations")
        return int(count or 0)
