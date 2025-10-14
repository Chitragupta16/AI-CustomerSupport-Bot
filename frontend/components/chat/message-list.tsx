"use client"

import { useEffect, useRef } from "react"
import { type Message, MessageBubble } from "./message-bubble"

export function MessageList({ messages }: { messages: Message[] }) {
  const endRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages.length])

  return (
    <div className="space-y-3">
      {messages.map((m) => (
        <MessageBubble key={m.id} role={m.role} content={m.content} />
      ))}
      <div ref={endRef} />
    </div>
  )
}
