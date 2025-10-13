```python
from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware
import os
from routes import chat, faq, escalate

app = FastAPI()

# CORS Configuration
origins = os.getenv("CORS_ORIGINS", "").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(chat.router, prefix="/chat")
app.include_router(faq.router, prefix="/faq")
app.include_router(escalate.router, prefix="/escalate")

@app.get("/health")
async def health_check():
    return {"status": "healthy", "version": "1.0.0"}
```
