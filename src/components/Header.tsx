import type { FC } from 'hono/jsx'

type HeaderProps = {
  year: number
}

export const Header: FC<HeaderProps> = ({ year }) => {
  const currentYear = new Date().getFullYear()
  const yearOptions = Array.from({ length: 21 }, (_, i) => currentYear - 10 + i)

  return (
    <header class="flex items-center justify-center gap-4 mb-8">
      <button id="prev-year" class="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-600 hover:text-gray-900">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
        </svg>
      </button>
      <div class="flex items-center gap-3">
        <a href="/" class="text-2xl font-semibold text-gray-900 hover:text-gray-600 transition-colors">Epiweek Calendar</a>
        <select id="year-select" class="text-lg font-medium px-3 py-1.5 border border-gray-300 rounded-lg bg-white hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 cursor-pointer transition-colors">
          {yearOptions.map(y => (
            <option value={y} selected={y === year}>
              {y}
            </option>
          ))}
        </select>
      </div>
      <button id="next-year" class="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-600 hover:text-gray-900">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
        </svg>
      </button>
    </header>
  )
}
