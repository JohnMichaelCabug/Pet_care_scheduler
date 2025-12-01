import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
      manifest: {
        name: "Pet Care Scheduler",
        short_name: "PetCare",
        description: "Pet care scheduling system (PWA-ready).",
        theme_color: "#0ea5a4",
        background_color: "#ffffff",
        display: "standalone",
        start_url: "/index.html",
        icons: [
          {
            src: "/icons/apple-touch-icon.png",
            sizes: "180x180",
            type: "image/png",
            purpose: "any"
          },
          {
            src: "/icons/icon-144x144.png",
            sizes: "144x144",
            type: "image/png",
            purpose: "any"
          },
          {
            src: "/icons/icon-192x192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any"
          },
          {
            src: "/icons/icon-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any"
          }
        ],
        screenshots: [
          {
            src: "/screenshots/home-mobile.png",
            sizes: "540x960",
            type: "image/png",
            form_factor: "narrow"
          },
          {
            src: "/screenshots/home-desktop.png",
            sizes: "1920x1080",
            type: "image/png",
            form_factor: "wide"
          }
        ]
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,png,svg,jpg,jpeg}"],
      },
    })
  ],
  // Allow GIFs if you still use them
  assetsInclude: ["**/*.gif"]
});
