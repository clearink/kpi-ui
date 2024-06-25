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
      { find: '_components', replacement: resolve(target, 'src/_shared/components') },
      { find: '_constants', replacement: resolve(target, 'src/_shared/constants') },
      { find: '_contexts', replacement: resolve(target, 'src/_shared/contexts') },
      { find: '_hooks', replacement: resolve(target, 'src/_shared/hooks') },
      { find: '_utils', replacement: resolve(target, 'src/_shared/utils') },
    ],
  },
})
