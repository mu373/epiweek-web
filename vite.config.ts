import { defineConfig, loadEnv } from 'vite'
import devServer from '@hono/vite-dev-server'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const allowedHosts = env.VITE_ALLOWED_HOSTS?.split(',').map(h => h.trim()).filter(Boolean) ?? []

  return {
    plugins: [
      devServer({
        entry: 'src/dev.tsx',
      }),
    ],
    server: {
      allowedHosts,
    },
    build: {
      lib: {
        entry: {
          api: 'src/api.tsx',
          app: 'src/app.tsx',
        },
        formats: ['es'],
      },
      rollupOptions: {
        external: ['hono', '@hono/zod-openapi', '@hono/swagger-ui', '@mu373/epiweek', 'luxon'],
      },
      outDir: 'dist',
    },
  }
})
