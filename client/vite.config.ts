import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Forward any request starting with /api to the Express server.
    // The browser only talks to Vite (port 5173), so there are no cross-origin (CORS) issues.
    proxy: {
      '/api': 'http://localhost:3001',
    },
  },
})
