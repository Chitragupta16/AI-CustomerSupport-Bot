import dynamic from "next/dynamic";

// Prevent static export / force runtime rendering
export const dynamic = "force-dynamic";

// Dynamically import the client-only ChatClient (no SSR)
const ChatClient = dynamic(() => import("./chat-client"), { ssr: false });

export default function ChatPage() {
  return <ChatClient />;
}
