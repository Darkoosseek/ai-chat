"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ChevronDown } from "lucide-react"

interface ScrollToBottomProps {
  containerRef: React.RefObject<HTMLDivElement>
}

export function ScrollToBottom({ containerRef }: ScrollToBottomProps) {
  const [showButton, setShowButton] = useState(false)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100
      setShowButton(!isNearBottom)
    }

    container.addEventListener("scroll", handleScroll)
    handleScroll() // Check initial state

    return () => container.removeEventListener("scroll", handleScroll)
  }, [containerRef])

  const scrollToBottom = () => {
    const container = containerRef.current
    if (container) {
      container.scrollTo({
        top: container.scrollHeight,
        behavior: "smooth",
      })
    }
  }

  if (!showButton) return null

  return (
    <Button
      onClick={scrollToBottom}
      className="fixed bottom-24 right-6 z-40 bg-green-900/90 hover:bg-green-800 text-green-400 border border-green-600 rounded-full p-3 shadow-lg backdrop-blur-sm animate-bounce"
      size="sm"
    >
      <ChevronDown className="w-5 h-5" />
    </Button>
  )
}
