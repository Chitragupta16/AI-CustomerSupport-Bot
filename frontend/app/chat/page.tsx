export const dynamic = "force-dynamic";

import { requireAuth } from "../../lib/require-auth"
import ChatClient from "./chat-client"

export default async function ChatPage() {
  const session = await requireAuth({ redirectTo: "/login?callbackUrl=/chat" })
  return <ChatClient token={session?.accessToken as string | undefined} />
}
