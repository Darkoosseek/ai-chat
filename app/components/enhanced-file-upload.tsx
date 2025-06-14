"use client"

import type React from "react"
import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { X, Upload, FileText, ImageIcon, AlertTriangle, Sparkles } from "lucide-react"

interface EnhancedFileUploadProps {
  isOpen: boolean
  onClose: () => void
  onFileContent: (fileName: string, content: string, fileType: "file" | "image", customPrompt?: string) => void
  onImageAnalysis: (imageData: string, fileName: string, customPrompt: string) => void
  hasVisionAPI: boolean
  uploadType: "files" | "images"
}

export function EnhancedFileUpload({
  isOpen,
  onClose,
  onFileContent,
  onImageAnalysis,
  hasVisionAPI,
  uploadType,
}: EnhancedFileUploadProps) {
  const [dragActive, setDragActive] = useState(false)
  const [customPrompt, setCustomPrompt] = useState("")

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
        const prompt = customPrompt || "Analyze this image and describe what you see in detail."
        onImageAnalysis(imageData, file.name, prompt)
        onClose()
      }
      reader.readAsDataURL(file)
    } else if (uploadType === "files" && !file.type.startsWith("image/")) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const content = e.target?.result as string
        const prompt = customPrompt || "Analyze this file and explain what it does."
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

  // Suggested prompts
  const suggestedPrompts = isImageUpload
    ? [
        "Analyze this image and describe what you see in detail",
        "Extract all text from this image (OCR)",
        "Explain the technical aspects of this diagram/chart",
        "What problems or issues can you identify in this image?",
        "Convert this image content into structured data",
      ]
    : [
        "Review this code and suggest improvements",
        "Explain what this file does and how it works",
        "Find bugs or security issues in this code",
        "Optimize this code for better performance",
        "Convert this code to a different programming language",
      ]

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 font-mono">
      <Card className="w-full max-w-3xl bg-gray-900 border border-green-500/30 max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b border-green-500/20">
          <CardTitle className="text-green-400 flex items-center space-x-2 font-mono">
            {isImageUpload ? <ImageIcon className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
            <span>{isImageUpload ? "IMAGE_ANALYSIS_SYSTEM" : "FILE_ANALYSIS_SYSTEM"}</span>
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose} className="text-green-400 hover:bg-green-500/20">
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-4 pt-4">
          {/* Custom Prompt Section */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-green-400" />
              <label className="text-sm font-medium text-green-400 font-mono">
                CUSTOM_ANALYSIS_PROMPT (Tell DeepSeek what to do):
              </label>
            </div>
            <Textarea
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder={
                isImageUpload
                  ? "e.g., 'Extract all text from this image' or 'Analyze the technical diagram'"
                  : "e.g., 'Review this code for bugs' or 'Explain how this algorithm works'"
              }
              className="bg-black border border-green-500/30 text-green-400 placeholder-green-600 font-mono focus:border-green-400 resize-none"
              rows={3}
            />

            {/* Suggested Prompts */}
            <div className="space-y-2">
              <p className="text-xs text-green-600 font-mono">QUICK_PROMPTS:</p>
              <div className="grid grid-cols-1 gap-2">
                {suggestedPrompts.map((prompt, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    size="sm"
                    onClick={() => setCustomPrompt(prompt)}
                    className="text-left justify-start text-green-600 hover:text-green-400 hover:bg-green-500/10 font-mono text-xs h-auto py-2 px-3"
                  >
                    {">"} {prompt}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Drop Zone */}
          <div
            className={`border-2 border-dashed rounded-sm p-8 text-center transition-colors ${
              dragActive ? "border-green-400 bg-green-500/10" : "border-green-500/30 bg-gray-800/50"
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            {isImageUpload ? (
              <ImageIcon className="w-12 h-12 text-green-400 mx-auto mb-4" />
            ) : (
              <Upload className="w-12 h-12 text-green-400 mx-auto mb-4" />
            )}
            <p className="text-green-400 font-mono mb-2">
              {isImageUpload ? "DRAG & DROP IMAGES HERE" : "DRAG & DROP FILES HERE"}
            </p>
            <p className="text-green-600 text-sm font-mono mb-4">
              {isImageUpload
                ? "Supported: .jpg, .jpeg, .png, .gif, .webp"
                : "Supported: .txt, .js, .py, .md, .json, .csv, .log, .html, .css"}
            </p>
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
              className="bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-500/50 font-mono"
            >
              {isImageUpload ? <ImageIcon className="w-4 h-4 mr-2" /> : <FileText className="w-4 h-4 mr-2" />}
              {isImageUpload ? "SELECT_IMAGES" : "SELECT_FILES"}
            </Button>
          </div>

          {/* Process Flow */}
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-sm p-3">
            <div className="text-xs text-blue-300 font-mono space-y-2">
              <p className="font-medium">[ANALYSIS_WORKFLOW]</p>
              <div className="space-y-1 ml-2">
                <p>1. {isImageUpload ? "Gemini analyzes image" : "System reads file content"}</p>
                <p>2. Analysis sent to DeepSeek with your custom prompt</p>
                <p>3. DeepSeek provides intelligent response</p>
                <p>4. Continue conversation with DeepSeek</p>
              </div>
            </div>
          </div>

          {/* Vision Warning */}
          {isImageUpload && !hasVisionAPI && (
            <div className="bg-orange-500/10 border border-orange-500/30 rounded-sm p-3">
              <div className="flex items-start space-x-2">
                <AlertTriangle className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
                <div className="text-xs text-orange-300 font-mono">
                  <p className="font-medium mb-1">[VISION_DISABLED]</p>
                  <p>Configure Google Gemini API key to enable image analysis</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
