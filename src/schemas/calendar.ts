import { z } from '@hono/zod-openapi'
import {
  TimezoneSchema,
  DateStringSchema,
  EpiweekStringSchema,
  YearSchema,
  WeekSchema,
  EpiweekDataSchema
} from './common.js'

// Day data for calendar
export const CalendarDaySchema = z.object({
  date: DateStringSchema,
  dayOfWeek: z.string().openapi({ example: 'Monday' }),
  dayNumber: z.number().int().openapi({ example: 1 }),
  isCurrentMonth: z.boolean().openapi({ example: true }),
  isToday: z.boolean().openapi({ example: false })
}).openapi({
  description: 'Day information in a calendar'
})

// Week data for calendar
export const CalendarWeekSchema = z.object({
  week: WeekSchema,
  year: YearSchema,
  epiweek: EpiweekStringSchema,
  days: z.array(CalendarDaySchema).length(7)
}).openapi({
  description: 'Week information with all 7 days'
})

// Month data for calendar
export const CalendarMonthSchema = z.object({
  month: z.number().int().min(1).max(12).openapi({ example: 12 }),
  name: z.string().openapi({ example: 'December' }),
  weeks: z.array(CalendarWeekSchema)
}).openapi({
  description: 'Month information with all weeks'
})

// Year calendar response
export const YearCalendarResponseSchema = z.object({
  year: YearSchema,
  totalWeeks: z.number().int().openapi({ example: 52 }),
  months: z.array(CalendarMonthSchema).length(12)
}).openapi({
  description: 'Full year calendar data with all 12 months'
})

// Month calendar response
export const MonthCalendarResponseSchema = z.object({
  year: YearSchema,
  month: z.number().int().min(1).max(12),
  monthName: z.string().openapi({ example: 'December' }),
  weeks: z.array(CalendarWeekSchema)
}).openapi({
  description: 'Single month calendar data with all weeks'
})

// Week details response
export const WeekDetailsResponseSchema = z.object({
  epiweek: EpiweekStringSchema,
  year: YearSchema,
  week: WeekSchema,
  dateRange: z.object({
    start: DateStringSchema,
    end: DateStringSchema
  }),
  days: z.array(
    z.object({
      date: DateStringSchema,
      dayOfWeek: z.string(),
      dayNumber: z.number().int()
    })
  ).length(7)
}).openapi({
  description: 'Detailed information about a specific epiweek'
})
