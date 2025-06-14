"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Mic, MicOff } from "lucide-react"

interface VoiceInputProps {
  onTranscript: (text: string) => void
  isListening: boolean
  onToggleListening: () => void
}

export function VoiceInput({ onTranscript, isListening, onToggleListening }: VoiceInputProps) {
  const [isSupported, setIsSupported] = useState(false)
  const recognitionRef = useRef<any>(null)

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition
      if (SpeechRecognition) {
        setIsSupported(true)
        recognitionRef.current = new SpeechRecognition()
        recognitionRef.current.continuous = true
        recognitionRef.current.interimResults = true
        recognitionRef.current.lang = "en-US"

        recognitionRef.current.onresult = (event: any) => {
          let finalTranscript = ""
          for (let i = event.resultIndex; i < event.results.length; i++) {
            if (event.results[i].isFinal) {
              finalTranscript += event.results[i][0].transcript
            }
          }
          if (finalTranscript) {
            onTranscript(finalTranscript)
          }
        }

        recognitionRef.current.onerror = (event: any) => {
          console.error("Speech recognition error:", event.error)
        }
      }
    }
  }, [onTranscript])

  useEffect(() => {
    if (recognitionRef.current) {
      if (isListening) {
        recognitionRef.current.start()
      } else {
        recognitionRef.current.stop()
      }
    }
  }, [isListening])

  if (!isSupported) {
    return null
  }

  return (
    <Button
      onClick={onToggleListening}
      className={`${
        isListening
          ? "bg-red-900 hover:bg-red-800 text-red-400 border-red-600 animate-pulse"
          : "bg-blue-900 hover:bg-blue-800 text-blue-400 border-blue-600"
      } border font-mono px-3`}
      size="sm"
    >
      {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
    </Button>
  )
}
