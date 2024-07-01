import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import eslint from 'vite-plugin-eslint'
import { constants } from '@kpi-ui/scripts'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), eslint()],
  resolve: {
    alias: [
      { find: '@', replacement: constants.resolveComps('src') },
      { find: '_shared', replacement: constants.resolveComps('src', '_shared') },
    ],
  },
})
