export function cn(...classes: Array<string | undefined | null | false>) {
  return classes.filter(Boolean).join(" ")
}

export function getApiBase() {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL
  if (!base) {
    console.warn("[v0] NEXT_PUBLIC_API_BASE_URL is not set. Calls will use relative path.")
    return ""
  }
  return base.replace(/\/+$/, "")
}

export function toWsUrl(httpUrl: string) {
  try {
    const url = new URL(httpUrl)
    url.protocol = url.protocol === "https:" ? "wss:" : "ws:"
    return url.toString()
  } catch {
    return httpUrl
  }
}
