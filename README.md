# 🤖 AI Customer Support Bot

A full-stack conversational AI assistant for real-time customer support.  
Built with **Next.js (frontend)** and **FastAPI (backend)**, integrated with **Google Gemini** for intelligent responses.

---

## 🚀 Features
- Real-time chat via WebSockets  
- Gemini-powered conversational AI  
- Redis-based message storage  
- NextAuth authentication  
- Responsive UI (Tailwind + Radix UI)  
- Deployed on **Vercel** (frontend) & **Railway** (backend)

---

## 🧩 Tech Stack

**Frontend:** Next.js 15, React 18, Tailwind CSS, Radix UI, NextAuth  
**Backend:** FastAPI, Uvicorn, Redis, httpx, Google Gemini API  

---

## ⚙️ Environment Variables

### Frontend (Vercel)
| Variable | Description |
|-----------|-------------|
| `NEXT_PUBLIC_API_BASE_URL` | Backend URL (e.g. `https://ai-customersupport-bot-production.up.railway.app`) |
| `NEXTAUTH_SECRET` | Secret key for NextAuth |
| `NEXTAUTH_URL` | Frontend deployment URL |

### Backend (Railway)
| Variable | Description |
|-----------|-------------|
| `GEMINI_API_KEY` | Gemini API key from Google AI Studio |
| `REDIS_URL` | Redis connection string |
| `PORT` | Optional, defaults to 8000 |

---

## 🧠 How It Works
1. Frontend connects to backend via `/chat/stream` WebSocket.  
2. User messages are stored in Redis and sent to Gemini API.  
3. Gemini generates responses, streamed back to the client in real time.  

---

## 🛠️ Local Development

### Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
