import { z } from '@hono/zod-openapi'

export const TimezoneSchema = z
  .string()
  .regex(/^(UTC|[A-Za-z_]+\/[A-Za-z_]+)$/)
  .optional()
  .default('America/New_York')
  .openapi({
    param: { name: 'timezone', in: 'query' },
    example: 'America/New_York',
    description: 'IANA timezone identifier (e.g., UTC, America/New_York, Europe/London, Asia/Tokyo). Defaults to America/New_York.'
  })

export const DateStringSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/)
  .openapi({
    example: '2024-12-03',
    description: 'Date in ISO 8601 format (YYYY-MM-DD)'
  })

export const EpiweekStringSchema = z
  .string()
  .regex(/^\d{6}$/)
  .openapi({
    example: '202449',
    description: 'Epiweek in YYYYWW format (e.g., 202449 for year 2024, week 49)'
  })

export const YearSchema = z
  .number()
  .int()
  .min(1900)
  .max(2100)
  .openapi({
    example: 2024,
    description: 'Year (1900-2100)'
  })

export const WeekSchema = z
  .number()
  .int()
  .min(1)
  .max(53)
  .openapi({
    example: 49,
    description: 'Epiweek number (1-53)'
  })

export const EpiweekDataSchema = z.object({
  year: YearSchema,
  week: WeekSchema,
  epiweek: EpiweekStringSchema
}).openapi({
  description: 'Epiweek information with year, week number, and combined string format'
})

export const DateRangeSchema = z.object({
  start: DateStringSchema,
  end: DateStringSchema
}).openapi({
  description: 'Date range with start and end dates'
})

export const DayDataSchema = z.object({
  date: DateStringSchema,
  dayOfWeek: z.string().openapi({ example: 'Monday', description: 'Name of the day of the week' }),
  dayNumber: z.number().int().min(1).max(7).openapi({ example: 1, description: 'Day number within the week (1=Sunday, 7=Saturday)' })
}).openapi({
  description: 'Information about a single day'
})

export const ErrorSchema = z.object({
  error: z.string().openapi({ example: 'ValidationError', description: 'Error code' }),
  message: z.string().openapi({ example: 'Invalid input parameters', description: 'Human-readable error message' }),
  details: z.any().optional().openapi({ description: 'Additional error details (optional)' })
}).openapi({
  description: 'Error response'
})
