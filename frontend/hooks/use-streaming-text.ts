"use client"

import type React from "react"

import { useCallback } from "react"
import type { Message } from "../components/chat/message-bubble"

export function useStreamingText(setter: React.Dispatch<React.SetStateAction<Message[]>>) {
  const appendAssistantChunk = useCallback(
    (chunk: string) => {
      setter((prev) => {
        if (prev.length === 0 || prev[prev.length - 1].role !== "assistant") {
          return [...prev, { id: crypto.randomUUID(), role: "assistant", content: chunk }]
        }
        const copy = [...prev]
        copy[copy.length - 1] = {
          ...copy[copy.length - 1],
          content: copy[copy.length - 1].content + chunk,
        }
        return copy
      })
    },
    [setter],
  )

  return { appendAssistantChunk }
}
