export async function POST(req: Request) {
  try {
    const { apiKey } = await req.json()

    if (!apiKey) {
      return new Response("API key is required", { status: 400 })
    }

    // Test with different model names
    const modelsToTest = ["gemini-1.5-flash", "gemini-1.5-pro", "gemini-pro"]

    for (const model of modelsToTest) {
      try {
        console.log(`Testing model: ${model}`)

        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              contents: [
                {
                  role: "user", // Fixed: use proper role
                  parts: [{ text: "Hello, this is a test message. Please respond with 'API working!'" }],
                },
              ],
            }),
          },
        )

        if (response.ok) {
          const data = await response.json()
          return Response.json({
            success: true,
            model: model,
            response: data.candidates[0].content.parts[0].text,
            message: `✅ Working with model: ${model}`,
          })
        } else {
          const errorData = await response.json().catch(() => ({}))
          console.log(`Model ${model} failed:`, response.status, errorData)
        }
      } catch (error) {
        console.log(`Model ${model} error:`, error.message)
      }
    }

    return Response.json({
      success: false,
      message: "❌ No working models found. Check your API key and try again.",
    })
  } catch (error) {
    console.error("Test error:", error)
    return new Response(`Test error: ${error.message}`, { status: 500 })
  }
}
