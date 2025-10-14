import os, aioredis

class RedisService:
    def __init__(self):
        self.url = os.getenv("REDIS_URL", "redis://localhost:6379")
        self._redis = None

    async def _get(self):
        if not self._redis:
            self._redis = await aioredis.from_url(self.url, decode_responses=True)
        return self._redis

    async def store_message(self, session_id: str, msg: str):
        r = await self._get()
        await r.rpush(f"chat:{session_id}", msg)

    async def clear_session(self, session_id: str):
        r = await self._get()
        await r.delete(f"chat:{session_id}")
