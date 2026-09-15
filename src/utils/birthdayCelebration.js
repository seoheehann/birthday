export const BIRTHDAY_START = new Date(2026, 8, 17, 0, 0, 0)
const BIRTHDAY_END = new Date(2026, 8, 18, 0, 0, 0)
const STORAGE_KEY = 'birthdayCelebrationStartedAt:2026-09-17'
const DURATION_MS = 30_000
let fallbackStartedAt = null

export function isBirthdayCelebrationActive(now = new Date()) {
  const timestamp = now.getTime()
  let startedAt = fallbackStartedAt
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved !== null) startedAt = Number(saved)
  } catch {}

  const validStart = Number.isFinite(startedAt)
    && startedAt >= BIRTHDAY_START.getTime()
    && startedAt < BIRTHDAY_END.getTime()

  if (!validStart) {
    if (timestamp < BIRTHDAY_START || timestamp >= BIRTHDAY_END) return false
    startedAt = timestamp
    fallbackStartedAt = startedAt
    try { localStorage.setItem(STORAGE_KEY, String(startedAt)) } catch {}
  }

  return timestamp >= startedAt && timestamp - startedAt < DURATION_MS
}
