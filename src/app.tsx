import { Hono } from 'hono'
import { Layout } from './components/Layout.js'
import { CalendarGrid } from './components/CalendarGrid.js'
import { generateYearCalendarData } from './lib/calendar-generator.js'

const app = new Hono()

// Fallback calendar routes (for years not pre-generated as static)
app.get('/', (c) => {
  const currentYear = new Date().getFullYear()
  const yearData = generateYearCalendarData(currentYear)

  return c.html(
    <Layout year={currentYear}>
      <CalendarGrid months={yearData.months} />
    </Layout>
  )
})

app.get('/:year', (c) => {
  const year = parseInt(c.req.param('year'))

  // Validate year (1900-2100)
  if (isNaN(year) || year < 1900 || year > 2100) {
    return c.redirect('/')
  }

  const yearData = generateYearCalendarData(year)

  return c.html(
    <Layout year={year}>
      <CalendarGrid months={yearData.months} />
    </Layout>
  )
})

export default app
