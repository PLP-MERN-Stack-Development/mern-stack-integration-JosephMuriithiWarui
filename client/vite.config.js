import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Any request starting with /api will be proxied to the back-end server
      '/api': {
        target: 'http://localhost:5000', // Matches the server's PORT from .env
        changeOrigin: true,
        secure: false, // Use 'true' if your server is HTTPS
      },
    },
  },
});