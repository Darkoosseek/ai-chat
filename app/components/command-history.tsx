"use client"

import { useState, useEffect } from "react"

interface CommandHistoryProps {
  onCommandSelect: (command: string) => void
  currentInput: string
}

export function useCommandHistory() {
  const [history, setHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)

  const addToHistory = (command: string) => {
    if (command.trim() && !history.includes(command)) {
      const newHistory = [command, ...history.slice(0, 49)] // Keep last 50 commands
      setHistory(newHistory)
      localStorage.setItem("ai-command-history", JSON.stringify(newHistory))
    }
    setHistoryIndex(-1)
  }

  const navigateHistory = (direction: "up" | "down") => {
    if (direction === "up" && historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1
      setHistoryIndex(newIndex)
      return history[newIndex]
    } else if (direction === "down" && historyIndex > -1) {
      const newIndex = historyIndex - 1
      setHistoryIndex(newIndex)
      return newIndex === -1 ? "" : history[newIndex]
    }
    return null
  }

  useEffect(() => {
    const savedHistory = localStorage.getItem("ai-command-history")
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory))
    }
  }, [])

  return { addToHistory, navigateHistory, history }
}
