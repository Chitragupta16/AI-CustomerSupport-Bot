"use client"

import React, { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"

// 🧠 The admin panel allows viewing and managing escalation tickets
// fetched from your FastAPI backend

type Ticket = {
  ticket_id: string
  customer_email: string
  issue: string
  status: string
  created_at?: string
}

export default function AdminClient() {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [loading, setLoading] = useState(false)
  const [filter, setFilter] = useState("")
  const { toast, show } = useToast()

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"

  // Fetch escalation tickets from backend
  const fetchTickets = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE_URL}/escalate/list${filter ? `?status=${filter}` : ""}`)
      if (!res.ok) throw new Error("Failed to fetch tickets")
      const data = await res.json()
      setTickets(data.tickets || [])
    } catch (err: any) {
      show(err.message || "Error fetching tickets")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTickets()
  }, [filter])

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>

        {/* Filter */}
        <div className="flex items-end space-x-3">
          <div>
            <Label htmlFor="filter">Filter by Status</Label>
            <Input
              id="filter"
              value={filter}
              placeholder="e.g. open, closed"
              onChange={(e) => setFilter(e.target.value)}
            />
          </div>
          <Button onClick={fetchTickets}>Refresh</Button>
        </div>

        {/* Tickets */}
        <div className="grid md:grid-cols-2 gap-4">
          {tickets.map((t) => (
            <Card key={t.ticket_id}>
              <div className="space-y-2">
                <h2 className="text-lg font-semibold text-gray-700">{t.issue}</h2>
                <p className="text-sm text-gray-600">Customer: {t.customer_email}</p>
                <p className="text-sm text-gray-500">Status: {t.status}</p>
                {t.created_at && (
                  <p className="text-xs text-gray-400">
                    Created at: {new Date(t.created_at).toLocaleString()}
                  </p>
                )}
              </div>
            </Card>
          ))}
        </div>

        {/* Toast notification */}
        {toast && (
          <div className="fixed bottom-5 right-5 bg-gray-900 text-white px-4 py-2 rounded-lg shadow-lg animate-fade-in">
            {toast}
          </div>
        )}

        {/* Loader */}
        {loading && (
          <div className="text-center text-gray-500 mt-8 animate-pulse">
            Loading tickets...
          </div>
        )}
      </div>
    </div>
  )
}
