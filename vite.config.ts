import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const backend = process.env.REPOSTER_API_TARGET || 'https://199.246.126.13.sslip.io'
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/v1': {
        target: backend,
        changeOrigin: true,
        secure: true,
        configure(proxy) {
          proxy.on('proxyReq', (request) => request.setHeader('Origin', backend))
        },
      },
    },
  },
})
