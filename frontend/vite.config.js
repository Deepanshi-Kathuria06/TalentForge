import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "./",
  build: {
    outDir: "dist",
    rollupOptions: {
      external: []
    }
  },
  server: {
    port: 5178,
    proxy: {
      "/api": {
        target: "https://talentforge-w4t2.onrender.com",
        changeOrigin: true,
        secure: false
      }
    }
  }
});
