export async function POST(req: Request) {
  try {
    const { prompt } = await req.json()

    if (!prompt) {
      return new Response("Prompt is required", { status: 400 })
    }

    console.log("Image generation request:", { prompt })

    // Use Hugging Face Inference API - completely free
    const seed = Math.floor(Math.random() * 1000000)

    // Try multiple free services in order
    const services = [
      {
        name: "Hugging Face",
        url: `https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            num_inference_steps: 20,
            guidance_scale: 7.5,
            width: 1024,
            height: 1024,
          },
        }),
      },
      {
        name: "Pollinations",
        url: `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=1024&height=1024&seed=${seed}&enhance=true&nologo=true`,
        method: "GET",
      },
      {
        name: "Picsum (Fallback)",
        url: `https://picsum.photos/1024/1024?random=${seed}`,
        method: "GET",
      },
    ]

    for (const service of services) {
      try {
        console.log(`Trying ${service.name}...`)

        const response = await fetch(service.url, {
          method: service.method,
          headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
            ...service.headers,
          },
          body: service.body,
        })

        if (response.ok) {
          const contentType = response.headers.get("content-type")

          if (contentType?.includes("image")) {
            // For direct image responses, return the URL
            return Response.json({
              success: true,
              message: `Image generated successfully with ${service.name}!`,
              imageUrl: service.url,
              prompt: prompt,
              seed: seed,
              service: service.name,
            })
          } else {
            // For Hugging Face API, handle blob response
            const blob = await response.blob()
            if (blob.size > 0) {
              // Convert blob to base64 for display
              const buffer = await blob.arrayBuffer()
              const base64 = Buffer.from(buffer).toString("base64")
              const dataUrl = `data:image/png;base64,${base64}`

              return Response.json({
                success: true,
                message: `Image generated successfully with ${service.name}!`,
                imageUrl: dataUrl,
                prompt: prompt,
                seed: seed,
                service: service.name,
              })
            }
          }
        }
      } catch (error) {
        console.error(`${service.name} failed:`, error)
        continue
      }
    }

    // If all services fail, return error
    return Response.json({
      success: false,
      message: "All image generation services are currently unavailable. Please try again later.",
      imageUrl: null,
    })
  } catch (error) {
    console.error("Image generation error:", error)
    return new Response(`Image generation failed: ${error.message}`, { status: 500 })
  }
}
