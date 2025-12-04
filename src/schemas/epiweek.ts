import { z } from '@hono/zod-openapi'
import {
  TimezoneSchema,
  DateStringSchema,
  EpiweekStringSchema,
  YearSchema,
  WeekSchema,
  EpiweekDataSchema,
  DateRangeSchema,
  DayDataSchema
} from './common.js'

// Query schema for smart epiweek endpoint
export const EpiweekQuerySchema = z.object({
  // Date to epiweek conversion
  date: DateStringSchema.optional().openapi({
    param: { name: 'date', in: 'query' },
    description: 'Date in ISO 8601 format (YYYY-MM-DD) to convert to epiweek. Mutually exclusive with epiweek/year+week parameters.'
  }),

  // Epiweek to dates conversion (option 1: combined string)
  epiweek: EpiweekStringSchema.optional().openapi({
    param: { name: 'epiweek', in: 'query' },
    description: 'Epiweek string (YYYYWW format) to convert to dates. Mutually exclusive with date/year+week parameters.'
  }),

  // Epiweek to dates conversion (option 2: separate year + week)
  year: z.string().regex(/^\d{4}$/).transform(Number).pipe(YearSchema).optional().openapi({
    param: { name: 'year', in: 'query' },
    example: '2024',
    description: 'Year (1900-2100). Must be used together with week parameter. Mutually exclusive with date/epiweek parameters.'
  }),
  week: z.string().regex(/^\d{1,2}$/).transform(Number).pipe(WeekSchema).optional().openapi({
    param: { name: 'week', in: 'query' },
    example: '49',
    description: 'Week number (1-53). Must be used together with year parameter. Mutually exclusive with date/epiweek parameters.'
  })
}).openapi({
  description: 'Query parameters for epiweek conversion. Provide ONE of: (1) date, (2) epiweek, or (3) year+week combination.'
})

// Response when converting date to epiweek
export const DateToEpiweekResponseSchema = z.object({
  date: DateStringSchema,
  epiweek: EpiweekDataSchema
}).openapi({
  description: 'Response for date to epiweek conversion'
})

// Response when converting epiweek to dates
export const EpiweekToDatesResponseSchema = z.object({
  epiweek: EpiweekDataSchema,
  dateRange: DateRangeSchema,
  days: z.array(DayDataSchema)
}).openapi({
  description: 'Response for epiweek to dates conversion, including all 7 days of the week'
})

// Batch conversion request body
export const BatchConversionRequestSchema = z.object({
  dates: z.array(DateStringSchema).min(1).max(1000).openapi({
    description: 'Array of dates to convert (max 1000)',
    example: ['2024-12-03', '2024-01-15', '2024-06-20']
  })
}).openapi({
  description: 'Request body for batch date to epiweek conversion'
})

// Batch conversion response
export const BatchConversionResponseSchema = z.object({
  conversions: z.array(
    z.object({
      date: DateStringSchema,
      epiweek: EpiweekDataSchema
    })
  )
}).openapi({
  description: 'Response for batch date to epiweek conversion'
})
