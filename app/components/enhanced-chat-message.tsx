"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Copy, Check, User, Bot, FileText, ImageIcon, Sparkles, Zap, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"

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

export function EnhancedChatMessage({ message }: ChatMessageProps) {
  const [copied, setCopied] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [displayedContent, setDisplayedContent] = useState("")
  const isUser = message.role === "user"

  // Typing animation for AI responses
  useEffect(() => {
    if (!isUser && message.content && displayedContent !== message.content) {
      setIsTyping(true)
      let index = 0
      const timer = setInterval(() => {
        if (index < message.content.length) {
          setDisplayedContent(message.content.slice(0, index + 1))
          index++
        } else {
          setIsTyping(false)
          clearInterval(timer)
        }
      }, 20)
      return () => clearInterval(timer)
    } else if (isUser) {
      setDisplayedContent(message.content)
    }
  }, [message.content, isUser, displayedContent])

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
      if (match.index > lastIndex) {
        const textBefore = content.slice(lastIndex, match.index)
        parts.push({
          type: "text",
          content: textBefore.replace(inlineCodeRegex, '<code class="inline-code">$1</code>'),
        })
      }

      parts.push({
        type: "code",
        language: match[1] || "text",
        content: match[2].trim(),
      })

      lastIndex = match.index + match[0].length
    }

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

  const contentParts = formatContent(displayedContent)

  const getLanguageColor = (lang: string) => {
    const colors = {
      javascript: "text-yellow-400 bg-yellow-400/10",
      typescript: "text-blue-400 bg-blue-400/10",
      python: "text-green-400 bg-green-400/10",
      java: "text-red-400 bg-red-400/10",
      cpp: "text-purple-400 bg-purple-400/10",
      html: "text-orange-400 bg-orange-400/10",
      css: "text-pink-400 bg-pink-400/10",
      json: "text-cyan-400 bg-cyan-400/10",
      sql: "text-indigo-400 bg-indigo-400/10",
      bash: "text-gray-400 bg-gray-400/10",
      shell: "text-gray-400 bg-gray-400/10",
    }
    return colors[lang.toLowerCase()] || "text-green-400 bg-green-400/10"
  }

  return (
    <div className="font-mono text-sm mb-6">
      {isUser ? (
        <div className="flex items-start space-x-4 mb-3">
          <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-green-500/30 to-emerald-500/30 border-2 border-green-500/50 rounded-lg flex items-center justify-center shadow-lg shadow-green-500/20">
            <User className="w-5 h-5 text-green-400" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-green-400 text-xs font-bold">USER@TERMINAL</span>
              <div className="h-1 w-1 bg-green-400 rounded-full animate-pulse"></div>
            </div>
            {message.fileInfo && (
              <div className="mb-3 inline-flex items-center space-x-3 bg-gradient-to-r from-gray-800/80 to-gray-700/80 border border-green-500/30 rounded-lg px-4 py-3 backdrop-blur-sm">
                <div className="flex items-center space-x-2">
                  {message.fileInfo.type === "image" ? (
                    <div className="p-2 bg-purple-500/20 rounded-md">
                      <ImageIcon className="w-4 h-4 text-purple-400" />
                    </div>
                  ) : (
                    <div className="p-2 bg-blue-500/20 rounded-md">
                      <FileText className="w-4 h-4 text-blue-400" />
                    </div>
                  )}
                  <div>
                    <span className="text-green-300 text-sm font-medium">{message.fileInfo.name}</span>
                    <div className="text-green-600 text-xs uppercase tracking-wider">
                      {message.fileInfo.type === "image" ? "IMAGE UPLOADED" : "FILE UPLOADED"}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-green-400 text-xs">PROCESSED</span>
                </div>
              </div>
            )}
            <div className="text-green-300 break-words whitespace-pre-wrap leading-relaxed bg-gray-900/30 border border-green-500/20 rounded-lg p-4 backdrop-blur-sm">
              {message.content}
            </div>
          </div>
        </div>
      ) : (
        <Card className="bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-indigo-900/20 border-2 border-purple-500/30 mb-4 shadow-2xl shadow-purple-500/10 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="group relative">
              <div className="flex items-start space-x-4 mb-4">
                <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-purple-500/30 to-blue-500/30 border-2 border-purple-500/50 rounded-lg flex items-center justify-center shadow-lg shadow-purple-500/20">
                  <Bot className="w-5 h-5 text-purple-400" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <span className="text-purple-400 text-xs font-bold tracking-wider">DEEPSEEK@AI-ASSISTANT</span>
                    <div className="flex items-center space-x-1">
                      <Sparkles className="w-3 h-3 text-purple-400 animate-pulse" />
                      <span className="text-purple-600 text-xs">REASONING</span>
                    </div>
                    {isTyping && (
                      <div className="flex items-center space-x-1">
                        <div className="flex space-x-1">
                          <div className="w-1 h-1 bg-purple-400 rounded-full animate-bounce"></div>
                          <div className="w-1 h-1 bg-purple-400 rounded-full animate-bounce delay-100"></div>
                          <div className="w-1 h-1 bg-purple-400 rounded-full animate-bounce delay-200"></div>
                        </div>
                        <span className="text-purple-600 text-xs">THINKING...</span>
                      </div>
                    )}
                  </div>
                  <div className="space-y-4">
                    {contentParts.map((part, index) => (
                      <div key={index}>
                        {part.type === "code" ? (
                          <div className="bg-black/70 border-2 border-cyan-500/30 rounded-xl overflow-hidden shadow-lg shadow-cyan-500/10">
                            <div
                              className={`px-6 py-3 text-xs border-b border-cyan-500/20 flex items-center justify-between ${getLanguageColor(part.language)}`}
                            >
                              <div className="flex items-center space-x-2">
                                <Zap className="w-3 h-3" />
                                <span className="font-bold tracking-wider">{part.language.toUpperCase()}</span>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => navigator.clipboard.writeText(part.content)}
                                className="text-current hover:bg-current/20 p-1 h-auto"
                              >
                                <Copy className="w-3 h-3" />
                              </Button>
                            </div>
                            <pre className="p-6 text-cyan-300 text-sm overflow-x-auto leading-relaxed bg-gradient-to-br from-gray-900/50 to-black/50">
                              <code>{part.content}</code>
                            </pre>
                          </div>
                        ) : (
                          <div
                            className="text-blue-100 whitespace-pre-wrap break-words leading-relaxed text-base"
                            dangerouslySetInnerHTML={{
                              __html: part.content.replace(
                                /<code class="inline-code">([^<]+)<\/code>/g,
                                '<code class="bg-cyan-500/20 text-cyan-300 px-2 py-1 rounded-md text-sm font-mono border border-cyan-500/30">$1</code>',
                              ),
                            }}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-purple-500/20">
                <div className="flex items-center space-x-2 text-purple-600 text-xs">
                  <Eye className="w-3 h-3" />
                  <span>RESPONSE GENERATED</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCopy}
                  className="opacity-0 group-hover:opacity-100 transition-opacity text-purple-600 hover:text-purple-400 hover:bg-purple-500/20 p-2 h-auto"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
