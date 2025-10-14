"use client"

import type React from "react"

import useSWR from "swr"
import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/hooks/use-toast"

type Props = { token?: string }

const useApiBase = () => useMemo(() => (process.env.NEXT_PUBLIC_API_BASE_URL || "").replace(/\/+$/, ""), [])

async function fetcher(url: string, token?: string) {
  const res = await fetch(url, {
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    cache: "no-store",
  })
  if (!res.ok) throw new Error(`Failed to fetch ${url}`)
  return res.json()
}

export default function AdminClient({ token }: Props) {
  const apiBase = useApiBase()

  const { data, error, isLoading, mutate } = useSWR([`${apiBase}/escalate/list`, token] as const, ([url, t]) =>
    fetcher(url, t),
  )

  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)

  async function uploadFAQ(e: React.FormEvent) {
    e.preventDefault()
    if (!file) return
    setUploading(true)
    try {
      const form = new FormData()
      form.append("file", file)
      const res = await fetch(`${apiBase}/faq/upload`, {
        method: "POST",
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: form,
      })
      if (!res.ok) throw new Error(await res.text())
      toast({ title: "FAQ uploaded" })
    } catch (err: any) {
      toast({ title: "Upload failed", description: err.message })
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-6 grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Escalated Tickets</CardTitle>
          <CardDescription>Tickets requiring manual review</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading && <div className="text-sm text-muted-foreground">Loading...</div>}
          {error && <div className="text-sm text-destructive">Failed to load</div>}
          <ul className="space-y-3">
            {Array.isArray(data) &&
              data.map((t: any) => (
                <li key={t.id} className="p-3 rounded-md border border-border">
                  <div className="text-sm font-medium">{t.subject ?? `Ticket #${t.id}`}</div>
                  <div className="text-xs text-muted-foreground">{t.created_at ?? ""}</div>
                  <div className="mt-2 text-sm">{t.preview ?? t.message ?? ""}</div>
                </li>
              ))}
            {Array.isArray(data) && data.length === 0 && (
              <div className="text-sm text-muted-foreground">No escalations</div>
            )}
          </ul>
          <div className="mt-4">
            <Button variant="secondary" onClick={() => mutate()}>
              Refresh
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>FAQ Upload</CardTitle>
          <CardDescription>Upload a file to update bot knowledge</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={uploadFAQ} className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="faq">FAQ File</Label>
              <Input
                id="faq"
                type="file"
                accept=".txt,.md,.pdf"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              />
            </div>
            <Button type="submit" disabled={!file || uploading}>
              {uploading ? "Uploading..." : "Upload"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
