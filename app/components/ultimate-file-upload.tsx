"use client"

import type React from "react"
import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { X, Upload, FileText, ImageIcon, AlertTriangle, Sparkles, Zap, Brain, Eye } from "lucide-react"

interface UltimateFileUploadProps {
  isOpen: boolean
  onClose: () => void
  onFileContent: (fileName: string, content: string, fileType: "file" | "image", customPrompt?: string) => void
  onImageAnalysis: (imageData: string, fileName: string, customPrompt: string) => void
  hasVisionAPI: boolean
  uploadType: "files" | "images"
}

export function UltimateFileUpload({
  isOpen,
  onClose,
  onFileContent,
  onImageAnalysis,
  hasVisionAPI,
  uploadType,
}: UltimateFileUploadProps) {
  const [dragActive, setDragActive] = useState(false)
  const [customPrompt, setCustomPrompt] = useState("")
  const [selectedPromptIndex, setSelectedPromptIndex] = useState(-1)

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const files = Array.from(e.dataTransfer.files)
    files.forEach(handleFile)
  }, [])

  const handleFile = (file: File) => {
    if (uploadType === "images" && file.type.startsWith("image/")) {
      if (!hasVisionAPI) {
        alert("Please configure Google Gemini API key for image analysis")
        return
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        const imageData = e.target?.result as string
        const prompt = customPrompt || "Analyze this image in detail and explain everything you can see."
        onImageAnalysis(imageData, file.name, prompt)
        onClose()
      }
      reader.readAsDataURL(file)
    } else if (uploadType === "files" && !file.type.startsWith("image/")) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const content = e.target?.result as string
        const prompt = customPrompt || "Analyze this file and provide detailed insights."
        onFileContent(file.name, content, "file", prompt)
        onClose()
      }
      reader.readAsText(file)
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    files.forEach(handleFile)
  }

  if (!isOpen) return null

  const isImageUpload = uploadType === "images"

  // Enhanced suggested prompts with categories
  const promptCategories = isImageUpload
    ? {
        "🔍 Analysis": [
          "Analyze this image in detail and explain everything you can see",
          "Identify all objects, people, and text in this image",
          "Describe the composition, colors, and visual elements",
        ],
        "📝 OCR & Text": [
          "Extract all text from this image using OCR",
          "Read and transcribe any handwritten or printed text",
          "Convert this document/screenshot into editable text",
        ],
        "🔧 Technical": [
          "Analyze this technical diagram or chart",
          "Explain the architecture or workflow shown",
          "Identify any issues or improvements in this design",
        ],
        "🎨 Creative": [
          "Describe the artistic style and techniques used",
          "Suggest improvements for this design or layout",
          "Create a detailed description for accessibility",
        ],
      }
    : {
        "🐛 Code Review": [
          "Review this code for bugs, security issues, and improvements",
          "Analyze the code quality and suggest optimizations",
          "Explain potential vulnerabilities and how to fix them",
        ],
        "📚 Documentation": [
          "Generate comprehensive documentation for this code",
          "Explain how this code works step by step",
          "Create API documentation with examples",
        ],
        "🔄 Conversion": [
          "Convert this code to a different programming language",
          "Refactor this code using modern best practices",
          "Optimize this code for better performance",
        ],
        "🧠 Analysis": [
          "Analyze the algorithm complexity and efficiency",
          "Explain the design patterns used in this code",
          "Suggest architectural improvements",
        ],
      }

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4 font-mono">
      <Card className="w-full max-w-4xl bg-gradient-to-br from-gray-900/95 to-black/95 border-2 border-purple-500/30 max-h-[95vh] overflow-y-auto shadow-2xl shadow-purple-500/20 backdrop-blur-md">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6 border-b-2 border-purple-500/20">
          <CardTitle className="text-purple-400 flex items-center space-x-3 font-mono text-lg">
            {isImageUpload ? (
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <Eye className="w-6 h-6" />
              </div>
            ) : (
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <Brain className="w-6 h-6" />
              </div>
            )}
            <span className="tracking-wider">
              {isImageUpload ? "ULTIMATE IMAGE ANALYSIS" : "ULTIMATE FILE ANALYSIS"}
            </span>
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose} className="text-purple-400 hover:bg-purple-500/20 p-2">
            <X className="w-5 h-5" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          {/* Custom Prompt Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <Sparkles className="w-5 h-5 text-green-400" />
              </div>
              <label className="text-lg font-medium text-green-400 font-mono tracking-wider">CUSTOM AI PROMPT</label>
            </div>
            <Textarea
              value={customPrompt}
              onChange={(e) => {
                setCustomPrompt(e.target.value)
                setSelectedPromptIndex(-1)
              }}
              placeholder={
                isImageUpload
                  ? "Tell the AI exactly what you want to know about this image..."
                  : "Tell the AI exactly what you want to know about this file..."
              }
              className="bg-black/50 border-2 border-green-500/30 text-green-400 placeholder-green-600/70 font-mono focus:border-green-400 resize-none text-base leading-relaxed"
              rows={4}
            />

            {/* Enhanced Suggested Prompts */}
            <div className="space-y-4">
              <p className="text-sm text-purple-400 font-mono tracking-wider flex items-center space-x-2">
                <Zap className="w-4 h-4" />
                <span>INTELLIGENT PROMPT SUGGESTIONS</span>
              </p>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {Object.entries(promptCategories).map(([category, prompts]) => (
                  <div key={category} className="space-y-2">
                    <h4 className="text-xs text-cyan-400 font-bold tracking-wider border-b border-cyan-500/30 pb-1">
                      {category}
                    </h4>
                    <div className="space-y-1">
                      {prompts.map((prompt, index) => {
                        const globalIndex = Object.values(promptCategories).flat().indexOf(prompt)
                        return (
                          <Button
                            key={index}
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setCustomPrompt(prompt)
                              setSelectedPromptIndex(globalIndex)
                            }}
                            className={`text-left justify-start font-mono text-xs h-auto py-3 px-4 w-full transition-all duration-200 ${
                              selectedPromptIndex === globalIndex
                                ? "bg-purple-500/20 text-purple-300 border border-purple-500/50"
                                : "text-purple-600 hover:text-purple-400 hover:bg-purple-500/10 border border-transparent"
                            }`}
                          >
                            <span className="text-purple-500 mr-2">▶</span>
                            {prompt}
                          </Button>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Enhanced Drop Zone */}
          <div
            className={`border-3 border-dashed rounded-xl p-12 text-center transition-all duration-300 ${
              dragActive
                ? "border-purple-400 bg-purple-500/20 scale-105 shadow-lg shadow-purple-500/20"
                : "border-purple-500/40 bg-gradient-to-br from-gray-800/30 to-gray-900/30 hover:border-purple-400/60"
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <div className="space-y-6">
              {isImageUpload ? (
                <div className="p-4 bg-purple-500/20 rounded-full w-24 h-24 mx-auto flex items-center justify-center">
                  <ImageIcon className="w-12 h-12 text-purple-400" />
                </div>
              ) : (
                <div className="p-4 bg-blue-500/20 rounded-full w-24 h-24 mx-auto flex items-center justify-center">
                  <Upload className="w-12 h-12 text-blue-400" />
                </div>
              )}
              <div>
                <p className="text-purple-400 font-mono text-xl mb-2 tracking-wider">
                  {isImageUpload ? "DROP IMAGES HERE" : "DROP FILES HERE"}
                </p>
                <p className="text-purple-600 text-sm font-mono mb-6">
                  {isImageUpload
                    ? "Supported: JPG, PNG, GIF, WEBP, SVG"
                    : "Supported: TXT, JS, PY, MD, JSON, CSV, HTML, CSS, XML"}
                </p>
              </div>
              <Input
                type="file"
                multiple
                onChange={handleFileInput}
                className="hidden"
                id="file-input"
                accept={isImageUpload ? "image/*" : ".txt,.js,.py,.md,.json,.csv,.log,.html,.css,.xml,.yaml,.yml"}
              />
              <Button
                onClick={() => document.getElementById("file-input")?.click()}
                className="bg-gradient-to-r from-purple-500/30 to-blue-500/30 hover:from-purple-500/40 hover:to-blue-500/40 text-purple-300 border-2 border-purple-500/50 font-mono text-lg px-8 py-4 rounded-xl shadow-lg shadow-purple-500/20 transition-all duration-200 hover:scale-105"
              >
                {isImageUpload ? <ImageIcon className="w-5 h-5 mr-3" /> : <FileText className="w-5 h-5 mr-3" />}
                {isImageUpload ? "SELECT IMAGES" : "SELECT FILES"}
              </Button>
            </div>
          </div>

          {/* Enhanced Process Flow */}
          <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-2 border-blue-500/30 rounded-xl p-6">
            <div className="text-sm text-blue-300 font-mono space-y-3">
              <p className="font-bold text-lg flex items-center space-x-2">
                <Zap className="w-5 h-5" />
                <span>ULTIMATE AI WORKFLOW</span>
              </p>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
                <div className="text-center space-y-2">
                  <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
                    <span className="text-green-400 font-bold">1</span>
                  </div>
                  <p className="text-xs">{isImageUpload ? "Gemini Vision Analysis" : "File Content Processing"}</p>
                </div>
                <div className="text-center space-y-2">
                  <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto">
                    <span className="text-purple-400 font-bold">2</span>
                  </div>
                  <p className="text-xs">Custom Prompt Integration</p>
                </div>
                <div className="text-center space-y-2">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto">
                    <span className="text-blue-400 font-bold">3</span>
                  </div>
                  <p className="text-xs">DeepSeek AI Processing</p>
                </div>
                <div className="text-center space-y-2">
                  <div className="w-12 h-12 bg-cyan-500/20 rounded-full flex items-center justify-center mx-auto">
                    <span className="text-cyan-400 font-bold">4</span>
                  </div>
                  <p className="text-xs">Intelligent Response</p>
                </div>
              </div>
            </div>
          </div>

          {/* Vision Warning */}
          {isImageUpload && !hasVisionAPI && (
            <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border-2 border-orange-500/30 rounded-xl p-4">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-6 h-6 text-orange-400 mt-1 flex-shrink-0" />
                <div className="text-sm text-orange-300 font-mono">
                  <p className="font-bold mb-2 text-base">VISION SYSTEM OFFLINE</p>
                  <p>Configure Google Gemini API key to enable advanced image analysis capabilities.</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
