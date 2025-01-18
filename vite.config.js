import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
 
  build: {
   rollupOptions: {
      external: ['jszip'],  // This tells Vite not to bundle jszip and to expect it externally
    },
    outDir: 'build',  // Optional: change output directory from 'dist' to 'build'
    cssMinify: true,  // Optional: ensure CSS is minified
  },
   
  plugins: [react()],
})
