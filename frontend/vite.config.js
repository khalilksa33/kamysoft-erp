import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    /* VitePWA disabled temporarily */
  ],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8089',
        changeOrigin: true,
        secure: false
      },
      '/uploads': {
        target: 'http://localhost:8089',
        changeOrigin: true,
        secure: false
      }
    }
  }
});
