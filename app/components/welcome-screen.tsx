"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Terminal, ExternalLink, Shield, Eye } from "lucide-react"

interface WelcomeScreenProps {
  onApiKeysSave: (apiKeys: Record<string, string>) => void
}

export function WelcomeScreen({ onApiKeysSave }: WelcomeScreenProps) {
  return (
    <div className="min-h-screen bg-black text-green-400 font-mono flex items-center justify-center p-4">
      {/* Subtle matrix background */}
      <div className="absolute inset-0 overflow-hidden opacity-5">
        <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(90deg,transparent_98%,rgba(0,255,0,0.1)_100%)] bg-[length:50px_50px]"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(0deg,transparent_98%,rgba(0,255,0,0.1)_100%)] bg-[length:50px_50px]"></div>
      </div>

      <div className="relative z-10 w-full max-w-4xl">
        {/* ASCII Art Header */}
        <div className="text-center mb-12">
          <pre className="text-green-400 text-xs mb-6 overflow-x-auto">
            {`
 ██████╗ ███████╗███╗   ███╗██╗███╗   ██╗██╗    ████████╗███████╗██████╗ ███╗   ███╗██╗███╗   ██╗ █████╗ ██╗     
██╔════╝ ██╔════╝████╗ ████║██║████╗  ██║██║    ╚══██╔══╝██╔════╝██╔══██╗████╗ ████║██║████╗  ██║██╔══██╗██║     
██║  ███╗█████╗  ██╔████╔██║██║██╔██╗ ██║██║       ██║   █████╗  ██████╔╝██╔████╔██║██║██╔██╗ ██║███████║██║     
██║   ██║██╔══╝  ██║╚██╔╝██║██║██║╚██╗██║██║       ██║   ██╔══╝  ██╔══██╗██║╚██╔╝██║██║██║╚██╗██║██╔══██║██║     
╚██████╔╝███████╗██║ ╚═╝ ██║██║██║ ╚████║██║       ██║   ███████╗██║  ██║██║ ╚═╝ ██║██║██║ ╚████║██║  ██║███████╗
 ╚═════╝ ╚══════╝╚═╝     ╚═╝╚═╝╚═╝  ╚═══╝╚═╝       ╚═╝   ╚══════╝╚═╝  ╚═╝╚═╝     ╚═╝╚═╝╚═╝  ╚═══╝╚═╝  ╚═╝╚══════╝
`}
          </pre>
          <h1 className="text-3xl font-bold text-green-400 mb-2">FREE AI TERMINAL</h1>
          <p className="text-gray-500 mb-8">100% Free Gemini AI • Text + Vision • No Limits</p>
        </div>

        {/* Setup Card */}
        <Card className="bg-gray-900 border border-gray-700 max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-green-400 flex items-center space-x-2 justify-center font-mono">
              <Terminal className="w-5 h-5" />
              <span>FREE_AI_SETUP</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Why Free */}
            <div className="bg-green-500/10 border border-green-500/30 rounded p-4">
              <h3 className="text-green-400 font-bold mb-3 text-center flex items-center justify-center">
                <Eye className="w-4 h-4 mr-2" />
                WHY GEMINI IS PERFECT
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-green-300">✅ 100% FREE forever</p>
                  <p className="text-green-300">✅ Smart conversations</p>
                  <p className="text-green-300">✅ Coding assistance</p>
                  <p className="text-green-300">✅ Image analysis</p>
                </div>
                <div>
                  <p className="text-green-300">✅ No credit card needed</p>
                  <p className="text-green-300">✅ 15 requests/minute</p>
                  <p className="text-green-300">✅ File analysis</p>
                  <p className="text-green-300">✅ GitHub integration</p>
                </div>
              </div>
            </div>

            <Button
              onClick={() => onApiKeysSave({ configured: "true" })}
              className="w-full bg-green-900 hover:bg-green-800 text-green-400 border border-green-600 font-mono py-4 text-lg"
            >
              GET_FREE_GEMINI_API_KEY
            </Button>

            {/* Instructions */}
            <div className="bg-blue-500/10 border border-blue-500/30 rounded p-3">
              <div className="text-xs text-blue-300 font-mono space-y-2">
                <p className="font-medium">[QUICK_SETUP]</p>
                <div className="space-y-1 ml-2">
                  <p>1. Click button above</p>
                  <p>2. Get your FREE API key from Google</p>
                  <p>3. Paste it in the config</p>
                  <p>4. Start chatting immediately!</p>
                </div>
                <a
                  href="https://aistudio.google.com/app/apikey"
                  target="_blank"
                  className="inline-flex items-center space-x-1 text-green-400 hover:text-green-300"
                  rel="noreferrer"
                >
                  <span>Direct Link to API Keys</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            <div className="bg-red-900/20 border border-red-700 rounded p-3">
              <div className="flex items-start space-x-2">
                <Shield className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                <div className="text-xs text-red-300 font-mono">
                  <p className="font-medium mb-1">[SECURITY]</p>
                  <p>All API keys stored locally. Zero server transmission.</p>
                </div>
              </div>
            </div>

            {/* Capabilities */}
            <div className="bg-gray-800 border border-gray-600 rounded p-3">
              <div className="text-xs text-gray-400 font-mono space-y-2">
                <p className="font-medium text-green-400">[CAPABILITIES]</p>
                <div className="grid grid-cols-2 gap-2 ml-2">
                  <div>
                    <p>• Smart conversations</p>
                    <p>• Code analysis & debugging</p>
                    <p>• File content processing</p>
                    <p>• GitHub integration</p>
                  </div>
                  <div>
                    <p>• Image analysis & OCR</p>
                    <p>• Multi-language support</p>
                    <p>• Terminal interface</p>
                    <p>• Export conversations</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
