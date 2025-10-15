"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

export function MessageList({ messages }: { messages: any[] }) {
  return (
    <div className="flex flex-col space-y-4">
      {messages.map((m) => (
        <motion.div
          key={m.id}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className={cn(
            "max-w-[85%] rounded-2xl px-4 py-2 shadow-md",
            m.role === "user"
              ? "self-end bg-gradient-to-br from-blue-500 to-indigo-500 text-white"
              : "self-start bg-muted text-foreground"
          )}
        >
          {m.content}
        </motion.div>
      ))}
    </div>
  )
}
