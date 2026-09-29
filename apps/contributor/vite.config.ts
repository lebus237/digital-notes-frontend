import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    port: 3002,
    proxy: {
      '/api': {
        target: process.env.VITE_API_ENDPOINT ?? 'http://localhost:3333',
        changeOrigin: true,
      },
    },
  },
  resolve: { tsconfigPaths: true },
  plugins: [tanstackStart({ router: { routesDirectory: 'app/routes' } }), react()],
})
