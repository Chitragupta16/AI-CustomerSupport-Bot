"use client"

import { useRef, useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useChatStream } from "../../hooks/use-chat-stream"
import { MessageList } from "../../components/chat/message-list"
import { TypingIndicator } from "../../components/chat/typing-indicator"

type Props = { token?: string }

export default function ChatClient({ token }: Props) {
  const [input, setInput] = useState("")
  const containerRef = useRef<HTMLDivElement>(null)

  const wsUrl = useMemo(() => {
    const base = (process.env.NEXT_PUBLIC_API_BASE_URL || "").replace(/\/+$/, "")
    const httpUrl = `${base}/chat/stream`
    try {
      const u = new URL(httpUrl)
      u.protocol = u.protocol === "https:" ? "wss:" : "ws:"
      return u.toString()
    } catch {
      return httpUrl
    }
  }, [])

  const { messages, connecting, connected, typing, sendUserMessage, connect, disconnect } = useChatStream({
    url: wsUrl,
    token,
    onAssistantMessage: () => {
      containerRef.current?.scrollTo({ top: containerRef.current.scrollHeight, behavior: "smooth" })
    },
  })

  // ✅ All JSX must be *inside* this return()
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mx-auto max-w-2xl">
        <Card className="shadow-lg rounded-2xl overflow-hidden">
          <CardContent className="p-0">
            <div className="flex items-center justify-between p-3 border-b border-border bg-indigo-50">
              <div className="text-sm text-muted-foreground">
                {connecting ? "Connecting..." : connected ? "Connected" : "Disconnected"}
              </div>
              <div className="flex items-center gap-2">
                {!connected ? (
                  <Button size="sm" onClick={connect} disabled={connecting}>
                    Connect
                  </Button>
                ) : (
                  <Button size="sm" variant="secondary" onClick={disconnect}>
                    Disconnect
                  </Button>
                )}
              </div>
            </div>

            <div ref={containerRef} className="h-[60vh] overflow-y-auto p-4 bg-white">
              <MessageList messages={messages} />
              {typing && <TypingIndicator />}
            </div>

            {/* ✅ The <form> must be inside return() */}
            <form
              className="p-3 border-t border-border flex items-center gap-2 bg-white"
              onSubmit={(e) => {
                e.preventDefault()
                const text = input.trim()
                if (!text) return
                sendUserMessage(text)
                setInput("")
              }}
            >
              <Input
                placeholder="Type your message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1"
              />
              <Button type="submit">Send</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
