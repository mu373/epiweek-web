import { z } from '@hono/zod-openapi'
import {
  TimezoneSchema,
  DateStringSchema,
  EpiweekDataSchema
} from './common.js'

// Current epiweek response
export const CurrentEpiweekResponseSchema = z.object({
  date: z.string().openapi({ example: '2024-12-03T15:30:00Z', description: 'Current date and time in ISO 8601 format' }),
  timezone: z.string(),
  epiweek: EpiweekDataSchema
}).openapi({
  description: 'Current date and epiweek information'
})

// Range query parameters
export const RangeQuerySchema = z.object({
  start: DateStringSchema.openapi({ param: { name: 'start', in: 'query' }, description: 'Start date' }),
  end: DateStringSchema.openapi({ param: { name: 'end', in: 'query' }, description: 'End date' }),
  timezone: TimezoneSchema
}).openapi({
  description: 'Query parameters for epiweek range'
})

// Range response
export const RangeResponseSchema = z.object({
  start: DateStringSchema,
  end: DateStringSchema,
  timezone: z.string(),
  epiweeks: z.array(EpiweekDataSchema),
  totalWeeks: z.number().int().openapi({ example: 13 })
}).openapi({
  description: 'List of all epiweeks between two dates'
})
