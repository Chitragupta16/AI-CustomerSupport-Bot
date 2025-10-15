"use client"

export function useToast() {
  const toast = (msg: { title?: string; description?: string }) => {
    console.log("Toast:", msg.title || "", msg.description || "")
    alert(`${msg.title ?? ""}\n${msg.description ?? ""}`)
  }
  return { toast }
}
