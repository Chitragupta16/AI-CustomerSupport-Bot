"use client"

import * as React from "react"

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "outline"
}

export const Button: React.FC<ButtonProps> = ({ children, variant = "default", ...props }) => (
  <button
    {...props}
    style={{
      padding: "0.5rem 1rem",
      borderRadius: "6px",
      border: variant === "outline" ? "1px solid #ccc" : "none",
      background: variant === "outline" ? "transparent" : "#0070f3",
      color: variant === "outline" ? "#000" : "#fff",
      cursor: "pointer",
    }}
  >
    {children}
  </button>
)
