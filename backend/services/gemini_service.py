import os
import httpx

class GeminiService:
    BASE_URL = "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent"


    def __init__(self):
        self.api_key = os.getenv("GEMINI_API_KEY")
        if not self.api_key:
            raise RuntimeError("❌ GEMINI_API_KEY is missing — please set it in Railway.")

    async def simple_response(self, message: str) -> str:
        payload = {
            "contents": [{"role": "user", "parts": [{"text": message}]}]
        }

        try:
            async with httpx.AsyncClient(timeout=30) as client:
                print("🔹 Sending Gemini API request...")
                response = await client.post(
                    f"{self.BASE_URL}?key={self.api_key}",
                    json=payload
                )

            print(f"🔹 Gemini HTTP status: {response.status_code}")
            print(f"🔹 Gemini raw response: {response.text}")

            if response.status_code != 200:
                return f"Gemini API error: {response.status_code} — {response.text}"

            data = response.json()
            text = (
                data.get("candidates", [{}])[0]
                .get("content", {})
                .get("parts", [{}])[0]
                .get("text", "No response from Gemini.")
            )
            return text or "No text response."

        except httpx.HTTPStatusError as e:
            print("❌ HTTP error while calling Gemini:", e)
            return f"Gemini API HTTP error: {e}"

        except Exception as e:
            print("❌ Unexpected Gemini error:", e)
            return f"Gemini API failed: {str(e)}"
