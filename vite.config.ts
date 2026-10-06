// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  nitro: {
    preset: process.env["VERCEL"] ? "vercel" : "node-server",
    // @ts-expect-error: routeRules is a valid Nitro config but not fully typed in the lovable wrapper
    routeRules: {
      "/api/**": {
        cors: true,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
      },
    },
  },
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
  vite: {
    plugins: [
      VitePWA({
        registerType: "autoUpdate",
        injectRegister: null,
        filename: "sw.js",
        devOptions: { enabled: false },
        manifest: false,
        workbox: {
          importScripts: ["/push-sw.js"],
          // Nitro outputs to .output/public/, not dist/ — disable static precache
          // glob to avoid Workbox "no files matched" warning. All assets are
          // covered by runtimeCaching below.
          globPatterns: [],
          navigateFallbackDenylist: [/^\/~oauth/, /^\/api\//],

          runtimeCaching: [
            {
              // HTML navigations: always try the network first.
              urlPattern: ({ request }: { request: Request }) => request.mode === "navigate",
              handler: "NetworkFirst",
              options: { cacheName: "airsense-pages", networkTimeoutSeconds: 4 },
            },
            {
              // Live sensor data: network first, fall back to the last cached reading.
              urlPattern: ({ url }: { url: URL }) => url.pathname.startsWith("/api/"),
              handler: "NetworkFirst",
              options: {
                cacheName: "airsense-api",
                networkTimeoutSeconds: 5,
                expiration: { maxEntries: 60, maxAgeSeconds: 60 * 60 * 24 },
              },
            },
            {
              // Hashed static assets.
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
