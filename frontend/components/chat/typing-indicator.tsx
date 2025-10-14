export function TypingIndicator() {
  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
      <span>Assistant is typing</span>
      <span className="inline-flex gap-1">
        <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/70 animate-bounce [animation-delay:-.3s]" />
        <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/70 animate-bounce [animation-delay:-.15s]" />
        <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/70 animate-bounce" />
      </span>
    </div>
  )
}
