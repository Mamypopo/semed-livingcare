export function normalizeCreatedDate(input) {
  return input ? new Date(input) : new Date()
}

export function getLocalDayBounds(date) {
  const d = date ? new Date(date) : new Date()
  const y = d.getFullYear(); const m = d.getMonth(); const day = d.getDate()
  return {
    startOfDay: new Date(y, m, day, 0, 0, 0, 0),
    endOfDay: new Date(y, m, day, 23, 59, 59, 999)
  }
}

export function toLocalStartOfDay(date) {
  const d = date ? new Date(date) : new Date()
  return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0)
}


