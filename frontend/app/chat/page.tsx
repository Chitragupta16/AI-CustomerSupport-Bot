import dynamicImport from "next/dynamic";

// ✅ Keep this to force dynamic rendering (prevents static export issues)
export const dynamic = "force-dynamic";

// ✅ Rename the imported one to avoid conflict
const ChatClient = dynamicImport(() => import("./chat-client"), { ssr: false });

export default function ChatPage() {
  return <ChatClient />;
}
