"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Zap, Brain, Eye, Sparkles } from "lucide-react"

interface AIModelSwitcherProps {
  currentModel: string
  onModelChange: (model: string) => void
  isOpen: boolean
  onClose: () => void
}

export function AIModelSwitcher({ currentModel, onModelChange, isOpen, onClose }: AIModelSwitcherProps) {
  const models = [
    {
      id: "gemini-1.5-flash",
      name: "Gemini Flash",
      icon: <Zap className="w-4 h-4" />,
      description: "Fast responses, great for chat",
      color: "text-yellow-400",
      bgColor: "bg-yellow-500/10 border-yellow-500/30",
    },
    {
      id: "gemini-1.5-pro",
      name: "Gemini Pro",
      icon: <Brain className="w-4 h-4" />,
      description: "Advanced reasoning, complex tasks",
      color: "text-purple-400",
      bgColor: "bg-purple-500/10 border-purple-500/30",
    },
    {
      id: "gemini-pro-vision",
      name: "Gemini Vision",
      icon: <Eye className="w-4 h-4" />,
      description: "Image analysis and understanding",
      color: "text-blue-400",
      bgColor: "bg-blue-500/10 border-blue-500/30",
    },
  ]

  if (!isOpen) return null

  return (
    <div className="absolute bottom-16 left-0 z-50">
      <Card className="bg-gray-900 border border-gray-700 shadow-lg">
        <CardContent className="p-3">
          <div className="space-y-2">
            <div className="flex items-center space-x-2 mb-3">
              <Sparkles className="w-4 h-4 text-green-400" />
              <span className="text-green-400 font-mono text-xs">AI_MODELS</span>
            </div>
            {models.map((model) => (
              <Button
                key={model.id}
                variant="ghost"
                size="sm"
                onClick={() => {
                  onModelChange(model.id)
                  onClose()
                }}
                className={`w-full justify-start font-mono text-xs h-auto py-3 px-3 ${
                  currentModel === model.id
                    ? `${model.bgColor} ${model.color}`
                    : "text-gray-400 hover:text-gray-200 hover:bg-gray-800"
                }`}
              >
                <div className="flex items-center space-x-3 w-full">
                  <div className={model.color}>{model.icon}</div>
                  <div className="text-left flex-1">
                    <div className="font-medium">{model.name}</div>
                    <div className="text-xs opacity-70">{model.description}</div>
                  </div>
                  {currentModel === model.id && <div className="w-2 h-2 bg-green-400 rounded-full"></div>}
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
