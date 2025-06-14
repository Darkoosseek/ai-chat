"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Copy, Check, User, Bot, FileText, ImageIcon, Terminal, Download, RefreshCw, Sparkles, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"

interface TerminalChatMessageProps {
  message: {
    id: string
    role: "user" | "assistant"
    content: string
    fileInfo?: {
      name: string
      type: "file" | "image"
    }
    imageUrl?: string
  }
}

export function TerminalChatMessage({ message }: TerminalChatMessageProps) {
  const [copied, setCopied] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)
  const [retryCount, setRetryCount] = useState(0)
  const [isTyping, setIsTyping] = useState(false)
  const [displayedContent, setDisplayedContent] = useState("")
  const isUser = message.role === "user"

  // Typing animation for AI responses
  useEffect(() => {
    if (!isUser && message.content && displayedContent !== message.content) {
      setIsTyping(true)
      setDisplayedContent("")
      let index = 0
      const timer = setInterval(() => {
        if (index < message.content.length) {
          setDisplayedContent(message.content.slice(0, index + 1))
          index++
        } else {
          setIsTyping(false)
          clearInterval(timer)
        }
      }, 15) // Faster typing
      return () => clearInterval(timer)
    } else if (isUser) {
      setDisplayedContent(message.content)
    }
  }, [message.content, isUser])

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleImageDownload = async () => {
    if (!message.imageUrl) return

    try {
      // Create a proxy URL to handle CORS
      const proxyUrl = `/api/proxy-image?url=${encodeURIComponent(message.imageUrl)}`
      const response = await fetch(proxyUrl)

      if (!response.ok) {
        // Fallback: try direct download
        const a = document.createElement("a")
        a.href = message.imageUrl
        a.download = `ai-generated-image-${Date.now()}.png`
        a.target = "_blank"
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        return
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `ai-generated-image-${Date.now()}.png`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error("Download failed:", error)
      // Fallback: open in new tab
      window.open(message.imageUrl, "_blank")
    }
  }

  const retryImageLoad = () => {
    setImageError(false)
    setImageLoaded(false)
    setRetryCount((prev) => prev + 1)
  }

  // Enhanced code block detection
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

  const getLanguageIcon = (lang: string) => {
    const icons = {
      javascript: "JS",
      typescript: "TS",
      python: "PY",
      java: "JAVA",
      cpp: "C++",
      html: "HTML",
      css: "CSS",
      json: "JSON",
      sql: "SQL",
      bash: "BASH",
      shell: "SH",
    }
    return icons[lang.toLowerCase()] || lang.toUpperCase()
  }

  return (
    <div className="font-mono text-sm mb-6">
      {isUser ? (
        <div className="flex items-start space-x-4 mb-4">
          <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-green-500/30 to-emerald-500/30 border-2 border-green-500/50 rounded-lg flex items-center justify-center shadow-lg shadow-green-500/20">
            <User className="w-5 h-5 text-green-400" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-3">
              <span className="text-green-400 text-xs font-bold tracking-wider">USER@TERMINAL</span>
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
<Card className="bg-transparent border-2 border-purple-500/30 mb-6 shadow-2xl shadow-purple-500/10">          <CardContent className="p-6">
            <div className="group relative">
              <div className="flex items-start space-x-4 mb-4">
                <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-purple-500/30 to-blue-500/30 border-2 border-purple-500/50 rounded-lg flex items-center justify-center shadow-lg shadow-purple-500/20">
                  <Bot className="w-5 h-5 text-purple-400" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-4">
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

                  {/* Enhanced Generated Image Display */}
                  {message.imageUrl && (
                    <div className="mb-6">
                      <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 border-2 border-purple-500/40 rounded-xl p-4 max-w-2xl backdrop-blur-sm">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-2">
                            <div className="p-2 bg-purple-500/20 rounded-lg">
                              <Sparkles className="w-4 h-4 text-purple-400" />
                            </div>
                            <span className="text-purple-400 text-sm font-bold tracking-wider">
                              AI GENERATED ARTWORK
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            {imageError && (
                              <Button
                                onClick={retryImageLoad}
                                size="sm"
                                className="bg-yellow-900 hover:bg-yellow-800 text-yellow-400 border border-yellow-600 font-mono px-2 py-1 h-auto"
                              >
                                <RefreshCw className="w-3 h-3 mr-1" />
                                retry
                              </Button>
                            )}
                            <Button
                              onClick={handleImageDownload}
                              size="sm"
                              className="bg-purple-900 hover:bg-purple-800 text-purple-400 border border-purple-600 font-mono px-3 py-1 h-auto shadow-lg"
                            >
                              <Download className="w-3 h-3 mr-1" />
                              download
                            </Button>
                          </div>
                        </div>

                        <div className="relative overflow-hidden rounded-lg border border-purple-500/30">
                          {!imageError ? (
                            <img
                              key={`${message.imageUrl}-${retryCount}`}
                              src={message.imageUrl || "/placeholder.svg"}
                              alt="AI Generated Artwork"
                              className={`w-full h-auto transition-all duration-500 ${
                                imageLoaded ? "opacity-100 scale-100" : "opacity-0 scale-95"
                              }`}
                              onLoad={() => {
                                setImageLoaded(true)
                                setImageError(false)
                              }}
                              onError={() => {
                                setImageError(true)
                                setImageLoaded(false)
                              }}
                              crossOrigin="anonymous"
                            />
                          ) : (
                            <div className="w-full h-64 bg-gradient-to-br from-red-900/20 to-orange-900/20 border border-red-500/30 rounded flex flex-col items-center justify-center">
                              <Zap className="w-8 h-8 text-red-400 mb-2" />
                              <span className="text-red-400 text-sm font-mono">Failed to load image</span>
                              <span className="text-red-600 text-xs">Try refreshing or check connection</span>
                            </div>
                          )}

                          {!imageLoaded && !imageError && (
                            <div className="absolute inset-0 flex items-center justify-center bg-purple-900/50 backdrop-blur-sm">
                              <div className="flex flex-col items-center space-y-2">
                                <div className="flex space-x-1">
                                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce delay-100"></div>
                                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce delay-200"></div>
                                </div>
                                <span className="text-purple-400 text-xs font-mono">Loading artwork...</span>
                              </div>
                            </div>
                          )}
                        </div>

                        {imageLoaded && !imageError && (
                          <div className="mt-3 flex items-center justify-center space-x-2 text-purple-600 text-xs">
                            <Sparkles className="w-3 h-3" />
                            <span>Artwork generated successfully</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="space-y-4">
                    {contentParts.map((part, index) => (
                      <div key={index}>
                        {part.type === "code" ? (
                          <div className="bg-black/70 border-2 border-cyan-500/30 rounded-xl overflow-hidden shadow-lg shadow-cyan-500/10">
                            <div className="bg-gradient-to-r from-cyan-900/50 to-blue-900/50 px-6 py-3 text-xs border-b border-cyan-500/20 flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <Zap className="w-3 h-3 text-cyan-400" />
                                <span className="font-bold tracking-wider text-cyan-300">
                                  {getLanguageIcon(part.language)}
                                </span>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => navigator.clipboard.writeText(part.content)}
                                className="text-cyan-400 hover:bg-cyan-500/20 p-1 h-auto"
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

              <div className="flex items-center justify-between pt-4 border-t border-purple-500/20">
                <div className="flex items-center space-x-2 text-purple-600 text-xs">
                  <Terminal className="w-3 h-3" />
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
