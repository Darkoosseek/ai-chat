"use client"

import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"

interface RetryButtonProps {
  onRetry: () => void
  isLoading: boolean
}

export function RetryButton({ onRetry, isLoading }: RetryButtonProps) {
  return (
    <div className="flex items-center justify-center p-4">
      <Button
        onClick={onRetry}
        disabled={isLoading}
        className="bg-yellow-900 hover:bg-yellow-800 text-yellow-400 border border-yellow-600 font-mono"
      >
        <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
        {isLoading ? "RETRYING..." : "RETRY_LAST_MESSAGE"}
      </Button>
    </div>
  )
}
