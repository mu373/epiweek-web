import { createRoute, OpenAPIHono, z } from '@hono/zod-openapi'
import { YearCalendarResponseSchema, MonthCalendarResponseSchema } from '../schemas/calendar.js'
import { ErrorSchema, TimezoneSchema } from '../schemas/common.js'
import { generateYearCalendarData, generateMonthCalendarData } from '../lib/calendar-generator.js'

const app = new OpenAPIHono()

// GET /api/v1/calendar/{year}
const getYearCalendarRoute = createRoute({
  method: 'get',
  path: '/{year}',
  request: {
    params: z.object({
      year: z.coerce.number().int().min(1900).max(2100).openapi({ param: { name: 'year', in: 'path' }, example: 2024, description: 'Year (1900-2100)' })
    }),
    query: z.object({
      timezone: TimezoneSchema
    })
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: YearCalendarResponseSchema
        }
      },
      description: 'Successfully retrieved year calendar data'
    },
    400: {
      content: {
        'application/json': {
          schema: ErrorSchema
        }
      },
      description: 'Invalid year parameter'
    }
  },
  tags: ['Calendar'],
  description: 'Retrieve complete calendar data for a specific year, including all 12 months with epiweek information.\n\nEach month includes all weeks that overlap with that month, and each week shows all 7 days (Sunday-Saturday). Days are marked with `isCurrentMonth` to distinguish days that belong to adjacent months.\n\nThe `isToday` flag is determined based on the provided timezone (defaults to America/New_York).',
  summary: 'Get full year calendar with epiweeks'
})

app.openapi(getYearCalendarRoute, (c) => {
  const { year } = c.req.valid('param')
  const { timezone } = c.req.valid('query')

  try {
    if (year < 1900 || year > 2100) {
      return c.json({
        error: 'InvalidYear',
        message: 'Year must be between 1900 and 2100'
      }, 400)
    }

    const calendarData = generateYearCalendarData(year, timezone)

    return c.json(calendarData, 200)
  } catch (error) {
    return c.json({
      error: 'CalendarError',
      message: error instanceof Error ? error.message : 'An error occurred generating calendar data'
    }, 400)
  }
})

// GET /api/v1/calendar/{year}/{month}
const getMonthCalendarRoute = createRoute({
  method: 'get',
  path: '/{year}/{month}',
  request: {
    params: z.object({
      year: z.coerce.number().int().min(1900).max(2100).openapi({ param: { name: 'year', in: 'path' }, example: 2024, description: 'Year (1900-2100)' }),
      month: z.coerce.number().int().min(1).max(12).openapi({ param: { name: 'month', in: 'path' }, example: 12, description: 'Month (1-12, where 1=January and 12=December)' })
    }),
    query: z.object({
      timezone: TimezoneSchema
    })
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: MonthCalendarResponseSchema
        }
      },
      description: 'Successfully retrieved month calendar data'
    },
    400: {
      content: {
        'application/json': {
          schema: ErrorSchema
        }
      },
      description: 'Invalid year or month parameter'
    }
  },
  tags: ['Calendar'],
  description: 'Retrieve calendar data for a specific month, including all weeks and epiweek information.\n\nThe response includes all weeks that overlap with the specified month. Each week shows all 7 days (Sunday-Saturday), with `isCurrentMonth` flag to identify days from adjacent months.\n\nMonth parameter should be 1-12 (1=January, 12=December).\n\nThe `isToday` flag is determined based on the provided timezone (defaults to America/New_York).',
  summary: 'Get single month calendar with epiweeks'
})

app.openapi(getMonthCalendarRoute, (c) => {
  const { year, month } = c.req.valid('param')
  const { timezone } = c.req.valid('query')

  try {
    if (year < 1900 || year > 2100) {
      return c.json({
        error: 'InvalidYear',
        message: 'Year must be between 1900 and 2100'
      }, 400)
    }

    if (month < 1 || month > 12) {
      return c.json({
        error: 'InvalidMonth',
        message: 'Month must be between 1 and 12'
      }, 400)
    }

    const monthData = generateMonthCalendarData(year, month - 1, timezone) // month is 1-12, but generateMonthCalendarData expects 0-11

    return c.json({
      year,
      month,
      monthName: monthData.name,
      weeks: monthData.weeks
    }, 200)
  } catch (error) {
    return c.json({
      error: 'CalendarError',
      message: error instanceof Error ? error.message : 'An error occurred generating calendar data'
    }, 400)
  }
})

export default app
