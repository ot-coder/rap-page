import { cookies } from "next/headers"

const RATE_LIMIT_DURATION = 60 * 1000 // 1 minute
const MAX_REQUESTS = 5 // Maximum 5 requests per minute

export async function rateLimit() {
  const cookieStore = cookies()
  const lastRequestTime = cookieStore.get("lastRequestTime")
  const requestCount = cookieStore.get("requestCount")

  const now = Date.now()

  if (lastRequestTime && requestCount) {
    const timeSinceLastRequest = now - Number.parseInt(lastRequestTime.value)
    const count = Number.parseInt(requestCount.value)

    if (timeSinceLastRequest < RATE_LIMIT_DURATION && count >= MAX_REQUESTS) {
      throw new Error("Rate limit exceeded. Please try again later.")
    }

    if (timeSinceLastRequest >= RATE_LIMIT_DURATION) {
      cookieStore.set("requestCount", "1")
    } else {
      cookieStore.set("requestCount", (count + 1).toString())
    }
  } else {
    cookieStore.set("requestCount", "1")
  }

  cookieStore.set("lastRequestTime", now.toString())
}

