import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { existsSync, readdirSync } from 'node:fs'

// Multi-page build: index.html plus every projects/<slug>/index.html, found automatically,
// so GitHub Pages serves clean URLs with no router.
const projectPages = Object.fromEntries(
  readdirSync('projects', { withFileTypes: true })
    .filter((d) => d.isDirectory() && existsSync(`projects/${d.name}/index.html`))
    .map((d) => [d.name, `projects/${d.name}/index.html`]),
)

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: { home: 'index.html', ...projectPages },
    },
  },
})
