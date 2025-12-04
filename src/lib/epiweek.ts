import { EpiWeek } from '@mu373/epiweek'

export interface EpiweekInfo {
  year: number
  week: number
  epiweek: string
}

export function formatDate(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function getEpiweekInfo(date: Date): EpiweekInfo {
  const epiWeek = new EpiWeek(date.getFullYear(), 1, { system: 'mmwr' })
  epiWeek.fromJSDate(date)
  const epiweek = String(epiWeek.year) + String(epiWeek.week).padStart(2, '0')
  return { week: epiWeek.week, year: epiWeek.year, epiweek }
}

export function parseEpiweekString(epiweekStr: string): { year: number; week: number } {
  if (!/^\d{6}$/.test(epiweekStr)) {
    throw new Error(`Invalid epiweek format: ${epiweekStr}. Expected YYYYWW format (e.g., 202449)`)
  }

  const year = parseInt(epiweekStr.substring(0, 4), 10)
  const week = parseInt(epiweekStr.substring(4, 6), 10)

  if (year < 1900 || year > 2100) {
    throw new Error(`Invalid year: ${year}. Must be between 1900 and 2100`)
  }

  if (week < 1 || week > 53) {
    throw new Error(`Invalid week: ${week}. Must be between 1 and 53`)
  }

  return { year, week }
}

export function getEpiweekDates(year: number, week: number): {
  start: Date
  end: Date
  days: Date[]
} {
  const epiWeek = new EpiWeek(year, week, { system: 'mmwr', day: 1 })
  const startDate = epiWeek.toJSDate()
  const days: Date[] = Array.from(epiWeek.iterDates())
  const endDate = days[days.length - 1]

  return { start: startDate, end: endDate, days }
}

export function getDayOfWeekName(dayNum: number): string {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  return days[dayNum]
}

export function getEpiweeksInRange(startDate: Date, endDate: Date): EpiweekInfo[] {
  const epiweeks: EpiweekInfo[] = []
  const seen = new Set<string>()

  const current = new Date(startDate)
  while (current <= endDate) {
    const info = getEpiweekInfo(current)
    if (!seen.has(info.epiweek)) {
      seen.add(info.epiweek)
      epiweeks.push(info)
    }
    current.setDate(current.getDate() + 1)
  }

  return epiweeks
}
