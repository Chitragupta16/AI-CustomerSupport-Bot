"use client"

import { useCallback, useMemo, useState } from "react"
import type { Message } from "../components/chat/message-bubble"
import { useWebSocketClient } from "./use-websocket"
import { useStreamingText } from "./use-streaming-text"

type Options = {
  url: string
  token?: string
  onAssistantMessage?: () => void
}

export function useChatStream({ url, token, onAssistantMessage }: Options) {
  const [messages, setMessages] = useState<Message[]>([])
  const [typing, setTyping] = useState(false)

  const { appendAssistantChunk } = useStreamingText(setMessages)

  const onMessage = useCallback(
    (evt: MessageEvent) => {
      try {
        // Accept either raw text chunks or JSON messages
        const text = typeof evt.data === "string" ? evt.data : ""
        // Attempt to parse JSON protocol if applicable
        try {
          const parsed = JSON.parse(text)
          if (parsed.type === "assistant_chunk") {
            setTyping(true)
            appendAssistantChunk(parsed.content ?? "")
            onAssistantMessage?.()
            return
          }
          if (parsed.type === "assistant_message") {
            setTyping(false)
            setMessages((prev) => [
              ...prev,
              { id: crypto.randomUUID(), role: "assistant", content: parsed.content ?? "" },
            ])
            onAssistantMessage?.()
            return
          }
          if (parsed.type === "done") {
            setTyping(false)
            return
          }
        } catch {
          // Treat as raw streaming text
          if (text) {
            setTyping(true)
            appendAssistantChunk(text)
            onAssistantMessage?.()
          }
        }
      } catch {
        // ignore malformed frames
      }
    },
    [appendAssistantChunk, onAssistantMessage],
  )

  const { connect, disconnect, send, connected, connecting } = useWebSocketClient({
    url,
    token,
    onMessage,
    onOpen: () => setTyping(false),
    onClose: () => setTyping(false),
  })

  const sendUserMessage = useCallback(
    (content: string) => {
      const id = crypto.randomUUID()
      setMessages((prev) => [...prev, { id, role: "user", content }])
      // generic send, backend can parse
      send({ type: "user_message", content })
      setTyping(true)
    },
    [send],
  )

  const api = useMemo(
    () => ({ messages, typing, connected, connecting, connect, disconnect, sendUserMessage }),
    [messages, typing, connected, connecting, connect, disconnect, sendUserMessage],
  )

  return api
}
