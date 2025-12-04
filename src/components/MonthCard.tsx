import type { FC } from 'hono/jsx'
import type { MonthData } from '../lib/calendar-generator'

type MonthCardProps = {
  month: MonthData
}

export const MonthCard: FC<MonthCardProps> = ({ month }) => {
  const weekdays = ['Wk', 'Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

  return (
    <div class="bg-white rounded-lg border border-gray-200 p-4">
      <h2 class="text-base font-semibold text-gray-700 text-center mb-1">
        {month.name}
      </h2>
      <table class="w-full border-collapse">
        <thead>
          <tr>
            {weekdays.map(day => (
              <th class={`py-2 text-sm font-medium text-gray-400${day === 'Wk' ? ' w-10' : ''}`}>
                {day}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {month.weeks.map(week => (
            <tr>
              <td class="epiweek-cell py-2 text-center text-sm font-medium text-sky-700 cursor-pointer hover:bg-gray-100 transition-colors rounded" data-epiweek={week.epiweek}>
                {week.week}
              </td>
              {week.days.map(day => (
                <td class={`day-cell text-sm cursor-pointer transition-colors rounded w-8 h-6 text-center leading-6${day.isCurrentMonth ? ' text-gray-900 hover:bg-gray-100' : ' text-gray-300 hover:bg-gray-50'}`} data-date={day.date}>
                  {day.dayNumber}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
