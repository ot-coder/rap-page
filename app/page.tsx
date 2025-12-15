"use client"

import { useState } from "react"
const GENERATE_LYRICS_ENDPOINT = "/api/generate-lyrics"

export default function Home() {
  const [input, setInput] = useState("")
  const [lyrics, setLyrics] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [controller, setController] = useState<AbortController | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Cancel any pending request
    if (controller) {
      controller.abort()
    }

    const newController = new AbortController()
    setController(newController)

    setIsLoading(true)
    setLyrics("")
    setError("")
    try {
      if (!input.trim()) {
        throw new Error("Please enter a concept or story")
      }
      if (input.length > 500) {
        throw new Error("Input is too long. Please keep it under 500 characters")
      }
      const response = await fetch(GENERATE_LYRICS_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ concept: input }),
        signal: newController.signal,
      })

      if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}))
        const message =
          typeof errorBody?.error === "string"
            ? errorBody.error
            : "Failed to generate lyrics. Please try again."
        throw new Error(message)
      }

      const { lyrics: generatedLyrics } = await response.json()

      if (!generatedLyrics || typeof generatedLyrics !== "string") {
        throw new Error("No lyrics were generated")
      }

      setLyrics(generatedLyrics)
    } catch (error) {
      console.error("Error in handleSubmit:", error)
      if (error instanceof Error) {
        setError(`Error: ${error.message}`)
      } else {
        setError("An unexpected error occurred while generating lyrics. Please try again.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-100">Rap & R&B Lyric Generator</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="concept" className="block text-sm font-medium text-gray-300">
              Enter your concept or story
            </label>
            <div className="mt-1">
              <textarea
                id="concept"
                name="concept"
                rows={4}
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-600 rounded-md bg-gray-800 text-gray-100"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                required
              />
            </div>
          </div>
          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-offset-gray-900"
              disabled={isLoading}
            >
              {isLoading ? "Generating..." : "Generate Lyrics"}
            </button>
          </div>
        </form>
        {error && <div className="mt-4 text-red-400">{error}</div>}
        {lyrics && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4 text-gray-100">Generated Lyrics:</h2>
            <pre className="bg-gray-800 shadow-sm p-4 rounded-md whitespace-pre-wrap text-gray-100 border border-gray-700">{lyrics}</pre>
          </div>
        )}
      </div>
    </main>
  )
}

