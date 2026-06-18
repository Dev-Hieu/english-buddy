import path from "node:path";
import basicSsl from "@vitejs/plugin-basic-ssl";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// HTTPS + proxy để micro (chấm phát âm) chạy được trên LAN/iPad (secure context),
// đồng thời client gọi same-origin (/api, /pronounce) -> Vite proxy sang backend HTTP.
export default defineConfig({
  plugins: [react(), basicSsl()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: true,
    proxy: {
      "/api": { target: "http://localhost:8787", changeOrigin: true },
      "/pronounce": { target: "http://localhost:8788", changeOrigin: true },
    },
  },
});
