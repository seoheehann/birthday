export const ROULETTE_STORAGE_KEY = 'rouletteState'

export function getLocalDateKey(date = new Date()) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function normalizeRouletteState(value) {
  return {
    ticketCount: Math.max(0, Number.parseInt(value?.ticketCount, 10) || 0),
    lastFreeTicketDate: value?.lastFreeTicketDate || null,
    popupDismissedDate: value?.popupDismissedDate || null,
    quizCompletedDate: value?.quizCompletedDate || null,
  }
}

export function readRouletteState() {
  try {
    return normalizeRouletteState(JSON.parse(localStorage.getItem(ROULETTE_STORAGE_KEY) || '{}'))
  } catch (error) {
    return normalizeRouletteState()
  }
}

export function writeRouletteState(state) {
  const normalized = normalizeRouletteState(state)
  try {
    localStorage.setItem(ROULETTE_STORAGE_KEY, JSON.stringify(normalized))
  } catch (error) {}
  return normalized
}

export function updateStoredRouletteState(updater) {
  const current = readRouletteState()
  return writeRouletteState(updater(current))
}

export function grantDailyFreeTicket(date = new Date()) {
  const todayKey = getLocalDateKey(date)
  return updateStoredRouletteState(current => {
    if (current.lastFreeTicketDate === todayKey) return current
    return {
      ...current,
      ticketCount: current.ticketCount + 1,
      lastFreeTicketDate: todayKey,
    }
  })
}
