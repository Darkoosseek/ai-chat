"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Copy, Check, User, Bot, FileText, ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"

interface ChatMessageProps {
  message: {
    id: string
    role: "user" | "assistant"
    content: string
    fileInfo?: {
      name: string
      type: "file" | "image"
    }
  }
}

export function ChatMessage({ message }: ChatMessageProps) {
  const [copied, setCopied] = useState(false)
  const isUser = message.role === "user"

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Enhanced code block detection with language support
  const formatContent = (content: string) => {
    const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g
    const inlineCodeRegex = /`([^`]+)`/g
    const parts = []
    let lastIndex = 0
    let match

    while ((match = codeBlockRegex.exec(content)) !== null) {
      // Add text before code block
      if (match.index > lastIndex) {
        const textBefore = content.slice(lastIndex, match.index)
        parts.push({
          type: "text",
          content: textBefore.replace(inlineCodeRegex, '<code class="inline-code">$1</code>'),
        })
      }

      // Add code block
      parts.push({
        type: "code",
        language: match[1] || "text",
        content: match[2].trim(),
      })

      lastIndex = match.index + match[0].length
    }

    // Add remaining text
    if (lastIndex < content.length) {
      const remainingText = content.slice(lastIndex)
      parts.push({
        type: "text",
        content: remainingText.replace(inlineCodeRegex, '<code class="inline-code">$1</code>'),
      })
    }

    return parts.length > 0
      ? parts
      : [{ type: "text", content: content.replace(inlineCodeRegex, '<code class="inline-code">$1</code>') }]
  }

  const contentParts = formatContent(message.content)

  const getLanguageColor = (lang: string) => {
    const colors = {
      javascript: "text-yellow-400",
      typescript: "text-blue-400",
      python: "text-green-400",
      java: "text-red-400",
      cpp: "text-purple-400",
      html: "text-orange-400",
      css: "text-pink-400",
      json: "text-cyan-400",
      sql: "text-indigo-400",
      bash: "text-gray-400",
      shell: "text-gray-400",
    }
    return colors[lang.toLowerCase()] || "text-green-400"
  }

  return (
    <div className="font-mono text-sm mb-4">
      {isUser ? (
        <div className="flex items-start space-x-3 mb-2">
          <div className="flex-shrink-0 w-8 h-8 bg-green-500/20 border border-green-500/50 rounded-sm flex items-center justify-center">
            <User className="w-4 h-4 text-green-400" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-green-400 text-xs mb-1">user@terminal</div>
            {message.fileInfo && (
              <div className="mb-2 inline-flex items-center space-x-2 bg-gray-800/50 border border-green-500/30 rounded-sm px-3 py-2">
                {message.fileInfo.type === "image" ? (
                  <ImageIcon className="w-4 h-4 text-green-400" />
                ) : (
                  <FileText className="w-4 h-4 text-green-400" />
                )}
                <span className="text-green-300 text-xs">{message.fileInfo.name}</span>
                <span className="text-green-600 text-xs">{message.fileInfo.type === "image" ? "IMAGE" : "FILE"}</span>
              </div>
            )}
            <div className="text-green-300 break-words whitespace-pre-wrap">{message.content}</div>
          </div>
        </div>
      ) : (
        <Card className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-blue-500/30 mb-2">
          <CardContent className="p-4">
            <div className="group relative">
              <div className="flex items-start space-x-3 mb-3">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-500/20 border border-blue-500/50 rounded-sm flex items-center justify-center">
                  <Bot className="w-4 h-4 text-blue-400" />
                </div>
                <div className="flex-1">
                  <div className="text-blue-400 text-xs mb-2">ai@assistant</div>
                  <div className="space-y-3">
                    {contentParts.map((part, index) => (
                      <div key={index}>
                        {part.type === "code" ? (
                          <div className="bg-black/60 border border-green-500/30 rounded-md overflow-hidden">
                            <div className="bg-gray-800/80 px-4 py-2 text-xs border-b border-green-500/20 flex items-center justify-between">
                              <span className={`font-bold ${getLanguageColor(part.language)}`}>
                                {part.language.toUpperCase()}
                              </span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => navigator.clipboard.writeText(part.content)}
                                className="text-green-600 hover:text-green-400 hover:bg-green-500/20 p-1 h-auto"
                              >
                                <Copy className="w-3 h-3" />
                              </Button>
                            </div>
                            <pre className="p-4 text-green-300 text-sm overflow-x-auto">
                              <code>{part.content}</code>
                            </pre>
                          </div>
                        ) : (
                          <div
                            className="text-blue-100 whitespace-pre-wrap break-words leading-relaxed"
                            dangerouslySetInnerHTML={{
                              __html: part.content.replace(
                                /<code class="inline-code">([^<]+)<\/code>/g,
                                '<code class="bg-gray-800/60 text-green-400 px-1 py-0.5 rounded text-xs font-mono">$1</code>',
                              ),
                            }}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopy}
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-blue-600 hover:text-blue-400 hover:bg-blue-500/20 p-1 h-auto"
              >
                {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
