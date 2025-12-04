import { OpenAPIHono } from '@hono/zod-openapi'
import { swaggerUI } from '@hono/swagger-ui'
import { cors } from 'hono/cors'
import epiweekRoutes from './routes/epiweek.js'
import calendarRoutes from './routes/calendar.js'
import weekRoutes from './routes/week.js'
import utilityRoutes from './routes/utility.js'

const app = new OpenAPIHono()

// Add CORS middleware for API routes
app.use('/api/*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
  exposeHeaders: ['Content-Length'],
  maxAge: 600,
  credentials: false,
}))

// Register API routes
app.route('/api/v1/epiweek', epiweekRoutes)
app.route('/api/v1/calendar', calendarRoutes)
app.route('/api/v1/week', weekRoutes)
app.route('/api/v1', utilityRoutes)

// OpenAPI documentation
app.doc('/api/v1/openapi', {
  openapi: '3.1.0',
  info: {
    version: '1.0.0',
    title: 'Epiweek Calendar API',
    description: 'REST API for converting dates to/from MMWR epidemiological weeks and retrieving calendar data'
  },
  tags: [
    { name: 'Conversion', description: 'Convert between dates and epiweeks' },
    { name: 'Calendar', description: 'Retrieve calendar data for years and months' },
    { name: 'Week', description: 'Get details about specific epiweeks' },
    { name: 'Utility', description: 'Utility endpoints for current epiweek and ranges' }
  ]
})

// Swagger UI
app.get('/api/v1/docs', swaggerUI({ url: '/api/v1/openapi' }))

// Redirect /api and /api/ to docs
app.get('/api', (c) => {
  return c.redirect('/api/v1/docs')
})
app.get('/api/', (c) => {
  return c.redirect('/api/v1/docs')
})

export default app
