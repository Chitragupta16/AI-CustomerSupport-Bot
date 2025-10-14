# AI Customer Support Bot - Frontend

A Next.js 15 (App Router) frontend for an AI Customer Support Bot.

Features:
- Dark, responsive UI with Tailwind CSS + shadcn/ui
- Chat interface with message bubbles, typing indicator, and streaming via WebSocket
- Authentication with NextAuth (Credentials provider, JWT strategy)
- Admin dashboard: escalated tickets list and FAQ upload
- Routes: `/chat`, `/admin`, `/login`
- TypeScript, SWR for data fetching

## External APIs (expected)
This frontend uses the single environment variable NEXT_PUBLIC_API_BASE_URL for all backend calls.

- WebSocket: `${NEXT_PUBLIC_API_BASE_URL}/chat/stream` (ws/wss inferred automatically)
- REST:
  - GET `${NEXT_PUBLIC_API_BASE_URL}/escalate/list` → returns an array of escalated tickets
  - POST `${NEXT_PUBLIC_API_BASE_URL}/faq/upload` → accepts multipart/form-data with `file`

These endpoints should be provided by your backend or another service.

## Environment Variables
Set these in the "Vars" panel:
- NEXT_PUBLIC_API_BASE_URL: e.g. https://your-backend.example.com
  - Required for chat WebSocket and admin REST endpoints.
- (Optional) NEXTAUTH_SECRET: recommended for production when using NextAuth
- (Optional) NEXTAUTH_URL: set to your deployed URL if needed by NextAuth

## Authentication
This starter uses NextAuth with a Credentials provider and a demo authorize implementation that accepts any non-empty email/password and returns a placeholder access token. Replace the logic in `frontend/server/auth.ts` with your real backend call.

## Development / Preview
- This project is ready to preview in v0. Open the preview and navigate to:
  - /login to sign in
  - /chat to use the chat interface
  - /admin to view escalations and upload FAQs

## Deployment
- Click Publish in v0 to deploy to Vercel.
- Ensure env vars (NEXT_PUBLIC_API_BASE_URL, NEXTAUTH_SECRET, NEXTAUTH_URL) are added in the Vars panel.
- The UI expects the backend APIs listed above to be available at the same origin (or adjust URLs accordingly).

## Notes
- The footer shows “Powered by Gemini AI”.
- WebSocket connects to `${NEXT_PUBLIC_API_BASE_URL}/chat/stream`; a `token` query param is appended when signed in.
- SWR fetcher in the admin dashboard includes `Authorization: Bearer <accessToken>` when available.
