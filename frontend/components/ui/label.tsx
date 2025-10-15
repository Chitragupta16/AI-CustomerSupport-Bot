"use client"

import * as React from "react"

export const Label = ({
  children,
  ...props
}: React.LabelHTMLAttributes<HTMLLabelElement>) => (
  <label
    {...props}
    style={{
      display: "block",
      fontWeight: 500,
      marginBottom: "0.25rem",
    }}
  >
    {children}
  </label>
)
