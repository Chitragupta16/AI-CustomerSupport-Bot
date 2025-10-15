import os
import httpx

class GeminiService:
    BASE_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent"

    def __init__(self):
        self.api_key = os.getenv("GEMINI_API_KEY")
        if not self.api_key:
            raise RuntimeError("GEMINI_API_KEY missing")

    async def simple_response(self, message: str) -> str:
        payload = {
            "contents": [
                {"role": "user", "parts": [{"text": message}]}
            ]
        }

        try:
            async with httpx.AsyncClient(timeout=30) as client:
                r = await client.post(
                    f"{self.BASE_URL}?key={self.api_key}",
                    json=payload
                )
                r.raise_for_status()
                data = r.json()
                return (
                    data.get("candidates", [{}])[0]
                    .get("content", {})
                    .get("parts", [{}])[0]
                    .get("text", "Sorry, I couldn’t process that.")
                )
        except httpx.HTTPStatusError as e:
            # Log more detailed information if an API error occurs
            print(f"Gemini API error: {e.response.status_code} — {e.response.text}")
            return "Sorry, Gemini API returned an error."
        except Exception as e:
            print(f"Unexpected error calling Gemini API: {e}")
            return "Sorry, something went wrong."
