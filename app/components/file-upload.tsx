"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { X, Upload, FileText, ImageIcon, AlertTriangle } from "lucide-react"

interface FileUploadProps {
  isOpen: boolean
  onClose: () => void
  onFileContent: (fileName: string, content: string) => void
  onImageAnalysis: (imageData: string, prompt?: string) => void
  hasVisionAPI: boolean
}

export function FileUpload({ isOpen, onClose, onFileContent, onImageAnalysis, hasVisionAPI }: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false)
  const [imagePrompt, setImagePrompt] = useState("")

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
    if (file.type.startsWith("image/")) {
      if (!hasVisionAPI) {
        alert("Please configure Google Gemini API key for image analysis")
        return
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        const imageData = e.target?.result as string
        onImageAnalysis(imageData, imagePrompt || undefined)
      }
      reader.readAsDataURL(file)
    } else {
      const reader = new FileReader()
      reader.onload = (e) => {
        const content = e.target?.result as string
        onFileContent(file.name, content)
      }
      reader.readAsText(file)
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    files.forEach(handleFile)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 font-mono">
      <Card className="w-full max-w-2xl bg-gray-900 border border-green-500/30">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b border-green-500/20">
          <CardTitle className="text-green-400 flex items-center space-x-2 font-mono">
            <Upload className="w-5 h-5" />
            <span>FILE_UPLOAD_SYSTEM</span>
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose} className="text-green-400 hover:bg-green-500/20">
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-4 pt-4">
          {/* Image Analysis Prompt */}
          {hasVisionAPI && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-green-400 font-mono">IMAGE_ANALYSIS_PROMPT:</label>
              <Textarea
                value={imagePrompt}
                onChange={(e) => setImagePrompt(e.target.value)}
                placeholder="Optional: What would you like me to analyze about the image?"
                className="bg-black border border-green-500/30 text-green-400 placeholder-green-600 font-mono focus:border-green-400 resize-none"
                rows={2}
              />
            </div>
          )}

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
            <Upload className="w-12 h-12 text-green-400 mx-auto mb-4" />
            <p className="text-green-400 font-mono mb-2">DRAG & DROP FILES HERE</p>
            <p className="text-green-600 text-sm font-mono mb-4">
              Supported: .txt, .js, .py, .md, .json, .csv, .log, images
            </p>
            <Input
              type="file"
              multiple
              onChange={handleFileInput}
              className="hidden"
              id="file-input"
              accept=".txt,.js,.py,.md,.json,.csv,.log,.html,.css,.xml,.yaml,.yml,image/*"
            />
            <Button
              onClick={() => document.getElementById("file-input")?.click()}
              className="bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-500/50 font-mono"
            >
              <FileText className="w-4 h-4 mr-2" />
              SELECT_FILES
            </Button>
          </div>

          {/* Capabilities */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-green-500/10 border border-green-500/30 rounded-sm p-3">
              <div className="flex items-center space-x-2 mb-2">
                <FileText className="w-4 h-4 text-green-400" />
                <span className="text-green-400 text-sm font-mono">[FILE_ANALYSIS]</span>
              </div>
              <p className="text-green-600 text-xs font-mono">Code review, debugging, documentation analysis</p>
            </div>
            <div
              className={`border rounded-sm p-3 ${
                hasVisionAPI ? "bg-green-500/10 border-green-500/30" : "bg-red-500/10 border-red-500/30"
              }`}
            >
              <div className="flex items-center space-x-2 mb-2">
                <ImageIcon className="w-4 h-4 text-green-400" />
                <span className="text-green-400 text-sm font-mono">[IMAGE_VISION]</span>
              </div>
              <p className={`text-xs font-mono ${hasVisionAPI ? "text-green-600" : "text-red-400"}`}>
                {hasVisionAPI ? "Image description, OCR, diagram analysis" : "Requires Gemini API key"}
              </p>
            </div>
          </div>

          {!hasVisionAPI && (
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
