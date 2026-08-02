import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { resolveTenantSlug } from "@/contexts/TenantContext";
import { readStorefrontThemeCache } from "@/utils/storefrontThemeCache";
import { storeThemeStyleVars } from "@/utils/storeTheme";

/** Applique le thème boutique en cache avant le 1er paint React (anti-FOUC). */
function bootCachedStorefrontTheme() {
  try {
    const slug = resolveTenantSlug();
    if (!slug) return;
    const cached = readStorefrontThemeCache(slug);
    if (!cached) return;
    const root = document.getElementById("root");
    if (!root) return;
    const vars = storeThemeStyleVars(cached) as Record<string, string>;
    for (const [key, value] of Object.entries(vars)) {
      if (value) root.style.setProperty(key, value);
    }
    if (cached.themeKey) {
      root.dataset.storeThemeBoot = cached.themeKey;
    }
  } catch {
    /* ignore */
  }
}

bootCachedStorefrontTheme();

createRoot(document.getElementById("root")!).render(<App />);
