import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicons/*'],
      devOptions: {
        enabled: true,
      },
      workbox: {
        navigateFallback: '/index.html',
        cleanupOutdatedCaches: true
      },
    }),
  ],
});