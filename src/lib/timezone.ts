import { DateTime } from 'luxon'

export function parseDate(dateString: string, timezone: string = 'America/New_York'): Date {
  const dt = DateTime.fromISO(dateString, { zone: timezone })

  if (!dt.isValid) {
    throw new Error(`Invalid date: ${dateString}. ${dt.invalidReason}: ${dt.invalidExplanation}`)
  }

  return dt.toJSDate()
}

export function formatDateInTimezone(date: Date, timezone: string = 'America/New_York'): string {
  const dt = DateTime.fromJSDate(date).setZone(timezone)

  if (!dt.isValid) {
    throw new Error(`Invalid timezone: ${timezone}`)
  }

  return dt.toISODate()!
}

export function validateTimezone(timezone: string): boolean {
  try {
    const dt = DateTime.now().setZone(timezone)
    return dt.isValid
  } catch {
    return false
  }
}

export function getCurrentDateInTimezone(timezone: string = 'America/New_York'): Date {
  const dt = DateTime.now().setZone(timezone)

  if (!dt.isValid) {
    throw new Error(`Invalid timezone: ${timezone}`)
  }

  return dt.toJSDate()
}

export function formatISOWithTimezone(date: Date, timezone: string = 'America/New_York'): string {
  const dt = DateTime.fromJSDate(date).setZone(timezone)

  if (!dt.isValid) {
    throw new Error(`Invalid timezone: ${timezone}`)
  }

  return dt.toISO()!
}
