"use client"

import type React from "react"
import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { X, Upload, FileText, ImageIcon, AlertTriangle, Terminal, Eye } from "lucide-react"

interface HackerFileUploadProps {
  isOpen: boolean
  onClose: () => void
  onFileContent: (fileName: string, content: string, fileType: "file" | "image", customPrompt?: string) => void
  onImageAnalysis: (imageData: string, fileName: string, customPrompt: string) => void
  hasVisionAPI: boolean
  uploadType: "files" | "images"
}

export function HackerFileUpload({
  isOpen,
  onClose,
  onFileContent,
  onImageAnalysis,
  hasVisionAPI,
  uploadType,
}: HackerFileUploadProps) {
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
        alert("Gemini API key required for image analysis")
        return
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        const imageData = e.target?.result as string
        const prompt = customPrompt || "Analyze this image and describe what you see."
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

  const quickPrompts = isImageUpload
    ? [
        "Analyze this image and describe everything you see",
        "Extract all text from this image (OCR)",
        "Explain this diagram or chart",
        "Identify any issues or problems in this image",
      ]
    : [
        "Review this code for bugs and improvements",
        "Explain how this code works",
        "Optimize this code for better performance",
        "Convert this to a different programming language",
      ]

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 font-mono">
      <Card className="w-full max-w-3xl bg-gray-900 border border-gray-700 max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b border-gray-700">
          <CardTitle className="text-green-400 flex items-center space-x-2 font-mono">
            {isImageUpload ? <Eye className="w-5 h-5" /> : <Terminal className="w-5 h-5" />}
            <span>{isImageUpload ? "IMAGE_ANALYSIS" : "FILE_ANALYSIS"}</span>
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
        <CardContent className="space-y-4 pt-4">
          {/* Custom Prompt */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-green-400 font-mono">CUSTOM_PROMPT:</label>
            <Textarea
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder={
                isImageUpload ? "Tell AI what to analyze about the image..." : "Tell AI what to do with the file..."
              }
              className="bg-black border border-gray-600 text-gray-200 placeholder-gray-500 font-mono focus:border-green-500 resize-none"
              rows={3}
            />

            {/* Quick Prompts */}
            <div className="space-y-2">
              <p className="text-xs text-gray-500 font-mono">QUICK_PROMPTS:</p>
              <div className="grid grid-cols-1 gap-1">
                {quickPrompts.map((prompt, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    size="sm"
                    onClick={() => setCustomPrompt(prompt)}
                    className="text-left justify-start text-gray-400 hover:text-gray-200 hover:bg-gray-800 font-mono text-xs h-auto py-2 px-3"
                  >
                    <span className="text-green-500 mr-2">&gt;</span>
                    {prompt}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Drop Zone */}
          <div
            className={`border-2 border-dashed rounded p-8 text-center transition-colors ${
              dragActive ? "border-green-500 bg-green-500/10" : "border-gray-600 bg-gray-800/50"
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            {isImageUpload ? (
              <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            ) : (
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            )}
            <p className="text-gray-300 font-mono mb-2">{isImageUpload ? "DROP IMAGES HERE" : "DROP FILES HERE"}</p>
            <p className="text-gray-500 text-sm font-mono mb-4">
              {isImageUpload ? "Supported: JPG, PNG, GIF, WEBP" : "Supported: TXT, JS, PY, MD, JSON, CSV, HTML, CSS"}
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
              className="bg-gray-800 hover:bg-gray-700 text-green-400 border border-gray-600 font-mono"
            >
              {isImageUpload ? <ImageIcon className="w-4 h-4 mr-2" /> : <FileText className="w-4 h-4 mr-2" />}
              {isImageUpload ? "SELECT_IMAGES" : "SELECT_FILES"}
            </Button>
          </div>

          {/* Process Info */}
          <div className="bg-gray-800 border border-gray-600 rounded p-3">
            <div className="text-xs text-gray-400 font-mono space-y-2">
              <p className="font-medium text-green-400">[PROCESS_FLOW]</p>
              <div className="space-y-1 ml-2">
                <p>1. {isImageUpload ? "Gemini analyzes image" : "System reads file"}</p>
                <p>2. Analysis sent to DeepSeek with custom prompt</p>
                <p>3. DeepSeek provides intelligent response</p>
              </div>
            </div>
          </div>

          {/* Vision Warning */}
          {isImageUpload && !hasVisionAPI && (
            <div className="bg-red-900/20 border border-red-700 rounded p-3">
              <div className="flex items-start space-x-2">
                <AlertTriangle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                <div className="text-xs text-red-300 font-mono">
                  <p className="font-medium mb-1">[VISION_OFFLINE]</p>
                  <p>Configure Gemini API key to enable image analysis</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
