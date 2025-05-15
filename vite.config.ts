import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig(({ command }) => ({
  plugins: [react()],
  base: command === 'serve' ? '/' : '/rc-friends-cricket-league/',
  server: {
    port: 5175,
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: false,
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          if (command === 'serve') {
            return 'assets/[name].[hash][extname]'
          }
          return 'assets/[name].[hash][extname]'
        },
        chunkFileNames: (chunkInfo) => {
          if (command === 'serve') {
            return 'assets/[name].[hash].js'
          }
          return 'assets/[name].[hash].js'
        },
        entryFileNames: (chunkInfo) => {
          if (command === 'serve') {
            return 'assets/[name].[hash].js'
          }
          return 'assets/[name].[hash].js'
        }
      },
    },
  },
}))
