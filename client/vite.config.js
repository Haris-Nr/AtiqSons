import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { nodePolyfills } from 'vite-plugin-node-polyfills'


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    nodePolyfills(),
    react(),
  ],

  resolve: {
    alias: {
      "readable-stream": "vite-compatible-readable-stream"
    },
  },

  
  // optimizeDeps: {
  //   exclude: ['js-big-decimal']
  // }
  
})
