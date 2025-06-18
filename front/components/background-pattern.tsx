"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

export function BackgroundPattern() {
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="absolute inset-0 -z-10 h-full w-full bg-white" />
    )
  }

  return (
    <div className="absolute inset-0 -z-10 h-full w-full">
      {theme === "light" ? (
        <div className="absolute inset-0 bg-white bg-[linear-gradient(to_right,#FFD8DF0a_1px,transparent_1px),linear-gradient(to_bottom,#FFD8DF0a_1px,transparent_1px)] bg-[size:14px_24px]" />
      ) : (
        <div className="absolute inset-0 bg-[#111111] bg-[linear-gradient(to_right,#2461e92e_1px,transparent_1px),linear-gradient(to_bottom,#2461e92e_1px,transparent_1px)] bg-[size:14px_24px]" />
      )}
    </div>
  )
} 