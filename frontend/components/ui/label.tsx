"use client"

import * as React from "react"

export const Label = ({ children, className, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) => (
  <label className={className} {...props}>
    {children}
  </label>
)
