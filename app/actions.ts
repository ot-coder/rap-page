"use server"

import OpenAI from "openai"
import { rateLimit } from "./utils/rateLimit"
import { generateLyricsCore } from "./utils/generateLyricsCore"

export async function generateLyrics(concept: string) {
  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })
    
    if (!process.env.OPENAI_API_KEY) {
      throw new Error("OpenAI API key is not configured")
    }

    // Apply rate limiting
    await rateLimit()

    // Use the shared core function
    return await generateLyricsCore({
      concept,
      openai,
      maxTokens: 500
    })
  } catch (error) {
    console.error("Error in generateLyrics:", error)
    throw error
  }
}

