import { cn } from "@/lib/utils"

export type Message = {
  id: string
  role: "user" | "assistant" | "system"
  content: string
}

export function MessageBubble({ role, content }: Pick<Message, "role" | "content">) {
  const isUser = role === "user"
  return (
    <div className={cn("flex w-full", isUser ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[80%] rounded-lg px-3 py-2 text-sm",
          isUser ? "bg-primary text-primary-foreground" : "bg-muted text-foreground",
        )}
      >
        <span className="whitespace-pre-wrap">{content}</span>
      </div>
    </div>
  )
}
