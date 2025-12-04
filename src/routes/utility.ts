import { createRoute, OpenAPIHono } from '@hono/zod-openapi'
import { CurrentEpiweekResponseSchema, RangeQuerySchema, RangeResponseSchema } from '../schemas/utility.js'
import { ErrorSchema } from '../schemas/common.js'
import { getCurrentDateInTimezone, formatISOWithTimezone, parseDate } from '../lib/timezone.js'
import { getEpiweekInfo, getEpiweeksInRange } from '../lib/epiweek.js'

const app = new OpenAPIHono()

// GET /api/v1/current
const getCurrentRoute = createRoute({
  method: 'get',
  path: '/current',
  request: {
    query: RangeQuerySchema.pick({ timezone: true })
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: CurrentEpiweekResponseSchema
        }
      },
      description: 'Successfully retrieved current epiweek'
    },
    400: {
      content: {
        'application/json': {
          schema: ErrorSchema
        }
      },
      description: 'Invalid timezone'
    }
  },
  tags: ['Utility'],
  description: 'Get the current date/time and corresponding epiweek.\n\nReturns the current timestamp in ISO 8601 format along with the epiweek information. Use the `timezone` parameter to get the current time in a specific timezone (defaults to America/New_York).\n\nUseful for displaying "today\'s epiweek" or syncing with current time in different regions.',
  summary: 'Get current date and epiweek'
})

app.openapi(getCurrentRoute, (c) => {
  const { timezone } = c.req.valid('query')

  try {
    const currentDate = getCurrentDateInTimezone(timezone)
    const epiweekInfo = getEpiweekInfo(currentDate)
    const isoDate = formatISOWithTimezone(currentDate, timezone)

    return c.json({
      date: isoDate,
      timezone,
      epiweek: epiweekInfo
    }, 200)
  } catch (error) {
    return c.json({
      error: 'CurrentError',
      message: error instanceof Error ? error.message : 'An error occurred retrieving current epiweek'
    }, 400)
  }
})

// GET /api/v1/range
const getRangeRoute = createRoute({
  method: 'get',
  path: '/range',
  request: {
    query: RangeQuerySchema
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: RangeResponseSchema
        }
      },
      description: 'Successfully retrieved epiweek range'
    },
    400: {
      content: {
        'application/json': {
          schema: ErrorSchema
        }
      },
      description: 'Invalid date range'
    }
  },
  tags: ['Utility'],
  description: 'Get a list of all unique epiweeks that fall within a specified date range.\n\nProvide `start` and `end` dates in YYYY-MM-DD format. The endpoint returns all epiweeks that occur between these dates (inclusive).\n\nUseful for:\n- Generating reports for specific time periods\n- Understanding epiweek coverage across date ranges\n- Planning data collection schedules\n\nExample: `?start=2024-01-01&end=2024-03-31` returns all epiweeks in Q1 2024.',
  summary: 'Get all epiweeks in a date range'
})

app.openapi(getRangeRoute, (c) => {
  const { start, end, timezone } = c.req.valid('query')

  try {
    const startDate = parseDate(start, timezone)
    const endDate = parseDate(end, timezone)

    if (startDate > endDate) {
      return c.json({
        error: 'InvalidRange',
        message: 'Start date must be before or equal to end date'
      }, 400)
    }

    const epiweeks = getEpiweeksInRange(startDate, endDate)

    return c.json({
      start,
      end,
      timezone,
      epiweeks,
      totalWeeks: epiweeks.length
    }, 200)
  } catch (error) {
    return c.json({
      error: 'RangeError',
      message: error instanceof Error ? error.message : 'An error occurred calculating epiweek range'
    }, 400)
  }
})

export default app
