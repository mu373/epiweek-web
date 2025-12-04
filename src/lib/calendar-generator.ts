import { formatDate, getEpiweekInfo, getDayOfWeekName } from './epiweek.js'
import { getCurrentDateInTimezone } from './timezone.js'

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

export interface DayData {
  date: string
  dayOfWeek: string
  dayNumber: number
  isCurrentMonth: boolean
  isToday: boolean
}

export interface WeekData {
  week: number
  year: number
  epiweek: string
  days: DayData[]
}

export interface MonthData {
  month: number
  name: string
  weeks: WeekData[]
}

export interface YearData {
  year: number
  totalWeeks: number
  months: MonthData[]
}

export function generateMonthCalendarData(year: number, month: number, timezone: string = 'America/New_York'): MonthData {
  const firstOfMonth = new Date(year, month, 1)
  const lastOfMonth = new Date(year, month + 1, 0)

  // Find the first Sunday on or before the 1st
  const startDate = new Date(firstOfMonth)
  startDate.setDate(startDate.getDate() - startDate.getDay())

  // Find the last Saturday on or after the last day
  const endDate = new Date(lastOfMonth)
  endDate.setDate(endDate.getDate() + (6 - endDate.getDay()))

  const weeks: WeekData[] = []
  const current = new Date(startDate)
  const today = getCurrentDateInTimezone(timezone)
  const todayStr = formatDate(today)

  while (current <= endDate) {
    const { week, year: epiYear, epiweek } = getEpiweekInfo(current)
    const days: DayData[] = []

    for (let i = 0; i < 7; i++) {
      const isCurrentMonth = current.getMonth() === month
      const dateStr = formatDate(current)
      const dayNum = current.getDate()
      const isToday = dateStr === todayStr

      days.push({
        date: dateStr,
        dayOfWeek: getDayOfWeekName(current.getDay()),
        dayNumber: dayNum,
        isCurrentMonth,
        isToday
      })

      current.setDate(current.getDate() + 1)
    }

    weeks.push({ week, year: epiYear, epiweek, days })
  }

  return {
    month: month + 1,
    name: MONTHS[month],
    weeks
  }
}

export function generateYearCalendarData(year: number, timezone: string = 'America/New_York'): YearData {
  const months: MonthData[] = []

  for (let month = 0; month < 12; month++) {
    months.push(generateMonthCalendarData(year, month, timezone))
  }

  // Count unique epiweeks in the year
  const epiweeksSet = new Set<string>()
  months.forEach(month => {
    month.weeks.forEach(week => {
      if (week.year === year) {
        epiweeksSet.add(week.epiweek)
      }
    })
  })

  return {
    year,
    totalWeeks: epiweeksSet.size,
    months
  }
}
