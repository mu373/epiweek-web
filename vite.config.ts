import { defineConfig } from 'vite'
import devServer from '@hono/vite-dev-server'

export default defineConfig({
  plugins: [
    devServer({
      entry: 'src/dev.tsx',
    }),
  ],
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
})
