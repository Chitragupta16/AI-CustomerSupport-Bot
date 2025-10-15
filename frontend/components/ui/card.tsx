"use client"

import * as React from "react"

export const Card = ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    {...props}
    style={{
      border: "1px solid #eaeaea",
      borderRadius: "8px",
      padding: "1rem",
      marginBottom: "1rem",
      background: "#fff",
      boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
    }}
  >
    {children}
  </div>
)

export const CardHeader = ({ children }: { children: React.ReactNode }) => (
  <div style={{ fontWeight: 600, marginBottom: "0.5rem" }}>{children}</div>
)

export const CardContent = ({ children }: { children: React.ReactNode }) => (
  <div>{children}</div>
)
