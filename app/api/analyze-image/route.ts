// Direct Gemini API call for image analysis
async function callGeminiVisionAPI(apiKey: string, imageData: string, prompt: string) {
  try {
    // Convert base64 image data to proper format
    const base64Data = imageData.split(",")[1] // Remove data:image/jpeg;base64, prefix

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [
                { text: prompt },
                {
                  inline_data: {
                    mime_type: "image/jpeg",
                    data: base64Data,
                  },
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 4096,
          },
        }),
      },
    )

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error("Gemini Vision API Error:", errorData)
      throw new Error(`HTTP ${response.status}: ${errorData.error?.message || response.statusText}`)
    }

    const data = await response.json()

    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
      throw new Error("Invalid response format from Gemini Vision API")
    }

    return data.candidates[0].content.parts[0].text
  } catch (error) {
    console.error("Gemini Vision API call failed:", error)
    throw error
  }
}

export async function POST(req: Request) {
  try {
    const { imageData, prompt, apiKey } = await req.json()

    if (!apiKey) {
      return new Response("API key is required", { status: 400 })
    }

    if (!imageData) {
      return new Response("Image data is required", { status: 400 })
    }

    console.log("Image analysis request:", { hasApiKey: !!apiKey, hasImageData: !!imageData })

    const description = await callGeminiVisionAPI(
      apiKey,
      imageData,
      prompt || "Describe this image in detail and explain what you see.",
    )

    return Response.json({
      description,
      isImageAnalysis: true, // Flag to identify this as image analysis
    })
  } catch (error) {
    console.error("Image analysis error:", error)
    return new Response(`Image analysis failed: ${error.message}`, { status: 500 })
  }
}
