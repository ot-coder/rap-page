"use server"

export async function generateLyrics(concept: string) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/generate-lyrics`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ concept }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to generate lyrics')
  }

  const data = await response.json()
  return data.lyrics
}

