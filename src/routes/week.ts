import { createRoute, OpenAPIHono, z } from '@hono/zod-openapi'
import { WeekDetailsResponseSchema } from '../schemas/calendar.js'
import { ErrorSchema, TimezoneSchema } from '../schemas/common.js'
import { parseEpiweekString, getEpiweekDates, formatDate, getDayOfWeekName } from '../lib/epiweek.js'

const app = new OpenAPIHono()

// GET /api/v1/week/{epiweek}
const getWeekDetailsRoute = createRoute({
  method: 'get',
  path: '/{epiweek}',
  request: {
    params: z.object({
      epiweek: z.string().regex(/^\d{6}$/).openapi({ param: { name: 'epiweek', in: 'path' }, example: '202449', description: 'Epiweek in YYYYWW format (e.g., 202449)' })
    })
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: WeekDetailsResponseSchema
        }
      },
      description: 'Successfully retrieved week details'
    },
    400: {
      content: {
        'application/json': {
          schema: ErrorSchema
        }
      },
      description: 'Invalid epiweek format'
    }
  },
  tags: ['Week'],
  description: 'Get detailed information about a specific epiweek, including the date range and all 7 days.\n\nProvide the epiweek in YYYYWW format (e.g., 202449 for year 2024, week 49).\n\nThe response includes:\n- Date range (start and end dates)\n- All 7 days of the week with day names and numbers\n- Epiweek metadata (year, week number, formatted string)',
  summary: 'Get details for a specific epiweek'
})

app.openapi(getWeekDetailsRoute, (c) => {
  const { epiweek } = c.req.valid('param')

  try {
    const { year, week } = parseEpiweekString(epiweek)
    const { start, end, days } = getEpiweekDates(year, week)

    return c.json({
      epiweek,
      year,
      week,
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
  } catch (error) {
    return c.json({
      error: 'WeekError',
      message: error instanceof Error ? error.message : 'An error occurred retrieving week details'
    }, 400)
  }
})

export default app
