import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Use /coe/ for Contabo server, /coeprogramframework/ for GitHub Pages
  base: process.env.GITHUB_PAGES ? '/coeprogramframework/' : '/coe/',
})
