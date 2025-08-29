//vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
      react(),
    tailwindcss(),],
  server: {
    proxy: {
     // '/api': 'http://localhost:8081'
        '/api': 'http://ec2-13-51-207-0.eu-north-1.compute.amazonaws.com:8081'
    }
  },
  define: {
    global: 'window',
  },

  build: {
    // This tells Vite where to put the built files.
    // The path is relative to the frontend project root.
    outDir: '../backend/QuizBackend/src/main/resources/static',
    // This ensures the directory is cleared before each new build.
    emptyOutDir: true,
  },
})
