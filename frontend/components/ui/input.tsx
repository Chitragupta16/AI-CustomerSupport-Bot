"use client"

import * as React from "react"

type InputProps = React.InputHTMLAttributes<HTMLInputElement>

export const Input: React.FC<InputProps> = ({ ...props }) => (
  <input
    {...props}
    style={{
      width: "100%",
      padding: "0.5rem 0.75rem",
      borderRadius: "6px",
      border: "1px solid #ccc",
      outline: "none",
      fontSize: "1rem",
      marginBottom: "0.5rem",
    }}
  />
)
