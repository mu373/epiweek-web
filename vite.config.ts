import { defineConfig } from 'vite'
import devServer from '@hono/vite-dev-server'

export default defineConfig({
  plugins: [
    devServer({
      entry: 'src/app.tsx',
    }),
  ],
  build: {
    lib: {
      entry: 'src/app.tsx',
      formats: ['es'],
      fileName: 'app',
    },
    rollupOptions: {
      external: ['hono', '@hono/zod-openapi', '@hono/swagger-ui', '@mu373/epiweek', 'luxon'],
    },
    outDir: 'dist',
  },
})
