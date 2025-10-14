"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"
import { useChatStream } from "../hooks/use-chat-stream"
import { cn } from "../lib/utils"

export default function ChatBox() {
  const [input, setInput] = useState("")
  const { messages, submit, isStreaming } = useChatStream()
  const listRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" })
  }, [messages, isStreaming])

  const onSend = () => {
    const trimmed = input.trim()
    if (!trimmed) return
    submit(trimmed)
    setInput("")
  }

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      onSend()
    }
  }

  return (
    <div className="flex h-[70vh] flex-col overflow-hidden rounded-lg border border-border/40 bg-card">
      <div ref={listRef} className="flex-1 space-y-4 overflow-y-auto p-4" aria-live="polite" aria-busy={isStreaming}>
        {messages.length === 0 ? (
          <div className="flex h-full items-center justify-center text-center text-muted-foreground">
            Ask me anything about your support needs.
          </div>
        ) : (
          messages.map((m, i) => (
            <div key={i} className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}>
              <div
                className={cn(
                  "max-w-[80%] rounded-md px-3 py-2 text-sm leading-relaxed",
                  m.role === "user"
                    ? "bg-primary text-background"
                    : "bg-background text-foreground border border-border/40",
                )}
              >
                {m.content}
              </div>
            </div>
          ))
        )}
        {isStreaming && (
          <div className="flex justify-start">
            <div className="mt-1 inline-flex items-center gap-2 rounded-md border border-border/40 bg-background px-3 py-2 text-xs text-muted-foreground">
              typing{" "}
              <span className="typing" aria-hidden="true">
                <span></span>
                <span></span>
                <span></span>
              </span>
            </div>
          </div>
        )}
      </div>
      <div className="border-t border-border/40 p-3">
        <div className="flex items-center gap-2">
          <input
            aria-label="Message"
            placeholder="Type your message..."
            className="flex-1 rounded-md border border-border/40 bg-background px-3 py-2 outline-none ring-primary focus:ring-2"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
          />
          <button
            onClick={onSend}
            className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-background transition-colors hover:opacity-90"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  )
}
