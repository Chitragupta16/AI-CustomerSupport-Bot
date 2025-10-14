from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os

from routes import chat, faq, escalate

app = FastAPI(title="Gemini Support Bot API")

origins = [o.strip() for o in os.getenv("CORS_ORIGINS", "").split(",") if o.strip()] or [
    "http://localhost:3000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(chat.router, prefix="/chat")
app.include_router(faq.router, prefix="/faq")
app.include_router(escalate.router, prefix="/escalate")


@app.get("/health")
async def health_check():
    return {"status": "ok"}
