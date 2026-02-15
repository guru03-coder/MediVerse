import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/predict': 'http://localhost:8000',
      '/patients': 'http://localhost:8000',
      '/dashboard/stats': 'http://localhost:8000',
      '/dashboard/analytics': 'http://localhost:8000',
      '/doctor': 'http://localhost:8000',
      '/departments': 'http://localhost:8000',
      '/docs': 'http://localhost:8000',
      '/openapi.json': 'http://localhost:8000'
    }
  }
})
