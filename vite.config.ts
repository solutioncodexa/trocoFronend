import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 4200,
    hmr: {
      overlay: false,
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
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
            if (id.includes("react-dom") || id.includes("/react/")) return "react-vendor";
            if (id.includes("react-router")) return "router";
            if (id.includes("@tanstack/react-query")) return "query";
            if (id.includes("recharts")) return "charts";
            if (id.includes("@radix-ui")) return "radix";
            if (id.includes("lucide-react")) return "icons";
          }
        },
      },
    },
  },
}));
