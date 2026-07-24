import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(() => ({
  server: {
    host: "::",
    port: 4200,
    // Tunnels publics (Cloudflare / ngrok) pour démo temporaire
    allowedHosts: true,
    hmr: {
      overlay: false,
    },
    /** Même origine pour `<img src="/api/uploads/...">` en dev (Spring `context-path=/api`). */
    proxy: {
      "/api": {
        target: "http://127.0.0.1:8080",
        changeOrigin: true,
        secure: false,
        xfwd: false,
        configure(proxy) {
          proxy.on("proxyReq", (proxyReq) => {
            proxyReq.removeHeader("forwarded");
            proxyReq.removeHeader("x-forwarded-proto");
            proxyReq.removeHeader("x-forwarded-host");
            proxyReq.removeHeader("x-forwarded-port");
          });
        },
      },
    },
  },
  plugins: [react()],
  optimizeDeps: {
    include: ["recharts"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            // Recharts avec React (pas de chunk "charts" dédié : évite erreurs runtime Vite/Rollup)
            if (id.includes("react-dom") || id.includes("/react/") || id.includes("recharts")) {
              return "react-vendor";
            }
            if (id.includes("react-router")) return "router";
            if (id.includes("@tanstack/react-query")) return "query";
            if (id.includes("@radix-ui")) return "radix";
            if (id.includes("lucide-react")) return "icons";
          }
        },
      },
    },
  },
}));
