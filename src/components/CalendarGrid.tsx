import type { FC } from 'hono/jsx'
import { MonthCard } from './MonthCard.js'
import type { MonthData } from '../lib/calendar-generator.js'

type CalendarGridProps = {
  months: MonthData[]
}

export const CalendarGrid: FC<CalendarGridProps> = ({ months }) => {
  return (
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {months.map(month => (
        <MonthCard month={month} />
      ))}
    </div>
  )
}
