"use client"
import React, { useState } from "react"

export function Tabs({
  tabs,
  onChange,
}: {
  tabs: string[]
  onChange?: (tab: string) => void
}) {
  const [active, setActive] = useState(tabs[0])

  return (
    <div className="flex space-x-2 border-b mb-4">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => {
            setActive(tab)
            onChange?.(tab)
          }}
          className={`px-4 py-2 text-sm font-medium ${
            tab === active
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  )
}
