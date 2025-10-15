import ChatPageClient from "./page.client"

export const dynamic = "force-dynamic"

export default function ChatPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 via-white to-indigo-100">
      <div className="w-full max-w-3xl backdrop-blur-xl bg-white/70 rounded-2xl shadow-lg border border-white/30">
        <ChatPageClient />
      </div>
    </div>
  )
}
