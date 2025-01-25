"use server"

export async function generateLyrics(concept: string): Promise<string> {
  if (!concept.trim()) {
    throw new Error("Concept is required")
  }

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/generate-lyrics`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ concept }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`HTTP error! status: ${response.status}, body: ${errorText}`)
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    if (!data.lyrics) {
      console.error("No lyrics in response:", data)
      throw new Error("No lyrics were generated")
    }
    return data.lyrics
  } catch (error) {
    console.error("Error in generateLyrics:", error)
    if (error instanceof Error) {
      throw new Error(`Failed to generate lyrics: ${error.message}`)
    } else {
      throw new Error("An unexpected error occurred while generating lyrics")
    }
  }
}

