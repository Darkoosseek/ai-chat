import { streamText } from "ai"
import { createOpenAI } from "@ai-sdk/openai"

export const maxDuration = 30

// Enhanced Gemini API call with proper role mapping
async function callGeminiAPI(apiKey: string, messages: any[], model: string) {
  try {
    const geminiMessages = messages.map((msg) => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }],
    }))

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: geminiMessages,
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 8192,
          },
        }),
      },
    )

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error("Gemini API Error:", errorData)
      throw new Error(`HTTP ${response.status}: ${errorData.error?.message || response.statusText}`)
    }

    const data = await response.json()

    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
      throw new Error("Invalid response format from Gemini API")
    }

    return data.candidates[0].content.parts[0].text
  } catch (error) {
    console.error("Gemini API call failed:", error)
    throw error
  }
}

export async function POST(req: Request) {
  try {
    const { messages, apiKey, provider = "openrouter", model } = await req.json()

    console.log("API Request:", { provider, model, hasApiKey: !!apiKey, messageCount: messages.length })

    if (!apiKey) {
      return new Response("API key is required", { status: 400 })
    }

    if (provider === "gemini") {
      try {
        const modelName = model || "gemini-1.5-flash"
        const result = await callGeminiAPI(apiKey, messages, modelName)
        return new Response(result, {
          headers: { "Content-Type": "text/plain" },
        })
      } catch (error) {
        console.error("Gemini direct API error:", error)
        return new Response(`Gemini error: ${error.message}`, { status: 500 })
      }
    }

    // OpenRouter (DeepSeek)
    const openrouter = createOpenAI({
      baseURL: "https://openrouter.ai/api/v1",
      apiKey: apiKey,
    })

    const aiModel = openrouter(model || "deepseek/deepseek-r1")

    console.log("Calling OpenRouter with:", { provider, model })

    const result = streamText({
      model: aiModel,
      messages,
      temperature: 0.7,
      maxTokens: 8192,
    })

    return result.toDataStreamResponse()
  } catch (error) {
    console.error("Chat API error:", error)
    return new Response(`Internal server error: ${error.message}`, { status: 500 })
  }
}
