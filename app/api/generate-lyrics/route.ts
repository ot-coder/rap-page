import { type NextRequest, NextResponse } from "next/server"
import OpenAI from "openai"
import { rateLimit } from "../../utils/rateLimit"
import { generateLyricsCore } from "../../utils/generateLyricsCore"

export async function POST(request: NextRequest) {
  try {
    console.log("Starting lyrics generation request...")
    
    console.log("Debug- OpenAI API key is what:", process.env.OPENAI_API_KEY)

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })
    
    if (!process.env.OPENAI_API_KEY) {
      console.error("OpenAI API key is not configured")
      throw new Error("OpenAI API key is not configured")
    }

    // Apply rate limiting
    await rateLimit()

    const body = await request.json()
    const { concept } = body

    if (!concept || typeof concept !== "string" || !concept.trim()) {
      console.error("Invalid or missing concept in request body")
      return NextResponse.json({ error: "Valid concept is required" }, { status: 400 })
    }

    // Use the shared core function
    const lyrics = await generateLyricsCore({
      concept,
      openai,
      maxTokens: 300
    })

    return NextResponse.json({ lyrics })
  } catch (error) {
    console.error("Detailed error:", {
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
      type: error instanceof Error ? error.constructor.name : typeof error
    })
    console.error("Error in POST /api/generate-lyrics:", error)
    if (error instanceof Error) {
      return NextResponse.json({ error: `Failed to generate lyrics: ${error.message}` }, { status: 500 })
    } else {
      return NextResponse.json({ error: "An unexpected error occurred while generating lyrics" }, { status: 500 })
    }
  }
}

