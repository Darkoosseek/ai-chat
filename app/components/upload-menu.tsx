"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { FileText, ImageIcon, Palette } from "lucide-react"

interface UploadMenuProps {
  isOpen: boolean
  onClose: () => void
  onFileUpload: () => void
  onImageUpload: () => void
  onImageGeneration: () => void
}

export function UploadMenu({ isOpen, onClose, onFileUpload, onImageUpload, onImageGeneration }: UploadMenuProps) {
  if (!isOpen) return null

  return (
    <div className="absolute bottom-16 left-0 z-50">
      <Card className="bg-gray-900 border border-green-500/30 shadow-lg">
        <CardContent className="p-2">
          <div className="flex flex-col space-y-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                onFileUpload()
                onClose()
              }}
              className="text-green-400 hover:bg-green-500/20 justify-start font-mono text-xs"
            >
              <FileText className="w-4 h-4 mr-2" />
              Upload Files
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                onImageUpload()
                onClose()
              }}
              className="text-blue-400 hover:bg-blue-500/20 justify-start font-mono text-xs"
            >
              <ImageIcon className="w-4 h-4 mr-2" />
              Upload Images
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                onImageGeneration()
                onClose()
              }}
              className="text-purple-400 hover:bg-purple-500/20 justify-start font-mono text-xs"
            >
              <Palette className="w-4 h-4 mr-2" />
              Generate Image 🆓
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
