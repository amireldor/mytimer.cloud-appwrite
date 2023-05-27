/// <reference types="vitest" />
import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    solidPlugin(),
    VitePWA({
      srcDir: "src",
      filename: "serviceWorker.ts",
      strategies: "injectManifest",
      injectRegister: false,
      manifest: false,
      devOptions: {
        enabled: true,
      },
      injectManifest: {
        injectionPoint: undefined,
      },
    }),
  ],
  test: {
    setupFiles: ["./src/tests/setup.ts"],
  },
});
