"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  // Prevent hydration mismatch
  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <button
        className="fixed bottom-4 left-4 z-50 rounded-full bg-[#FFD8DF] p-2 text-[#232353] transition-colors hover:bg-[#FF8B62] hover:text-white"
        aria-label="Toggle theme"
      >
        <Sun className="h-5 w-5" />
      </button>
    )
  }

  return (
    <button
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="fixed bottom-4 left-4 z-50 rounded-full bg-[#FFD8DF] p-2 text-[#232353] transition-colors hover:bg-[#FF8B62] hover:text-white dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
      aria-label="Toggle theme"
    >
      <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute top-2 left-2 h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
    </button>
  )
} 