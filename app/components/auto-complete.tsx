"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"

interface AutoCompleteProps {
  input: string
  onSelect: (suggestion: string) => void
  isVisible: boolean
}

const SUGGESTIONS = [
  // AI Commands
  "analyze this code for bugs and security issues",
  "explain how this algorithm works step by step",
  "optimize this code for better performance",
  "convert this code to Python/JavaScript/TypeScript",
  "generate documentation for this function",
  "review this code and suggest improvements",

  // Image Analysis
  "analyze this image and describe everything you see",
  "extract all text from this image using OCR",
  "explain this diagram or technical drawing",
  "identify any issues or problems in this image",

  // File Operations
  "summarize the contents of this file",
  "find potential security vulnerabilities",
  "explain the architecture of this codebase",
  "generate unit tests for this code",

  // General AI
  "help me debug this error message",
  "explain this concept in simple terms",
  "write a function that does X",
  "what are the best practices for Y",
]

export function AutoComplete({ input, onSelect, isVisible }: AutoCompleteProps) {
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [selectedIndex, setSelectedIndex] = useState(0)

  useEffect(() => {
    if (input.length > 2) {
      const filtered = SUGGESTIONS.filter((suggestion) => suggestion.toLowerCase().includes(input.toLowerCase())).slice(
        0,
        5,
      )
      setSuggestions(filtered)
      setSelectedIndex(0)
    } else {
      setSuggestions([])
    }
  }, [input])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isVisible || suggestions.length === 0) return

      if (e.key === "ArrowDown") {
        e.preventDefault()
        setSelectedIndex((prev) => (prev + 1) % suggestions.length)
      } else if (e.key === "ArrowUp") {
        e.preventDefault()
        setSelectedIndex((prev) => (prev - 1 + suggestions.length) % suggestions.length)
      } else if (e.key === "Tab" && suggestions[selectedIndex]) {
        e.preventDefault()
        onSelect(suggestions[selectedIndex])
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [isVisible, suggestions, selectedIndex, onSelect])

  if (!isVisible || suggestions.length === 0) return null

  return (
    <Card className="absolute bottom-full left-0 right-0 mb-2 bg-gray-900 border border-gray-600 z-50">
      <CardContent className="p-2">
        <div className="space-y-1">
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              className={`p-2 rounded text-sm font-mono cursor-pointer transition-colors ${
                index === selectedIndex
                  ? "bg-green-900/50 text-green-300"
                  : "text-gray-400 hover:bg-gray-800 hover:text-gray-200"
              }`}
              onClick={() => onSelect(suggestion)}
            >
              <span className="text-green-500 mr-2">▶</span>
              {suggestion}
            </div>
          ))}
        </div>
        <div className="mt-2 pt-2 border-t border-gray-700 text-xs text-gray-500 font-mono">
          Use ↑↓ to navigate, Tab to select, Esc to close
        </div>
      </CardContent>
    </Card>
  )
}
