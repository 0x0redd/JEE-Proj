"use client"

import { useTheme } from "next-themes"

export function BackgroundPattern() {
  const { theme } = useTheme()

  return (
    <>
      {theme === "light" ? (
        <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#FFD8DF0a_1px,transparent_1px),linear-gradient(to_bottom,#FFD8DF0a_1px,transparent_1px)] bg-[size:14px_24px]" />
      ) : (
        <div className="relative h-full w-full bg-[#232353]">
          <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#FF8B622e_1px,transparent_1px),linear-gradient(to_bottom,#FF8B622e_1px,transparent_1px)] bg-[size:14px_24px]" />
        </div>
      )}
    </>
  )
} 