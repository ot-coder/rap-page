export function formatLyrics(lyrics: string): string {
  // Remove any "Verse 1:", "Chorus:", etc. labels
  const formattedLyrics = lyrics.replace(/^(Verse \d+:|Chorus:|Bridge:)/gm, "")

  // Split the lyrics into lines and add line breaks
  const lines = formattedLyrics.split("\n")
  const formattedLines = lines.map((line) => line.trim()).filter((line) => line !== "")

  return formattedLines.join("\n")
}

