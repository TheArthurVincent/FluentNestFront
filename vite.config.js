import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from 'vite-plugin-pwa';
export default defineConfig({
  server:{
    allowHosts: [
      "arvin.rafascripts.dev.br"
    ]
  },
  preview:{
    allowedHosts: [
      "arvin.rafascripts.dev.br"
    ]
  },
  plugins: [
      react(),
      VitePWA({
        includeAssets: ['favicon.svg', 'icons/*.png', 'screenshots/*.png'],
        manifest: {
          name: 'ARVIN - Inglês de Negócios',
          short_name: 'ARVIN',
          description: 'ARVIN - Plataforma de Inglês de Negócios',
          theme_color: '#000000',
          background_color: '#ffffff',
          display: 'standalone',
          orientation: 'portrait-primary',
          start_url: '/',
          icons: [
            {
              src: "pwa-64x64.png",
              sizes: "64x64",
              type: "image/png",
              purpose: "any"
            },
            {
              src: "pwa-144x144.png",
              sizes: "144x144",
              type: "image/png",
              purpose: "any"
            },
            {
              src: "pwa-192x192.png",
              sizes: "192x192",
              type: "image/png",
              purpose: "any"
            },
            {
              src: "pwa-512x512.png",
              sizes: "512x512",
              type: "image/png",
              purpose: "any"
            },
            {
              src: "maskable-icon-512x512.png",
              sizes: "512x512",
              type: "image/png",
              purpose: "maskable"
            }
          ],
          screenshots: [
            {
              src: '/screenshots/screenshots.png',
              sizes: '1280x720',
              type: 'image/png'
            },
            {
              src: '/screenshots/screenshots.png',
              sizes: '1920x1080',
              type: 'image/png',
              form_factor: 'wide'
            }
          ]
        },
        workbox: {
          cleanupOutdatedCaches: true,
          sourcemap: true,
          globPatterns: ['**/*.{js,css,html,png,svg,ico,jpg,jpeg,json}'],
          maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, // 5 MB
        },
        devOptions: {
          enabled: true
        }
      })
  ],
});
