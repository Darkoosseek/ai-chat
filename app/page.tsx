"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import {
  Settings,
  Send,
  Code,
  Github,
  AlertTriangle,
  Plus,
  Eye,
  Download,
  Volume2,
  VolumeX,
  ChevronDown,
  Square,
} from "lucide-react"
import { ApiKeyModal } from "./components/api-key-modal"
import { TerminalChatMessage } from "./components/terminal-chat-message"
import { WelcomeScreen } from "./components/welcome-screen"
import { HackerFileUpload } from "./components/hacker-file-upload"
import { GitHubIntegration } from "./components/github-integration"
import { UploadMenu } from "./components/upload-menu"
import { SystemMonitor } from "./components/system-monitor"
import { useCommandHistory } from "./components/command-history"
import { AutoComplete } from "./components/auto-complete"
import { MatrixRain } from "./components/matrix-rain"
import { useTypingSound } from "./components/typing-sound"
import { SessionExport } from "./components/session-export"
import { ImageGenerator } from "./components/image-generator"

export default function UltimateAITerminal() {
  const [apiKeys, setApiKeys] = useState<Record<string, string>>({})
  const [showSettings, setShowSettings] = useState(false)
  const [isConfigured, setIsConfigured] = useState(false)
  const [showFileUpload, setShowFileUpload] = useState(false)
  const [showGitHub, setShowGitHub] = useState(false)
  const [showImageGenerator, setShowImageGenerator] = useState(false)
  const [error, setError] = useState<string>("")
  const [showUploadMenu, setShowUploadMenu] = useState(false)
  const [uploadType, setUploadType] = useState<"files" | "images">("files")
  const [showAutoComplete, setShowAutoComplete] = useState(false)
  const [showExport, setShowExport] = useState(false)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [showScrollButton, setShowScrollButton] = useState(false)
  const [messages, setMessages] = useState<
    Array<{
      id: string
      role: "user" | "assistant"
      content: string
      fileInfo?: { name: string; type: "file" | "image" }
      imageUrl?: string
    }>
  >([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [abortController, setAbortController] = useState<AbortController | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)

  const { addToHistory, navigateHistory } = useCommandHistory()
  const { playTypingSound, playNotificationSound } = useTypingSound()

  // Scroll to bottom detection
  useEffect(() => {
    const container = chatContainerRef.current
    if (!container) return

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100
      setShowScrollButton(!isNearBottom)
    }

    container.addEventListener("scroll", handleScroll)
    handleScroll()

    return () => container.removeEventListener("scroll", handleScroll)
  }, [])

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    const container = chatContainerRef.current
    if (container) {
      const { scrollTop, scrollHeight, clientHeight } = container
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 200

      if (isNearBottom) {
        setTimeout(() => {
          container.scrollTo({
            top: container.scrollHeight,
            behavior: "smooth",
          })
        }, 100)
      }
    }
  }, [messages])

  useEffect(() => {
    const savedKeys = localStorage.getItem("ai-api-keys")
    if (savedKeys) {
      const keys = JSON.parse(savedKeys)
      setApiKeys(keys)
      setIsConfigured(Object.keys(keys).length > 0 || keys.configured === "true")
    }

    const savedSound = localStorage.getItem("ai-sound-enabled")
    if (savedSound !== null) {
      setSoundEnabled(JSON.parse(savedSound))
    }
  }, [])

  const scrollToBottom = () => {
    const container = chatContainerRef.current
    if (container) {
      container.scrollTo({
        top: container.scrollHeight,
        behavior: "smooth",
      })
    }
  }

  const stopGeneration = () => {
    if (abortController) {
      abortController.abort()
      setAbortController(null)
      setIsLoading(false)
      setError("Generation stopped by user")
      setTimeout(() => setError(""), 3000)
    }
  }

  const handleApiKeysSave = (keys: Record<string, string>) => {
    setApiKeys(keys)
    localStorage.setItem("ai-api-keys", JSON.stringify(keys))
    setIsConfigured(Object.keys(keys).length > 0 || keys.configured === "true")
    setShowSettings(false)
    setError("")
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (soundEnabled) playTypingSound()

    if (e.key === "ArrowUp") {
      e.preventDefault()
      const command = navigateHistory("up")
      if (command !== null) setInput(command)
    } else if (e.key === "ArrowDown") {
      e.preventDefault()
      const command = navigateHistory("down")
      if (command !== null) setInput(command)
    } else if (e.key === "Tab") {
      e.preventDefault()
      setShowAutoComplete(true)
    } else if (e.key === "Escape") {
      setShowAutoComplete(false)
    }
  }

  const sendToGemini = async (
    userMessage: string,
    fileInfo?: { name: string; type: "file" | "image" },
    imageUrl?: string,
    skipUserMessage?: boolean, // New parameter to skip adding user message
  ) => {
    if (!apiKeys.gemini) {
      setError("Please configure your Gemini API key")
      return
    }

    const controller = new AbortController()
    setAbortController(controller)
    setIsLoading(true)
    setError("")

    // Only add user message if not skipping
    let currentMessages = messages
    if (!skipUserMessage) {
      const userMsg = {
        id: Date.now().toString(),
        role: "user" as const,
        content: userMessage,
        fileInfo,
        imageUrl,
      }
      setMessages((prev) => [...prev, userMsg])
      currentMessages = [...messages, userMsg]
    }

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: currentMessages.map((m) => ({ role: m.role, content: m.content })),
          apiKey: apiKeys.gemini,
          provider: "gemini",
          model: "gemini-1.5-flash",
        }),
        signal: controller.signal,
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Gemini API error: ${errorText}`)
      }

      const aiResponse = await response.text()

      // Add AI response
      const aiMsg = {
        id: (Date.now() + 1).toString(),
        role: "assistant" as const,
        content: aiResponse,
        imageUrl: imageUrl, // Pass through the image URL if it exists
      }
      setMessages((prev) => [...prev, aiMsg])

      if (soundEnabled) playNotificationSound()
    } catch (error: any) {
      if (error.name === "AbortError") {
        console.log("Generation aborted by user")
        return
      }

      console.error("Gemini error:", error)
      setError(`Gemini error: ${error.message}`)

      // Add error message
      const errorMsg = {
        id: (Date.now() + 1).toString(),
        role: "assistant" as const,
        content: `Sorry, I encountered an error: ${error.message}. Please check your Gemini API key.`,
      }
      setMessages((prev) => [...prev, errorMsg])
    } finally {
      setIsLoading(false)
      setAbortController(null)
    }
  }

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim() && !isLoading) {
      addToHistory(input)
      setShowAutoComplete(false)
      sendToGemini(input)
      setInput("")
    }
  }

  const handleAutoCompleteSelect = (suggestion: string) => {
    setInput(suggestion)
    setShowAutoComplete(false)
    inputRef.current?.focus()
  }

  const toggleSound = () => {
    const newSoundState = !soundEnabled
    setSoundEnabled(newSoundState)
    localStorage.setItem("ai-sound-enabled", JSON.stringify(newSoundState))
  }

  const handleFileContent = async (
    fileName: string,
    content: string,
    fileType: "file" | "image",
    customPrompt?: string,
  ) => {
    const prompt = customPrompt || "Analyze this file and explain what it does."
    const message = `${prompt}

File: ${fileName}

File content:
\`\`\`
${content}
\`\`\``

    await sendToGemini(message, { name: fileName, type: fileType })
  }

  const handleImageAnalysis = async (imageData: string, fileName: string, customPrompt: string) => {
    try {
      console.log("Starting image analysis...")
      setError("")

      // Add user message showing the image upload
      const userMsg = {
        id: Date.now().toString(),
        role: "user" as const,
        content: `📸 **Image Uploaded: ${fileName}**\n\n${customPrompt || "Please analyze this image and describe what you see."}`,
        fileInfo: { name: fileName, type: "image" as const },
      }
      setMessages((prev) => [...prev, userMsg])

      const response = await fetch("/api/analyze-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageData,
          prompt: customPrompt || "Analyze this image in detail and describe everything you can see.",
          apiKey: apiKeys.gemini,
        }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Image analysis failed: ${errorText}`)
      }

      const result = await response.json()

      // Add AI response directly without sending to Gemini again
      const aiMsg = {
        id: (Date.now() + 1).toString(),
        role: "assistant" as const,
        content: `🔍 **Image Analysis Results:**\n\n${result.description}`,
      }
      setMessages((prev) => [...prev, aiMsg])

      if (soundEnabled) playNotificationSound()

      console.log("Image analysis completed")
    } catch (error: any) {
      console.error("Image analysis failed:", error)
      setError(`Image analysis failed: ${error.message}`)

      // Add error message
      const errorMsg = {
        id: (Date.now() + 1).toString(),
        role: "assistant" as const,
        content: `❌ **Image Analysis Failed**\n\nError: ${error.message}\n\nPlease check your Gemini API key and try again.`,
      }
      setMessages((prev) => [...prev, errorMsg])
    }
  }

  const handleImageGeneration = async (prompt: string) => {
    try {
      setError("")
      setIsLoading(true)

      const response = await fetch("/api/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      })

      const result = await response.json()

      if (result.success) {
        // Add the generated image to chat with the image URL
        await sendToGemini(
          `🎨 **Generated Image Successfully!**

**Prompt:** "${result.prompt}"
**Service:** ${result.service || "AI Generator"}

Here's your AI-generated image! What do you think of it? Would you like me to:
- Generate variations of this image
- Create something completely different  
- Analyze what's in this image
- Help you refine the prompt for better results

Just let me know what you'd like to do next!`,
          { name: "Generated Image", type: "image" },
          result.imageUrl, // Pass the actual image URL
        )
      } else {
        await sendToGemini(
          `❌ **Image Generation Failed**

**Prompt:** "${prompt}"

${result.message}

Would you like to try a different prompt or need help with something else?`,
        )
      }
    } catch (error: any) {
      console.error("Image generation failed:", error)
      setError(`Image generation failed: ${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  const handleGitHubContent = async (content: string) => {
    await sendToGemini(content)
    setShowGitHub(false)
  }

  const handleClearChat = () => {
    setMessages([])
    setInput("")
    setError("")
  }

  const handleUploadMenuOpen = (type: "files" | "images") => {
    setUploadType(type)
    setShowFileUpload(true)
    setShowUploadMenu(false)
  }

  if (!isConfigured) {
    return <WelcomeScreen onApiKeysSave={handleApiKeysSave} />
  }

  const hasGeminiKey = !!apiKeys.gemini

  return (
    <div className="min-h-screen bg-black text-green-400 font-mono relative overflow-hidden">
      {/* Matrix Rain Background */}
      <MatrixRain />

      <div className="relative z-10 flex flex-col h-screen">
        {/* Header */}
        <header className="bg-gray-900/95 border-b border-gray-700 p-4 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto">
            {/* System Stats */}
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-800">
              <SystemMonitor />
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleSound}
                  className="text-gray-400 hover:text-gray-200 hover:bg-gray-800 p-1"
                >
                  {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowExport(true)}
                  className="text-gray-400 hover:text-gray-200 hover:bg-gray-800 border border-gray-600 font-mono"
                  disabled={messages.length === 0}
                >
                  <Download className="w-4 h-4 mr-1" />
                  export
                </Button>
              </div>
            </div>

            {/* Main Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gray-800 border border-green-500/50 rounded relative">
                  <Eye className="w-6 h-6 text-green-400" />
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-green-400">gemini@ai-terminal:~$</h1>
                  <p className="text-sm text-gray-500">FREE AI Terminal - Chat + Vision + Image Generation</p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <div className="bg-green-900/50 border border-green-600 rounded px-3 py-1">
                  <span className="text-green-400 font-mono text-sm">🎨 AI Studio {hasGeminiKey ? "✅" : "❌"}</span>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowGitHub(true)}
                  className="text-gray-400 hover:text-gray-200 hover:bg-gray-800 border border-gray-600 font-mono"
                >
                  <Github className="w-4 h-4 mr-1" />
                  repo
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearChat}
                  className="text-gray-400 hover:text-gray-200 hover:bg-gray-800 border border-gray-600 font-mono"
                >
                  <Code className="w-4 h-4 mr-1" />
                  clear
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowSettings(true)}
                  className="text-gray-400 hover:text-gray-200 hover:bg-gray-800 border border-gray-600 font-mono"
                >
                  <Settings className="w-4 h-4 mr-1" />
                  config
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Status Bars */}
        {error && (
          <div className="bg-red-900/20 border-b border-red-700 p-2 backdrop-blur-sm">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-red-400" />
                <span className="text-red-300 font-mono text-sm">{error}</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setError("")}
                className="text-red-400 hover:bg-red-900/20"
              >
                ✕
              </Button>
            </div>
          </div>
        )}

        {!hasGeminiKey && (
          <div className="bg-yellow-900/20 border-b border-yellow-700 p-2 backdrop-blur-sm">
            <div className="max-w-7xl mx-auto flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-yellow-400" />
              <span className="text-yellow-300 font-mono text-sm">
                Configure your FREE Gemini API key to start chatting and generating images
              </span>
            </div>
          </div>
        )}

        {/* Chat Area */}
        <div className="flex-1 overflow-hidden">
          <div className="h-full max-w-7xl mx-auto flex flex-col">
            <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 space-y-2">
              {messages.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <Card className="bg-gray-900/90 border border-gray-700 p-8 text-center backdrop-blur-sm">
                    <CardContent className="space-y-4">
                      <div className="p-4 bg-gray-800 border border-green-500/50 rounded w-16 h-16 mx-auto flex items-center justify-center relative">
                        <Eye className="w-8 h-8 text-green-400" />
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                      </div>
                      <h3 className="text-xl font-bold text-green-400 font-mono">FREE AI STUDIO TERMINAL</h3>
                      <p className="text-gray-500 font-mono">Chat + Vision + Image Generation • 100% Free</p>
                      <div className="text-left text-sm text-gray-400 font-mono space-y-1">
                        <p>• 🆓 Completely FREE - no credits needed</p>
                        <p>• 💬 Smart conversations and coding help</p>
                        <p>• 👁️ Image analysis and OCR</p>
                        <p>• 🎨 AI image generation (Multiple services)</p>
                        <p>• 📁 File analysis with custom prompts</p>
                        <p>• 🔗 GitHub repository integration</p>
                        <p>• 🎯 Enhanced code syntax highlighting</p>
                        <p>• ⌨️ Command history (↑↓ arrows)</p>
                        <p>• 🔍 Auto-complete (Tab key)</p>
                        <p>• 🔊 Terminal sound effects</p>
                        <p>• 📊 Real-time system monitoring</p>
                        <p>• 💾 Session export functionality</p>
                        <p>• ⏹️ Stop generation anytime</p>
                        <p>• 📍 Auto-scroll + manual scroll button</p>
                        <p>• 💾 Download generated images</p>
                      </div>
                      {!hasGeminiKey && (
                        <div className="bg-yellow-900/20 border border-yellow-700 rounded p-3 mt-4">
                          <p className="text-yellow-300 font-mono text-sm">Get your FREE Gemini API key to start!</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <div className="space-y-1">
                  {messages.map((message) => (
                    <TerminalChatMessage key={message.id} message={message} />
                  ))}
                </div>
              )}

              {isLoading && (
                <div className="flex items-center justify-between text-gray-400 font-mono bg-gray-900/90 border border-gray-700 rounded p-3 backdrop-blur-sm">
                  <div className="flex items-center space-x-2">
                    <Eye className="w-4 h-4 animate-pulse" />
                    <span className="text-sm">ai@processing:</span>
                    <div className="flex space-x-1">
                      <div className="w-1 h-4 bg-green-500 animate-pulse"></div>
                      <div className="w-1 h-4 bg-green-500 animate-pulse delay-100"></div>
                      <div className="w-1 h-4 bg-green-500 animate-pulse delay-200"></div>
                    </div>
                    <span className="text-gray-600 text-xs">FREE_AI_WORKING...</span>
                  </div>
                  <Button
                    onClick={stopGeneration}
                    className="bg-red-900 hover:bg-red-800 text-red-400 border border-red-600 font-mono px-3 py-1"
                    size="sm"
                  >
                    <Square className="w-3 h-3 mr-1" />
                    stop
                  </Button>
                </div>
              )}
            </div>

            {/* Scroll to Bottom Button */}
            {showScrollButton && (
              <Button
                onClick={scrollToBottom}
                className="fixed bottom-24 right-6 z-40 bg-green-900/90 hover:bg-green-800 text-green-400 border border-green-600 rounded-full p-3 shadow-lg backdrop-blur-sm animate-bounce"
                size="sm"
              >
                <ChevronDown className="w-5 h-5" />
              </Button>
            )}

            {/* Input Area */}
            <div className="p-4 bg-gray-900/95 border-t border-gray-700 relative backdrop-blur-sm">
              <AutoComplete input={input} onSelect={handleAutoCompleteSelect} isVisible={showAutoComplete} />

              <form onSubmit={handleFormSubmit} className="flex items-center space-x-2">
                <span className="text-green-400 font-mono text-sm">ai@studio:~$</span>
                <div className="flex-1 relative">
                  <Input
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onFocus={() => setShowAutoComplete(false)}
                    placeholder={
                      hasGeminiKey
                        ? "Ask anything, analyze images, or generate art... (↑↓ for history, Tab for suggestions)"
                        : "Get your FREE Gemini API key first..."
                    }
                    className="bg-black/80 border border-gray-600 text-gray-200 placeholder-gray-500 font-mono focus:border-green-500 focus:ring-green-500/20 backdrop-blur-sm"
                    disabled={isLoading || !hasGeminiKey}
                  />
                </div>
                <Button
                  type="button"
                  onClick={() => setShowUploadMenu(!showUploadMenu)}
                  className="bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-600 font-mono px-3"
                  disabled={!hasGeminiKey}
                >
                  <Plus className="w-4 h-4" />
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading || !input.trim() || !hasGeminiKey}
                  className="bg-green-900 hover:bg-green-800 text-green-400 border border-green-600 font-mono px-4"
                >
                  <Send className="w-4 h-4 mr-1" />
                  exec
                </Button>
              </form>

              {/* Upload Menu */}
              <UploadMenu
                isOpen={showUploadMenu}
                onClose={() => setShowUploadMenu(false)}
                onFileUpload={() => handleUploadMenuOpen("files")}
                onImageUpload={() => handleUploadMenuOpen("images")}
                onImageGeneration={() => setShowImageGenerator(true)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <ApiKeyModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        onSave={handleApiKeysSave}
        currentApiKeys={apiKeys}
      />

      <HackerFileUpload
        isOpen={showFileUpload}
        onClose={() => setShowFileUpload(false)}
        onFileContent={handleFileContent}
        onImageAnalysis={handleImageAnalysis}
        hasVisionAPI={hasGeminiKey}
        uploadType={uploadType}
      />

      <GitHubIntegration isOpen={showGitHub} onClose={() => setShowGitHub(false)} onContent={handleGitHubContent} />

      <SessionExport isOpen={showExport} onClose={() => setShowExport(false)} messages={messages} />

      <ImageGenerator
        isOpen={showImageGenerator}
        onClose={() => setShowImageGenerator(false)}
        onGenerate={handleImageGeneration}
      />
    </div>
  )
}
