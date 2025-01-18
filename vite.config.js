import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
 
  build: {
    outDir: 'build',  // Optional: change output directory from 'dist' to 'build'
    cssMinify: true,  // Optional: ensure CSS is minified
  },
   
  plugins: [react()],
})
