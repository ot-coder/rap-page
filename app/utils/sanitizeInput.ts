import DOMPurify from "isomorphic-dompurify"

export function sanitizeInput(input: string): string {
  return input.trim()
}

