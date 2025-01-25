const INAPPROPRIATE_WORDS = {
  "explicit": "expl*cit",
  "offensive": "*ffensive",
  "profanity": "pr*fanity"
} 

export function filterContent(content: string): string {
  let filteredContent = content

  Object.entries(INAPPROPRIATE_WORDS).forEach(([word, replacement]) => {
    const regex = new RegExp(word, "gi")
    filteredContent = filteredContent.replace(regex, replacement)
  })

  return filteredContent
}

