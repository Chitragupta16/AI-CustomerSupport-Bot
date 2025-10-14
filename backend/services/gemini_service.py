# backend/services/gemini_service.py
import os
import asyncio
from typing import AsyncGenerator, List, Any

# IMPORTANT: The google.generativeai SDK surface may differ.
# This wrapper uses asyncio.to_thread to call blocking SDK methods safely.
# Replace `call_gemini_*` placeholders with the actual SDK calls from your installed version.

try:
    import google.generativeai as genai
    genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
except Exception:
    genai = None  # we'll handle gracefully in the code

class GeminiService:
    def __init__(self):
        self.model_name = os.getenv("GEMINI_MODEL", "gemini-pro")
        # If using a different client or direct HTTP calls, adapt here.

    def build_prompt(self, user_message: str, retrieved_docs: list, recent_messages: list) -> str:
        system = "You are a helpful customer-support assistant. Answer concisely and cite sources when available."
        docs_text = "\n\n".join([f"[source] {d.get('meta',{}).get('id','')} - {d.get('doc','')}" for d in (retrieved_docs or [])])
        recent = "\n".join(recent_messages[-6:]) if recent_messages else ""
        prompt = f"{system}\n\nContext:\n{docs_text}\n\nConversation:\n{recent}\n\nUser: {user_message}"
        return prompt

    async def generate_embeddings(self, texts: List[str]) -> List[List[float]]:
        if genai is None:
            raise RuntimeError("Gemini SDK not configured. Set GEMINI_API_KEY and install google-generativeai.")
        # many SDKs are blocking; call in thread
        def call():
            resp = genai.embeddings.create(model="embed-english-002", input=texts)
            return [item["embedding"] for item in resp["data"]]
        return await asyncio.to_thread(call)

    async def stream_response(self, prompt: str, session_id: str) -> AsyncGenerator[str, None]:
        """
        Replace the inner implementation with the true streaming call for your SDK.
        This example simulates streaming to ensure integration works now.
        """
        # TODO: Replace this simulated stream with the real SDK streaming logic.
        # Example pseudocode pattern:
        # for event in genai.chat.completions.stream(model=self.model_name, messages=[...]):
        #     if event.delta:
        #         yield event.delta   # SDK dependent

        simulated = "This is a simulated Gemini response. Replace with actual streaming call."
        # yield in small chunks to simulate streaming behavior (frontend expects chunks)
        for i in range(0, len(simulated), 12):
            await asyncio.sleep(0.02)
            yield simulated[i:i+12]
