"use client"

import { useCallback, useEffect, useRef, useState } from "react"

type Options = {
  url: string // relative or absolute
  token?: string
  onMessage?: (data: MessageEvent) => void
  onOpen?: () => void
  onClose?: () => void
  onError?: (err: Event) => void
  autoConnect?: boolean
}

export function useWebSocketClient(opts: Options) {
  const { url, token, onMessage, onOpen, onClose, onError, autoConnect = true } = opts
  const wsRef = useRef<WebSocket | null>(null)
  const [connecting, setConnecting] = useState(false)
  const [connected, setConnected] = useState(false)

  const resolveUrl = useCallback(() => {
    const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || window.location.origin;
    const scheme = apiBase.startsWith("https") ? "wss" : "ws";
    const base = apiBase.replace(/^http/, scheme);
    const path = url.startsWith("/") ? `${base}${url}` : url;
    const full = new URL(path);
    if (token) full.searchParams.set("token", token);
    return full.toString();
  }, [url, token]);


  const connect = useCallback(() => {
    if (wsRef.current || connecting) return
    setConnecting(true)
    try {
      console.log("🔌 Connecting to WebSocket:", resolveUrl())
      const ws = new WebSocket(resolveUrl())
      wsRef.current = ws
      ws.addEventListener("open", () => {
        setConnecting(false)
        setConnected(true)
        onOpen?.()
      })
      ws.addEventListener("message", (evt) => onMessage?.(evt))
      ws.addEventListener("close", () => {
        setConnected(false)
        onClose?.()
        wsRef.current = null
      })
      ws.addEventListener("error", (e) => {
        onError?.(e)
      })
    } catch (e) {
      setConnecting(false)
      onError?.(e as any)
    }
  }, [connecting, onMessage, onOpen, onClose, onError, resolveUrl])

  const disconnect = useCallback(() => {
    wsRef.current?.close()
    wsRef.current = null
    setConnected(false)
  }, [])

  const send = useCallback((data: any) => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return false
    wsRef.current.send(typeof data === "string" ? data : JSON.stringify(data))
    return true
  }, [])

  useEffect(() => {
    if (autoConnect) connect()
    return () => {
      wsRef.current?.close()
      wsRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoConnect, resolveUrl])

  return { connect, disconnect, send, connected, connecting }
}
