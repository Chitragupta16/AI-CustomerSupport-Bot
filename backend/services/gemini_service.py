```python
import google.generativeai as genai
import os
from typing import AsyncGenerator

class GeminiService:
    def __init__(self):
        genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
        self.model = genai.GenerativeModel('gemini-pro')
    
    async def stream_response(self, message: str, session_id: str) -> AsyncGenerator[str, None]:
        response = self.model.generate_content(
            message,
            stream=True
        )
        
        for chunk in response:
            yield chunk.text
    
    async def generate_embeddings(self, texts: list[str]) -> list[list[float]]:
        # Implementation for Gemini embedding generation
        pass
```
