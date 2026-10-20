import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'icons/app-icon.svg'],
      manifest: {
        name: 'Momentum — Personal Tasks',
        short_name: 'Momentum',
        description: 'A private, fast, offline-first personal task manager.',
        theme_color: '#6d5dfc',
        background_color: '#f7f7fb',
        display: 'standalone',
        orientation: 'portrait-primary',
        scope: '/',
        start_url: '/',
        categories: ['productivity', 'utilities'],
        icons: [
          {
            src: '/icons/app-icon.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,woff2}'],
        cleanupOutdatedCaches: true,
        navigateFallback: 'index.html'
      },
      devOptions: { enabled: true }
    })
  ],
  build: { target: 'es2020' }
})
