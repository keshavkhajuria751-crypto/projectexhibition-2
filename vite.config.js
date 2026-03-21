import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      strategies: 'injectManifest',
      srcDir: 'src',
      filename: 'sw.js',
      injectManifest: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
      },
      devOptions: {
        enabled: true,
        type: "module",
        navigateFallback: 'index.html',
      },
      manifest: {
        name: "SmartBuy AI",
        short_name: "SmartBuy AI",
        description: "SmartBuy AI is price Prediction Intelligence App",
        theme_color: "#EA4335",
        background_color: "#EA4335",
        display: "standalone",
        start_url: "/",
        icons: [
          {
            src: "/pwa-192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "/pwa-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "/pwa-64.png",
            sizes: "64x64",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
    }),
  ],
})
