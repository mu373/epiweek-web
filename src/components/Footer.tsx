import type { FC } from 'hono/jsx'

export const Footer: FC = () => {
  return (
    <footer class="mt-12 text-center text-sm text-gray-500">
      <div class="flex items-center justify-center gap-3">
        <a href="https://github.com/mu373/epiweek-web" target="_blank" rel="noopener noreferrer" class="underline hover:text-gray-700 transition-colors">GitHub</a>
        <span>|</span>
        <a href="/api/v1/docs" class="underline hover:text-gray-700 transition-colors">API Documentation</a>
      </div>
      <div class="mt-1">
        Epiweek calculation is powered by <a href="https://github.com/mu373/epiweek" target="_blank" rel="noopener noreferrer" class="underline hover:text-gray-700 transition-colors">@mu373/epiweek</a>.
      </div>
    </footer>
  )
}
