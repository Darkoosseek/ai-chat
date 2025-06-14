"use client"

import { useState, useEffect } from "react"
import { Cpu, HardDrive, Wifi, Zap, Activity, Server } from "lucide-react"

export function SystemMonitor() {
  const [stats, setStats] = useState({
    cpu: 0,
    memory: 0,
    network: 0,
    uptime: 0,
    processes: 0,
    temperature: 0,
  })

  useEffect(() => {
    const interval = setInterval(() => {
      setStats({
        cpu: Math.floor(Math.random() * 30) + 15, // 15-45%
        memory: Math.floor(Math.random() * 20) + 60, // 60-80%
        network: Math.floor(Math.random() * 100) + 50, // 50-150 MB/s
        uptime: Math.floor(Date.now() / 1000) % 86400, // Fake uptime
        processes: Math.floor(Math.random() * 50) + 200, // 200-250 processes
        temperature: Math.floor(Math.random() * 10) + 45, // 45-55°C
      })
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  const formatUptime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    return `${hours}h ${minutes}m`
  }

  const getStatusColor = (value: number, type: string) => {
    if (type === "cpu" || type === "memory") {
      if (value > 80) return "text-red-400"
      if (value > 60) return "text-yellow-400"
      return "text-green-400"
    }
    return "text-green-400"
  }

  return (
    <div className="flex items-center space-x-6 text-xs font-mono">
      <div className="flex items-center space-x-1">
        <Cpu className="w-3 h-3 text-blue-400" />
        <span className="text-gray-400">CPU:</span>
        <span className={getStatusColor(stats.cpu, "cpu")}>{stats.cpu}%</span>
      </div>

      <div className="flex items-center space-x-1">
        <HardDrive className="w-3 h-3 text-purple-400" />
        <span className="text-gray-400">MEM:</span>
        <span className={getStatusColor(stats.memory, "memory")}>{stats.memory}%</span>
      </div>

      <div className="flex items-center space-x-1">
        <Wifi className="w-3 h-3 text-cyan-400" />
        <span className="text-gray-400">NET:</span>
        <span className="text-green-400">{stats.network}MB/s</span>
      </div>

      <div className="flex items-center space-x-1">
        <Activity className="w-3 h-3 text-orange-400" />
        <span className="text-gray-400">TEMP:</span>
        <span className="text-green-400">{stats.temperature}°C</span>
      </div>

      <div className="flex items-center space-x-1">
        <Server className="w-3 h-3 text-pink-400" />
        <span className="text-gray-400">PROC:</span>
        <span className="text-green-400">{stats.processes}</span>
      </div>

      <div className="flex items-center space-x-1">
        <Zap className="w-3 h-3 text-yellow-400" />
        <span className="text-gray-400">UP:</span>
        <span className="text-green-400">{formatUptime(stats.uptime)}</span>
      </div>
    </div>
  )
}
