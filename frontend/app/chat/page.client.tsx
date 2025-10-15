"use client";

import dynamic from "next/dynamic";

// Lazy load the WebSocket-based chat client only in browser
const ChatClient = dynamic(() => import("./chat-client"), { ssr: false });

export default function ChatPageClient() {
  return <ChatClient />;
}
