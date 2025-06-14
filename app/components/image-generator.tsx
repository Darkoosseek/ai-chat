"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { X, Palette, Sparkles, Wand2, Zap } from "lucide-react"

interface ImageGeneratorProps {
  isOpen: boolean
  onClose: () => void
  onGenerate: (prompt: string) => void
}

export function ImageGenerator({ isOpen, onClose, onGenerate }: ImageGeneratorProps) {
  const [prompt, setPrompt] = useState("")
  const [selectedStyle, setSelectedStyle] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)

  if (!isOpen) return null

  const imageStyles = [
    "Photorealistic",
    "Digital Art",
    "Oil Painting",
    "Watercolor",
    "Anime/Manga",
    "Pixel Art",
    "Cyberpunk",
    "Fantasy Art",
    "Minimalist",
    "Abstract",
    "Cartoon",
    "3D Render",
  ]

  const quickPrompts = [
    "A futuristic city with flying cars at sunset",
    "A magical forest with glowing mushrooms and fairy lights",
    "A cyberpunk hacker in a neon-lit room with multiple screens",
    "A cute robot reading a book in a cozy library",
    "A majestic dragon flying over a medieval castle",
    "A space station orbiting a colorful nebula",
    "A cozy coffee shop on a rainy day with warm lighting",
    "A steampunk airship floating through the clouds",
    "A serene mountain lake with crystal clear water",
    "A bustling alien marketplace on another planet",
  ]

  const handleGenerate = async () => {
    if (prompt.trim() && !isGenerating) {
      setIsGenerating(true)
      const fullPrompt = selectedStyle ? `${prompt}, ${selectedStyle} style` : prompt
      await onGenerate(fullPrompt)
      setIsGenerating(false)
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 font-mono">
      <Card className="w-full max-w-4xl bg-gray-900 border border-gray-700 max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b border-gray-700">
          <CardTitle className="text-purple-400 flex items-center space-x-2 font-mono">
            <Palette className="w-5 h-5" />
            <span>FREE AI IMAGE GENERATOR</span>
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
        <CardContent className="space-y-6 pt-4">
          {/* Free Notice */}
          <div className="bg-green-500/10 border border-green-500/30 rounded p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Sparkles className="w-4 h-4 text-green-400" />
              <span className="text-green-400 font-bold">100% FREE IMAGE GENERATION</span>
            </div>
            <p className="text-green-300 text-sm">
              Powered by Pollinations AI - Generate unlimited high-quality images, completely free, no API key needed!
            </p>
          </div>

          {/* Prompt Input */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-purple-400 font-mono">IMAGE_PROMPT:</label>
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe the image you want to generate in detail..."
              className="bg-black border border-gray-600 text-gray-200 placeholder-gray-500 font-mono focus:border-purple-400 resize-none"
              rows={4}
            />
          </div>

          {/* Style Selection */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-purple-400 font-mono">ART_STYLE (optional):</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {imageStyles.map((style) => (
                <Button
                  key={style}
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedStyle(selectedStyle === style ? "" : style)}
                  className={`font-mono text-xs h-auto py-2 px-3 ${
                    selectedStyle === style
                      ? "bg-purple-500/20 text-purple-300 border border-purple-500/50"
                      : "text-gray-400 hover:text-gray-200 hover:bg-gray-800 border border-transparent"
                  }`}
                >
                  {style}
                </Button>
              ))}
            </div>
          </div>

          {/* Quick Prompts */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-purple-400 font-mono">QUICK_PROMPTS:</label>
            <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto">
              {quickPrompts.map((quickPrompt, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  size="sm"
                  onClick={() => setPrompt(quickPrompt)}
                  className="text-left justify-start text-gray-400 hover:text-gray-200 hover:bg-gray-800 font-mono text-xs h-auto py-2 px-3"
                >
                  <span className="text-purple-500 mr-2">▶</span>
                  {quickPrompt}
                </Button>
              ))}
            </div>
          </div>

          {/* Generate Button */}
          <Button
            onClick={handleGenerate}
            disabled={!prompt.trim() || isGenerating}
            className="w-full bg-purple-900 hover:bg-purple-800 text-purple-400 border border-purple-600 font-mono py-3 text-lg"
          >
            <Wand2 className={`w-5 h-5 mr-2 ${isGenerating ? "animate-spin" : ""}`} />
            {isGenerating ? "GENERATING_IMAGE..." : "GENERATE_FREE_IMAGE"}
          </Button>

          {/* Info */}
          <div className="bg-blue-500/10 border border-blue-500/30 rounded p-3">
            <div className="text-xs text-blue-300 font-mono space-y-2">
              <p className="font-medium flex items-center">
                <Zap className="w-3 h-3 mr-1" />
                [POLLINATIONS_AI_INFO]
              </p>
              <div className="space-y-1 ml-2">
                <p>• Completely free with no registration</p>
                <p>• High-quality 1024x1024 images</p>
                <p>• Multiple art styles supported</p>
                <p>• Instant generation (no waiting)</p>
                <p>• Generated images are yours to keep</p>
                <p>• No daily limits or restrictions</p>
              </div>
            </div>
          </div>

          {/* Tips */}
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded p-3">
            <div className="text-xs text-yellow-300 font-mono space-y-2">
              <p className="font-medium">[GENERATION_TIPS]</p>
              <div className="space-y-1 ml-2">
                <p>• Be specific: "red sports car" vs "car"</p>
                <p>• Add details: lighting, mood, colors</p>
                <p>• Combine styles: "cyberpunk anime girl"</p>
                <p>• Use descriptive adjectives</p>
                <p>• Mention camera angles if needed</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
