import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, placeholder, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      className={cn(
        "flex h-10 w-full rounded-lg border border-input bg-[#0f1623] px-3 py-2 text-sm text-foreground shadow-inner shadow-black/20 transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
}

export { Input }
