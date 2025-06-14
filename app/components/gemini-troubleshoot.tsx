"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { X, Eye, Globe } from "lucide-react"

interface GeminiTroubleshootProps {
  isOpen: boolean
  onClose: () => void
  onApiKeySave: (key: string) => void
}

export function GeminiTroubleshoot({ isOpen, onClose, onApiKeySave }: GeminiTroubleshootProps) {
  const [apiKey, setApiKey] = useState("")
  const [testing, setTesting] = useState(false)
  const [result, setResult] = useState<string>("")

  const testGeminiKey = async () => {
    if (!apiKey) return

    setTesting(true)
    setResult("Testing Gemini API key...")

    try {
      const response = await fetch("/api/test-gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ apiKey }),
      })

      const data = await response.json()
      setResult(data.message)

      if (data.success) {
        setTimeout(() => {
          onApiKeySave(apiKey)
          onClose()
        }, 2000)
      }
    } catch (error) {
      setResult(`❌ Test failed: ${error.message}`)
    } finally {
      setTesting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 font-mono">
      <Card className="w-full max-w-2xl bg-gray-900 border border-green-500/30">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b border-green-500/20">
          <CardTitle className="text-green-400 flex items-center space-x-2 font-mono">
            <Eye className="w-5 h-5" />
            <span>GEMINI VISION TROUBLESHOOT</span>
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose} className="text-green-400 hover:bg-green-500/20">
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-4 pt-4">
          {/* Why Gemini for Images */}
          <div className="bg-green-500/10 border border-green-500/30 rounded-sm p-4">
            <h3 className="text-green-400 font-bold mb-2 flex items-center">
              <Eye className="w-4 h-4 mr-2" />
              WHY GEMINI FOR IMAGES?
            </h3>
            <div className="text-green-300 text-sm space-y-1">
              <p>✅ FREE image analysis (15 requests/minute)</p>
              <p>✅ OCR text extraction from images</p>
              <p>✅ Diagram and chart analysis</p>
              <p>✅ Photo description and understanding</p>
              <p>❌ Other free providers don't support vision</p>
            </div>
          </div>

          {/* API Key Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-green-400 font-mono">GEMINI_API_KEY:</label>
            <Input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="AIzaSyC... (should start with AIza)"
              className="bg-black border border-green-500/30 text-green-400 placeholder-green-600 font-mono focus:border-green-400"
            />
          </div>

          <Button
            onClick={testGeminiKey}
            disabled={!apiKey || testing}
            className="w-full bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-500/50 font-mono"
          >
            {testing ? "TESTING_API_KEY..." : "TEST_GEMINI_VISION"}
          </Button>

          {result && (
            <div
              className={`border rounded-sm p-3 ${
                result.includes("✅") ? "bg-green-500/10 border-green-500/30" : "bg-red-500/10 border-red-500/30"
              }`}
            >
              <p className={`text-sm font-mono ${result.includes("✅") ? "text-green-300" : "text-red-300"}`}>
                {result}
              </p>
            </div>
          )}

          {/* Troubleshooting Steps */}
          <div className="bg-orange-500/10 border border-orange-500/30 rounded-sm p-3">
            <div className="text-xs text-orange-300 font-mono space-y-2">
              <p className="font-medium">[TROUBLESHOOTING_STEPS]</p>
              <div className="space-y-1 ml-2">
                <p>1. Go to aistudio.google.com/app/apikey</p>
                <p>2. Sign in with Google account</p>
                <p>3. Click "Create API Key"</p>
                <p>4. Copy key (starts with "AIza")</p>
                <p>5. If blocked: Try VPN or different Google account</p>
                <p>6. Enable "Generative Language API" in Google Cloud</p>
              </div>
            </div>
          </div>

          {/* Regional Issues */}
          <div className="bg-red-500/10 border border-red-500/30 rounded-sm p-3">
            <div className="flex items-start space-x-2">
              <Globe className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
              <div className="text-xs text-red-300 font-mono">
                <p className="font-medium mb-1">[REGIONAL_RESTRICTIONS]</p>
                <p>
                  Gemini may be blocked in some countries. If it doesn't work, use Groq/HuggingFace for text-only chat.
                </p>
              </div>
            </div>
          </div>

          {/* Alternative */}
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-sm p-3">
            <div className="text-xs text-blue-300 font-mono space-y-2">
              <p className="font-medium">[ALTERNATIVE_FOR_IMAGES]</p>
              <p>💰 Together AI: $25 free credits include vision models</p>
              <p>💰 OpenRouter: Pay-per-use, supports many vision models</p>
              <p>🆓 For text-only: Groq and HuggingFace work perfectly!</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
