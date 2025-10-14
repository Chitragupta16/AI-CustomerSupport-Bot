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
    const base = typeof window !== "undefined" ? window.location.origin : ""
    const scheme = base.startsWith("https") ? "wss" : "ws"
    const path = url.startsWith("ws") ? url : `${scheme}://${window.location.host}${url}`
    const usp = new URL(path)
    if (token) usp.searchParams.set("token", token)
    return usp.toString()
  }, [url, token])

  const connect = useCallback(() => {
    if (wsRef.current || connecting) return
    setConnecting(true)
    try {
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
