"use client";

import dynamic from "next/dynamic";

// ✅ Disable SSR for the chat page (important for WebSocket)
export const dynamic = "force-dynamic";

// Lazy-load ChatClient only in the browser
const ChatClient = dynamic(() => import("./chat-client"), { ssr: false });

export default function ChatPage() {
  return <ChatClient />;
}
