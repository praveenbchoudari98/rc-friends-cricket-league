import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/rc-friends-cricket-league/',
  server: {
    port: 5175,
  },
  build: {
    outDir: 'dist',
    assetsDir: '',
    sourcemap: false,
    rollupOptions: {
      output: {
        assetFileNames: `[name].[hash][extname]`,
        chunkFileNames: `[name].[hash].js`,
        entryFileNames: `[name].[hash].js`,
      },
    },
  },
})
