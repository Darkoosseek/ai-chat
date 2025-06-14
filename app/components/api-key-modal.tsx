"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { X, ExternalLink, Shield, Terminal, Eye } from "lucide-react"

interface ApiKeyModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (apiKeys: Record<string, string>) => void
  currentApiKeys: Record<string, string>
}

export function ApiKeyModal({ isOpen, onClose, onSave, currentApiKeys }: ApiKeyModalProps) {
  const [geminiKey, setGeminiKey] = useState(currentApiKeys.gemini || "")

  if (!isOpen) return null

  const handleSave = () => {
    onSave({ gemini: geminiKey })
  }

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 font-mono">
      <Card className="w-full max-w-2xl bg-gray-900 border border-gray-700 max-h-[90vh] flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b border-gray-700 flex-shrink-0">
          <CardTitle className="text-green-400 flex items-center space-x-2 font-mono">
            <Terminal className="w-5 h-5" />
            <span>FREE AI CONFIGURATION</span>
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
        <CardContent className="pt-4 overflow-y-auto flex-1">
          {/* Gemini Setup */}
          <div className="bg-green-500/10 border border-green-500/30 rounded p-4 mb-6">
            <h3 className="text-green-400 font-bold mb-3 flex items-center">
              <Eye className="w-4 h-4 mr-2" />
              GOOGLE GEMINI - 100% FREE
            </h3>
            <div className="text-sm text-green-300 space-y-1 mb-4">
              <p>✅ Completely FREE forever</p>
              <p>✅ Smart conversations and coding help</p>
              <p>✅ Image analysis and OCR</p>
              <p>✅ 15 requests per minute (plenty for chat)</p>
              <p>✅ No credit card required</p>
            </div>
          </div>

          {/* API Key Input */}
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-green-400 font-mono">GEMINI_API_KEY:</label>
              <Input
                type="password"
                value={geminiKey}
                onChange={(e) => setGeminiKey(e.target.value)}
                placeholder="AIzaSyC... (should start with AIza)"
                className="bg-black border border-gray-600 text-gray-200 placeholder-gray-500 font-mono focus:border-green-400"
              />
            </div>

            {/* Instructions */}
            <div className="bg-blue-500/10 border border-blue-500/30 rounded p-3">
              <div className="text-xs text-blue-300 font-mono space-y-2">
                <p className="font-medium">[SETUP_INSTRUCTIONS]</p>
                <ol className="space-y-1 ml-2">
                  <li>1. Go to aistudio.google.com/app/apikey</li>
                  <li>2. Sign in with Google account</li>
                  <li>3. Click "Create API Key"</li>
                  <li>4. Copy the key (starts with "AIza")</li>
                  <li>5. Paste it above and save!</li>
                </ol>
                <a
                  href="https://aistudio.google.com/app/apikey"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-1 text-green-400 hover:text-green-300"
                >
                  <span>GET_FREE_API_KEY</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            {/* Why Gemini */}
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded p-3">
              <div className="text-xs text-yellow-300 font-mono space-y-2">
                <p className="font-medium">[WHY_GEMINI_IS_PERFECT]</p>
                <div className="space-y-1 ml-2">
                  <p>• 100% FREE with no hidden costs</p>
                  <p>• Great for coding, writing, and analysis</p>
                  <p>• Built-in vision for image analysis</p>
                  <p>• Fast and reliable responses</p>
                  <p>• No complex setup or billing</p>
                  <p>• Perfect for personal projects</p>
                </div>
              </div>
            </div>

            {/* Security */}
            <div className="bg-red-500/10 border border-red-500/30 rounded p-3">
              <div className="flex items-start space-x-2">
                <Shield className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                <div className="text-xs text-red-300 font-mono">
                  <p className="font-medium mb-1">[SECURITY]</p>
                  <p>API key stored locally only. Never sent to our servers.</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        <div className="flex space-x-2 p-4 border-t border-gray-700 flex-shrink-0">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1 border-red-700 text-red-400 hover:bg-red-900/20 font-mono"
          >
            cancel
          </Button>
          <Button
            onClick={handleSave}
            className="flex-1 bg-green-900 hover:bg-green-800 text-green-400 border border-green-600 font-mono"
          >
            save_config
          </Button>
        </div>
      </Card>
    </div>
  )
}
