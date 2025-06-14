"use client"

import { useState, useEffect } from "react"
import { Wifi, WifiOff, AlertTriangle } from "lucide-react"

export function ConnectionStatus() {
  const [isOnline, setIsOnline] = useState(true)
  const [connectionQuality, setConnectionQuality] = useState<"good" | "poor" | "offline">("good")

  useEffect(() => {
    const updateOnlineStatus = () => {
      setIsOnline(navigator.onLine)
      setConnectionQuality(navigator.onLine ? "good" : "offline")
    }

    // Test connection quality
    const testConnection = async () => {
      if (!navigator.onLine) {
        setConnectionQuality("offline")
        return
      }

      try {
        const start = Date.now()
        await fetch("/api/health", { method: "HEAD" })
        const duration = Date.now() - start

        if (duration > 3000) {
          setConnectionQuality("poor")
        } else {
          setConnectionQuality("good")
        }
      } catch {
        setConnectionQuality("poor")
      }
    }

    window.addEventListener("online", updateOnlineStatus)
    window.addEventListener("offline", updateOnlineStatus)

    // Test connection every 30 seconds
    const interval = setInterval(testConnection, 30000)
    testConnection()

    return () => {
      window.removeEventListener("online", updateOnlineStatus)
      window.removeEventListener("offline", updateOnlineStatus)
      clearInterval(interval)
    }
  }, [])

  const getStatusIcon = () => {
    switch (connectionQuality) {
      case "good":
        return <Wifi className="w-3 h-3 text-green-400" />
      case "poor":
        return <AlertTriangle className="w-3 h-3 text-yellow-400" />
      case "offline":
        return <WifiOff className="w-3 h-3 text-red-400" />
    }
  }

  const getStatusText = () => {
    switch (connectionQuality) {
      case "good":
        return "ONLINE"
      case "poor":
        return "SLOW"
      case "offline":
        return "OFFLINE"
    }
  }

  const getStatusColor = () => {
    switch (connectionQuality) {
      case "good":
        return "text-green-400"
      case "poor":
        return "text-yellow-400"
      case "offline":
        return "text-red-400"
    }
  }

  return (
    <div className="flex items-center space-x-1">
      {getStatusIcon()}
      <span className={`text-xs font-mono ${getStatusColor()}`}>{getStatusText()}</span>
    </div>
  )
}
