import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import eslint from 'vite-plugin-eslint'
import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const target = resolve(__dirname, '../kpi-components')
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), eslint()],
  resolve: {
    alias: [
      { find: '@', replacement: resolve(target, 'src') },
      { find: '_shared', replacement: resolve(target, 'src/_shared') },
    ],
  },
})
