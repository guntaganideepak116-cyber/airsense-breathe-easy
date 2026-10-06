import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  nitro: {
    preset: process.env["VERCEL"] ? "vercel" : "node-server",
  },
  tanstackStart: {
    server: { entry: "server" },
  },
  vite: {
    server: {
      proxy: {
        "/api": {
          target: process.env["VITE_API_URL"] || "http://localhost:5000",
          changeOrigin: true,
        },
      },
    },
    plugins: [
      VitePWA({
        registerType: "autoUpdate",
        injectRegister: null,
        filename: "sw.js",
        devOptions: { enabled: false },
        manifest: false,
        workbox: {
          importScripts: ["/push-sw.js"],
          globPatterns: [],
          navigateFallbackDenylist: [/\/api\//],
          runtimeCaching: [
            {
              urlPattern: ({ request }: { request: Request }) => request.mode === "navigate",
              handler: "NetworkFirst",
              options: { cacheName: "airsense-pages", networkTimeoutSeconds: 4 },
            },
            {
              urlPattern: ({ url }: { url: URL }) => url.pathname.startsWith("/api/"),
              handler: "NetworkFirst",
              options: {
                cacheName: "airsense-api",
                networkTimeoutSeconds: 5,
                expiration: { maxEntries: 60, maxAgeSeconds: 60 * 60 * 24 },
              },
            },
            {
              urlPattern: ({ url, request }: { url: URL; request: Request }) =>
                url.origin === self.location.origin &&
                ["style", "script", "font", "image"].includes(request.destination),
              handler: "CacheFirst",
              options: {
                cacheName: "airsense-assets",
                expiration: { maxEntries: 120, maxAgeSeconds: 60 * 60 * 24 * 30 },
              },
            },
          ],
        },
      }),
    ],
  },
});
