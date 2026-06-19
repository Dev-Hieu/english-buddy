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
      "/picker": { target: "http://localhost:8787", changeOrigin: true },
    },
  },
  build: {
    chunkSizeWarningLimit: 1200,
    rollupOptions: {
      output: {
        // Tách dữ liệu từ vựng/ảnh và vendor thành chunk riêng -> cache tốt, app code nhẹ hơn.
        manualChunks(id) {
          if (id.includes("/src/data/")) return "vocab-data";
          if (id.includes("node_modules/react") || id.includes("node_modules/scheduler")) return "react";
          if (id.includes("node_modules")) return "vendor";
        },
      },
    },
  },
});
