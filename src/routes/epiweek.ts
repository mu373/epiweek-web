import { createRoute, OpenAPIHono } from '@hono/zod-openapi'
import {
  EpiweekQuerySchema,
  DateToEpiweekResponseSchema,
  EpiweekToDatesResponseSchema,
  BatchConversionRequestSchema,
  BatchConversionResponseSchema
} from '../schemas/epiweek.js'
import { ErrorSchema } from '../schemas/common.js'
import { parseDate } from '../lib/timezone.js'
import {
  getEpiweekInfo,
  getEpiweekDates,
  parseEpiweekString,
  formatDate,
  getDayOfWeekName
} from '../lib/epiweek.js'

const app = new OpenAPIHono()

// Smart conversion endpoint - GET /api/v1/epiweek
const getEpiweekRoute = createRoute({
  method: 'get',
  path: '/',
  request: {
    query: EpiweekQuerySchema
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: DateToEpiweekResponseSchema.or(EpiweekToDatesResponseSchema)
        }
      },
      description: 'Successfully converted date to epiweek or epiweek to dates'
    },
    400: {
      content: {
        'application/json': {
          schema: ErrorSchema
        }
      },
      description: 'Invalid input parameters'
    }
  },
  tags: ['Conversion'],
  description: 'Smart conversion endpoint that handles bidirectional date/epiweek conversion. Provide ONE of the following parameter combinations:\n\n1. **date** - Convert a date to epiweek (e.g., `?date=2024-12-03`)\n2. **epiweek** - Convert epiweek string to dates (e.g., `?epiweek=202449`)\n3. **year AND week** - Convert year+week to dates (e.g., `?year=2024&week=49`)',
  summary: 'Convert between dates and epiweeks'
})

app.openapi(getEpiweekRoute, (c) => {
  const { date, epiweek, year, week } = c.req.valid('query')

  try {
    // Check for ambiguous parameters - only one conversion type should be specified
    const hasDate = date !== undefined
    const hasEpiweek = epiweek !== undefined
    const hasYearWeek = year !== undefined && week !== undefined
    const hasPartialYearWeek = (year !== undefined && week === undefined) || (year === undefined && week !== undefined)

    const conversionCount = [hasDate, hasEpiweek, hasYearWeek].filter(Boolean).length

    if (conversionCount > 1) {
      return c.json({
        error: 'AmbiguousParameters',
        message: 'Ambiguous parameters: provide only ONE of "date", "epiweek", or "year+week" (not multiple)'
      }, 400)
    }

    if (hasPartialYearWeek) {
      return c.json({
        error: 'InvalidParameters',
        message: 'Both "year" and "week" parameters are required when using year+week format'
      }, 400)
    }

    // Mode 1: Convert date to epiweek
    if (date) {
      const parsedDate = parseDate(date)
      const epiweekInfo = getEpiweekInfo(parsedDate)

      return c.json({
        date,
        epiweek: epiweekInfo
      }, 200)
    }

    // Mode 2: Convert epiweek to dates (single string format)
    if (epiweek) {
      const { year: epiYear, week: epiWeek } = parseEpiweekString(epiweek)
      const { start, end, days } = getEpiweekDates(epiYear, epiWeek)

      return c.json({
        epiweek: {
          year: epiYear,
          week: epiWeek,
          epiweek
        },
        dateRange: {
          start: formatDate(start),
          end: formatDate(end)
        },
        days: days.map((day, index) => ({
          date: formatDate(day),
          dayOfWeek: getDayOfWeekName(day.getDay()),
          dayNumber: index + 1
        }))
      }, 200)
    }

    // Mode 3: Convert epiweek to dates (year + week format)
    if (year !== undefined && week !== undefined) {
      const { start, end, days } = getEpiweekDates(year, week)
      const epiweekString = String(year) + String(week).padStart(2, '0')

      return c.json({
        epiweek: {
          year,
          week,
          epiweek: epiweekString
        },
        dateRange: {
          start: formatDate(start),
          end: formatDate(end)
        },
        days: days.map((day, index) => ({
          date: formatDate(day),
          dayOfWeek: getDayOfWeekName(day.getDay()),
          dayNumber: index + 1
        }))
      }, 200)
    }

    // No valid parameters provided
    return c.json({
      error: 'InvalidParameters',
      message: 'You must provide either "date" OR "epiweek" OR "year+week" parameters'
    }, 400)
  } catch (error) {
    return c.json({
      error: 'ConversionError',
      message: error instanceof Error ? error.message : 'An error occurred during conversion'
    }, 400)
  }
})

// Batch conversion endpoint - POST /api/v1/epiweek/batch
const batchConversionRoute = createRoute({
  method: 'post',
  path: '/batch',
  request: {
    body: {
      content: {
        'application/json': {
          schema: BatchConversionRequestSchema
        }
      }
    }
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: BatchConversionResponseSchema
        }
      },
      description: 'Successfully converted batch of dates to epiweeks'
    },
    400: {
      content: {
        'application/json': {
          schema: ErrorSchema
        }
      },
      description: 'Invalid input parameters'
    }
  },
  tags: ['Conversion'],
  description: 'Convert multiple dates to epiweeks in a single request. Useful for bulk conversions.\n\nSend an array of ISO 8601 dates (YYYY-MM-DD format) in the request body. Maximum 1000 dates per request.\n\nExample request body:\n```json\n{\n  "dates": ["2024-12-03", "2024-01-15", "2024-06-20"]\n}\n```',
  summary: 'Batch convert dates to epiweeks'
})

app.openapi(batchConversionRoute, (c) => {
  const { dates } = c.req.valid('json')

  try {
    const conversions = dates.map((dateStr: string) => {
      const parsedDate = parseDate(dateStr)
      const epiweekInfo = getEpiweekInfo(parsedDate)

      return {
        date: dateStr,
        epiweek: epiweekInfo
      }
    })

    return c.json({
      conversions
    }, 200)
  } catch (error) {
    return c.json({
      error: 'ConversionError',
      message: error instanceof Error ? error.message : 'An error occurred during batch conversion'
    }, 400)
  }
})

export default app
