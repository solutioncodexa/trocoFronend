import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

function configureSeoProxy(proxy: { on: (event: string, listener: (...args: unknown[]) => void) => void }) {
  proxy.on("proxyReq", (proxyReq, req) => {
    proxyReq.removeHeader("forwarded");
    proxyReq.removeHeader("x-forwarded-proto");
    proxyReq.removeHeader("x-forwarded-host");
    proxyReq.removeHeader("x-forwarded-port");
    try {
      const raw = req.url ?? "";
      const q = raw.includes("?") ? raw.slice(raw.indexOf("?")) : "";
      const tenant = new URLSearchParams(q).get("tenant")?.trim();
      if (tenant) {
        proxyReq.setHeader("X-Fournisseur-Slug", tenant);
      }
    } catch {
      /* ignore malformed URL */
    }
  });
}

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
    /**
     * Même origine pour `<img src="/api/uploads/...">` en dev (Spring `context-path=/api`).
     * SEO : `/sitemap.xml` et `/robots.txt` → backend tenant-aware.
     * En local sans sous-domaine, ajoutez `?tenant=<slug>` (TenantResolutionFilter).
     */
    proxy: {
      "/api": {
        target: "http://127.0.0.1:8080",
        changeOrigin: true,
        secure: false,
        xfwd: false,
        configure(proxy) {
          proxy.on("proxyReq", (proxyReq, req) => {
            proxyReq.removeHeader("forwarded");
            proxyReq.removeHeader("x-forwarded-proto");
            proxyReq.removeHeader("x-forwarded-host");
            proxyReq.removeHeader("x-forwarded-port");
            // changeOrigin remplace Host → le backend ne voit plus troco.localhost.
            // Injecte le slug depuis le Host navigateur si le header n'est pas déjà posé.
            try {
              const existing = proxyReq.getHeader("X-Fournisseur-Slug");
              if (!existing) {
                const rawHost = String(
                  (req as { headers?: { host?: string } }).headers?.host ?? "",
                ).split(":")[0].toLowerCase();
                let slug: string | null = null;
                if (rawHost.endsWith(".localhost")) {
                  const sub = rawHost.slice(0, -".localhost".length);
                  if (sub && !sub.includes(".") && sub !== "www") slug = sub;
                } else {
                  const m = rawHost.match(/^([a-z0-9-]+)\.getstore\./i);
                  if (m?.[1] && m[1] !== "www") slug = m[1];
                }
                if (slug) proxyReq.setHeader("X-Fournisseur-Slug", slug);
              }
            } catch {
              /* ignore */
            }
          });
        },
      },
      "/sitemap.xml": {
        target: "http://127.0.0.1:8080",
        changeOrigin: true,
        secure: false,
        xfwd: false,
        rewrite: () => "/api/sitemap.xml",
        configure(proxy) {
          configureSeoProxy(proxy);
        },
      },
      "/robots.txt": {
        target: "http://127.0.0.1:8080",
        changeOrigin: true,
        secure: false,
        xfwd: false,
        rewrite: () => "/api/robots.txt",
        configure(proxy) {
          configureSeoProxy(proxy);
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
