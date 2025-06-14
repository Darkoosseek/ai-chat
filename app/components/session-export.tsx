"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { X, Download, FileText, Code } from "lucide-react"

interface SessionExportProps {
  isOpen: boolean
  onClose: () => void
  messages: Array<{
    id: string
    role: "user" | "assistant"
    content: string
    fileInfo?: {
      name: string
      type: "file" | "image"
    }
  }>
}

export function SessionExport({ isOpen, onClose, messages }: SessionExportProps) {
  if (!isOpen) return null

  const exportAsMarkdown = () => {
    const markdown = messages
      .map((msg) => {
        const role = msg.role === "user" ? "👤 User" : "🤖 AI Assistant"
        const timestamp = new Date().toLocaleString()
        let content = `## ${role} - ${timestamp}\n\n${msg.content}\n\n`

        if (msg.fileInfo) {
          content = `## ${role} - ${timestamp}\n\n**File:** ${msg.fileInfo.name} (${msg.fileInfo.type})\n\n${msg.content}\n\n`
        }

        return content
      })
      .join("---\n\n")

    const blob = new Blob([`# AI Terminal Session Export\n\n${markdown}`], {
      type: "text/markdown",
    })

    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `ai-session-${new Date().toISOString().split("T")[0]}.md`
    a.click()
    URL.revokeObjectURL(url)
  }

  const exportAsText = () => {
    const text = messages
      .map((msg) => {
        const role = msg.role === "user" ? "USER" : "AI"
        const timestamp = new Date().toLocaleString()
        return `[${timestamp}] ${role}: ${msg.content}`
      })
      .join("\n\n")

    const blob = new Blob([`AI TERMINAL SESSION EXPORT\n${"=".repeat(50)}\n\n${text}`], {
      type: "text/plain",
    })

    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `ai-session-${new Date().toISOString().split("T")[0]}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 font-mono">
      <Card className="w-full max-w-md bg-gray-900 border border-gray-700">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b border-gray-700">
          <CardTitle className="text-green-400 flex items-center space-x-2 font-mono">
            <Download className="w-5 h-5" />
            <span>EXPORT_SESSION</span>
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-200 hover:bg-gray-800"
          >
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-4 pt-4">
          <div className="bg-gray-800 border border-gray-600 rounded p-3">
            <div className="text-xs text-gray-400 font-mono space-y-1">
              <p className="font-medium text-green-400">[SESSION_INFO]</p>
              <p>Messages: {messages.length}</p>
              <p>Date: {new Date().toLocaleDateString()}</p>
              <p>Time: {new Date().toLocaleTimeString()}</p>
            </div>
          </div>

          <div className="space-y-2">
            <Button
              onClick={exportAsMarkdown}
              className="w-full bg-blue-900 hover:bg-blue-800 text-blue-400 border border-blue-600 font-mono"
            >
              <FileText className="w-4 h-4 mr-2" />
              EXPORT_AS_MARKDOWN
            </Button>

            <Button
              onClick={exportAsText}
              className="w-full bg-green-900 hover:bg-green-800 text-green-400 border border-green-600 font-mono"
            >
              <Code className="w-4 h-4 mr-2" />
              EXPORT_AS_TEXT
            </Button>
          </div>

          <div className="bg-yellow-900/20 border border-yellow-700 rounded p-3">
            <div className="text-xs text-yellow-300 font-mono">
              <p className="font-medium mb-1">[EXPORT_INFO]</p>
              <p>Files will be downloaded to your default download folder</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
