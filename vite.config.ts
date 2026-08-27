import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/pixel-stock-dashboard/',
  server: {
    port: 7100,
  },
})
