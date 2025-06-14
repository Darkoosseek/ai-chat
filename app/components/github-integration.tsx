"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { X, Github, Folder, FileText, AlertCircle, Sparkles } from "lucide-react"

interface GitHubIntegrationProps {
  isOpen: boolean
  onClose: () => void
  onContent: (content: string) => void
}

interface GitHubFile {
  name: string
  path: string
  type: string
  download_url?: string
}

export function GitHubIntegration({ isOpen, onClose, onContent }: GitHubIntegrationProps) {
  const [owner, setOwner] = useState("")
  const [repo, setRepo] = useState("")
  const [token, setToken] = useState("")
  const [files, setFiles] = useState<GitHubFile[]>([])
  const [currentPath, setCurrentPath] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [customPrompt, setCustomPrompt] = useState("")

  const fetchRepoContents = async (path = "") => {
    if (!owner || !repo) return

    setLoading(true)
    setError("")

    try {
      const response = await fetch("/api/github", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ owner, repo, path, token }),
      })

      if (!response.ok) {
        throw new Error("Failed to fetch repository contents")
      }

      const data = await response.json()
      setFiles(Array.isArray(data) ? data : [])
      setCurrentPath(path)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error")
    } finally {
      setLoading(false)
    }
  }

  const handleFileClick = async (file: GitHubFile) => {
    if (file.type === "dir") {
      fetchRepoContents(file.path)
    } else if (file.download_url) {
      try {
        const response = await fetch(file.download_url)
        const content = await response.text()

        const prompt = customPrompt || "Analyze this code file and explain what it does."

        const message = `${prompt}

GitHub Repository: ${owner}/${repo}
File: ${file.path}

\`\`\`
${content}
\`\`\``

        onContent(message)
      } catch (err) {
        setError("Failed to fetch file content")
      }
    }
  }

  const goBack = () => {
    const pathParts = currentPath.split("/")
    pathParts.pop()
    const parentPath = pathParts.join("/")
    fetchRepoContents(parentPath)
  }

  if (!isOpen) return null

  const suggestedPrompts = [
    "Review this code for bugs and security issues",
    "Explain how this code works and its purpose",
    "Suggest improvements and optimizations",
    "Convert this code to a different programming language",
    "Generate documentation for this code",
  ]

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 font-mono">
      <Card className="w-full max-w-5xl bg-gray-900 border border-green-500/30 max-h-[90vh] overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b border-green-500/20">
          <CardTitle className="text-green-400 flex items-center space-x-2 font-mono">
            <Github className="w-5 h-5" />
            <span>GITHUB_REPOSITORY_ACCESS</span>
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose} className="text-green-400 hover:bg-green-500/20">
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-4 pt-4 overflow-y-auto max-h-[calc(90vh-120px)]">
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
              placeholder="e.g., 'Review this code for bugs' or 'Explain the architecture'"
              className="bg-black border border-green-500/30 text-green-400 placeholder-green-600 font-mono focus:border-green-400 resize-none"
              rows={2}
            />

            {/* Suggested Prompts */}
            <div className="space-y-2">
              <p className="text-xs text-green-600 font-mono">QUICK_PROMPTS:</p>
              <div className="grid grid-cols-1 gap-1">
                {suggestedPrompts.map((prompt, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    size="sm"
                    onClick={() => setCustomPrompt(prompt)}
                    className="text-left justify-start text-green-600 hover:text-green-400 hover:bg-green-500/10 font-mono text-xs h-auto py-1 px-2"
                  >
                    {">"} {prompt}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Repository Input */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-green-400 font-mono">REPO_OWNER:</label>
              <Input
                value={owner}
                onChange={(e) => setOwner(e.target.value)}
                placeholder="username or organization"
                className="bg-black border border-green-500/30 text-green-400 placeholder-green-600 font-mono focus:border-green-400"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-green-400 font-mono">REPO_NAME:</label>
              <Input
                value={repo}
                onChange={(e) => setRepo(e.target.value)}
                placeholder="repository name"
                className="bg-black border border-green-500/30 text-green-400 placeholder-green-600 font-mono focus:border-green-400"
              />
            </div>
          </div>

          {/* Optional Token */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-green-400 font-mono">
              GITHUB_TOKEN (optional for private repos):
            </label>
            <Input
              type="password"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="ghp_xxxxxxxxxxxx (optional)"
              className="bg-black border border-green-500/30 text-green-400 placeholder-green-600 font-mono focus:border-green-400"
            />
          </div>

          <Button
            onClick={() => fetchRepoContents()}
            disabled={!owner || !repo || loading}
            className="w-full bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-500/50 font-mono"
          >
            {loading ? "SCANNING_REPOSITORY..." : "ACCESS_REPOSITORY"}
          </Button>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-sm p-3">
              <div className="flex items-start space-x-2">
                <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                <div className="text-xs text-red-300 font-mono">
                  <p className="font-medium mb-1">[ERROR]</p>
                  <p>{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* File Browser */}
          {files.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-green-400 font-mono text-sm">
                  REPOSITORY_CONTENTS: {owner}/{repo}/{currentPath}
                </h3>
                {currentPath && (
                  <Button
                    onClick={goBack}
                    size="sm"
                    className="bg-gray-800 hover:bg-gray-700 text-green-400 border border-green-500/30 font-mono"
                  >
                    ../
                  </Button>
                )}
              </div>

              <div className="bg-gray-800/50 border border-green-500/30 rounded-sm max-h-96 overflow-y-auto">
                {files.map((file, index) => (
                  <div
                    key={index}
                    onClick={() => handleFileClick(file)}
                    className="flex items-center space-x-2 p-2 hover:bg-green-500/10 cursor-pointer border-b border-green-500/10 last:border-b-0"
                  >
                    {file.type === "dir" ? (
                      <Folder className="w-4 h-4 text-green-400" />
                    ) : (
                      <FileText className="w-4 h-4 text-green-400" />
                    )}
                    <span className="text-green-300 font-mono text-sm">{file.name}</span>
                    {file.type === "dir" && <span className="text-green-600 text-xs">/</span>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Process Flow */}
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-sm p-3">
            <div className="text-xs text-blue-300 font-mono space-y-2">
              <p className="font-medium">[ANALYSIS_WORKFLOW]</p>
              <div className="space-y-1 ml-2">
                <p>1. Select file from GitHub repository</p>
                <p>2. File content sent to DeepSeek with your custom prompt</p>
                <p>3. DeepSeek analyzes and provides intelligent response</p>
                <p>4. Continue conversation with DeepSeek</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
