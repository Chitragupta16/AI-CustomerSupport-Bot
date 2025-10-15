<div ref={containerRef} className="h-[70vh] overflow-y-auto p-4 bg-gradient-to-b from-gray-50 to-gray-100">
  <MessageList messages={messages} />
  {typing && (
    <div className="mt-3">
      <TypingIndicator />
    </div>
  )}
</div>

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
    className="flex-1 border-none shadow-none bg-gray-100 rounded-xl focus-visible:ring-1 focus-visible:ring-indigo-400"
  />
  <Button type="submit" className="rounded-full bg-indigo-500 hover:bg-indigo-600">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
      className="h-5 w-5"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 12l14-8-7 8 7 8-14-8z" />
    </svg>
  </Button>
</form>
