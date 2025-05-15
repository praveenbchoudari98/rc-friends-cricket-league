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
    emptyOutDir: true,
    assetsDir: '.',
    sourcemap: false,
    rollupOptions: {
      output: {
        assetFileNames: 'rc-friends-cricket-league/[name].[hash][extname]',
        chunkFileNames: 'rc-friends-cricket-league/[name].[hash].js',
        entryFileNames: 'rc-friends-cricket-league/[name].[hash].js'
      },
    },
  },
})
