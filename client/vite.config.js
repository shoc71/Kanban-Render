import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  build: {
    outDir: 'client/build',  // Make sure the build output is here
  },
  plugins: [react()],
})
