export async function POST(req: Request) {
  try {
    const { owner, repo, path = "", token } = await req.json()

    const headers: Record<string, string> = {
      Accept: "application/vnd.github.v3+json",
      "User-Agent": "AI-Chat-App",
    }

    if (token) {
      headers["Authorization"] = `token ${token}`
    }

    const url = path
      ? `https://api.github.com/repos/${owner}/${repo}/contents/${path}`
      : `https://api.github.com/repos/${owner}/${repo}/contents`

    const response = await fetch(url, { headers })

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.statusText}`)
    }

    const data = await response.json()
    return Response.json(data)
  } catch (error) {
    console.error("GitHub API error:", error)
    return new Response("GitHub API error", { status: 500 })
  }
}
