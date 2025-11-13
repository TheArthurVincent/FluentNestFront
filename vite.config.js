import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  server: {
    allowedHosts: ["arvin.rafascripts.dev.br"],
  },
  preview: {
    allowedHosts: ["arvin.rafascripts.dev.br"],
  },
  plugins: [
    react(),
    VitePWA({
      includeAssets: ["favicon.svg", "icons/*.png", "screenshots/*.png"],
      manifest: {
        name: "ARVIN - Plataforma de Ensino",
        short_name: "ARVIN",
        description: "ARVIN - Plataforma de Ensino",
        theme_color: "#000000",
        background_color: "#ffffff",
        display: "standalone",
        orientation: "portrait-primary",
        start_url: "/",
        icons: [
          {
            src: "pwa-64x64.png",
            sizes: "64x64",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "pwa-144x144.png",
            sizes: "144x144",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "maskable-icon-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
        screenshots: [
          {
            src: "/screenshots/screenshots.png",
            sizes: "1280x720",
            type: "image/png",
          },
          {
            src: "/screenshots/screenshots.png",
            sizes: "1920x1080",
            type: "image/png",
            form_factor: "wide",
          },
        ],
      },
      workbox: {
        cleanupOutdatedCaches: true,
        sourcemap: true,

        // NÃO cachear requisições do OneSignal e APIs
        navigateFallbackDenylist: [/^\/api/, /onesignal/],
        runtimeCaching: [
          {
            // Cachear assets estáticos
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "google-fonts-cache",
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365, // 1 ano
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          {
            // NÃO cachear OneSignal
            urlPattern: /onesignal\.com/i,
            handler: "NetworkOnly",
          },
          {
            // NÃO cachear APIs
            urlPattern: /\/api\//i,
            handler: "NetworkOnly",
          },
        ],

        globPatterns: ["**/*.{js,css,html,png,svg,ico,jpg,jpeg,json}"],

        // Excluir arquivos do OneSignal do cache do Workbox
        globIgnores: ["**/OneSignalSDK*.js"],

        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, // 5 MB
      },
      devOptions: {
        enabled: true,
      },

      // Registrar automaticamente o SW
      registerType: "autoUpdate",

      // Desabilitar injeção do registro do SW (vamos fazer manualmente se necessário)
      injectRegister: "auto",
    }),
  ],
});
