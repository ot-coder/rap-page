import { type NextRequest, NextResponse } from "next/server"
import OpenAI from "openai"
import { formatLyrics } from "../../utils/formatLyrics"
import { rateLimit } from "../../utils/rateLimit"
import { sanitizeInput } from "../../utils/sanitizeInput"
import { filterContent } from "../../utils/filterContent"

export async function POST(request: NextRequest) {
  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })

    // Apply rate limiting
    await rateLimit()

    const body = await request.json()
    const { concept } = body

    if (!concept || typeof concept !== "string" || !concept.trim()) {
      console.error("Invalid or missing concept in request body")
      return NextResponse.json({ error: "Valid concept is required" }, { status: 400 })
    }

    // Sanitize user input
    const sanitizedConcept = sanitizeInput(concept)

    // Generate lyrics
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are a talented rapper and R&B songwriter. Create lyrics based on the given concept or story. Avoid explicit content or offensive language.",
        },
        {
          role: "user",
          content: `Write rap or R&B lyrics based on this concept: ${sanitizedConcept}`,
        },
      ],
      max_tokens: 300,
    })

    const generatedLyrics = response.choices[0]?.message?.content

    if (!generatedLyrics) {
      console.error("No lyrics generated by OpenAI")
      throw new Error("No lyrics were generated by the AI")
    }

    const formattedLyrics = formatLyrics(generatedLyrics)

    // Apply content filtering
    const filteredLyrics = filterContent(formattedLyrics)

    return NextResponse.json({ lyrics: filteredLyrics })
  } catch (error) {
    console.error("Error in POST /api/generate-lyrics:", error)
    if (error instanceof Error) {
      return NextResponse.json({ error: `Failed to generate lyrics: ${error.message}` }, { status: 500 })
    } else {
      return NextResponse.json({ error: "An unexpected error occurred while generating lyrics" }, { status: 500 })
    }
  }
}

