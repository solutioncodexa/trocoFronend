import { Link, Outlet, useLocation, useParams } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import {
  STORE_THEMES,
  getThemeDefinition,
  normalizeThemeKey,
  type StoreThemeKey,
} from '@/config/storeThemes';
import { DesignDemoProvider, useDesignDemoRequired } from '@/demo/DesignDemoContext';
import { ArrowLeft, ExternalLink } from 'lucide-react';

const DEMO_PAGES = [
  { path: '', label: 'Accueil' },
  { path: '/boutique', label: 'Boutique' },
  { path: '/produit/demo-1', label: 'Produit' },
  { path: '/panier', label: 'Panier' },
  { path: '/favoris', label: 'Favoris' },
  { path: '/sur-mesure', label: 'Sur-mesure' },
  { path: '/contact', label: 'Contact' },
  { path: '/faq', label: 'FAQ' },
  { path: '/livraison-retours', label: 'Livraison' },
] as const;

/**
 * Shell démo design — navigation multi-pages + mock data.
 */
const DesignDemo = () => {
  const { themeKey: raw } = useParams<{ themeKey: string }>();
  const themeKey = normalizeThemeKey(raw);

  return (
    <DesignDemoProvider themeKey={themeKey}>
      <DesignDemoChrome themeKey={themeKey} />
    </DesignDemoProvider>
  );
};

function DesignDemoChrome({ themeKey }: { themeKey: StoreThemeKey }) {
  const demo = useDesignDemoRequired();
  const theme = getThemeDefinition(themeKey);
  const location = useLocation();
  const pathSuffix =
    location.pathname.replace(/^\/design-demo\/[^/]+/, '') || '';

  return (
    <>
      <div className="fixed inset-x-0 top-0 z-[70] border-b border-black/10 bg-[hsl(220_22%_12%)] text-white shadow-lg">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-3 py-2 sm:px-6">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/50">
                Démo design · données fictives
              </p>
              <p className="truncate font-display text-sm font-semibold sm:text-base">
                {theme.label} — {theme.demoSiteName}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-1.5">
              {STORE_THEMES.map((t) => (
                <Link
                  key={t.key}
                  to={`/design-demo/${t.key}${pathSuffix}${location.search}`}
                  className={`rounded-full px-2.5 py-1 text-[11px] font-medium transition sm:text-xs ${
                    t.key === themeKey
                      ? 'bg-white text-[hsl(220_22%_12%)]'
                      : 'bg-white/10 text-white/80 hover:bg-white/20'
                  }`}
                >
                  {t.label}
                </Link>
              ))}
              <Button size="sm" variant="secondary" className="h-8 gap-1 text-xs" asChild>
                <Link to="/admin/parametres">
                  <ArrowLeft className="h-3.5 w-3.5" />
                  Paramètres
                </Link>
              </Button>
              <Button size="sm" className="h-8 gap-1 text-xs" asChild>
                <Link to={`/admin/parametres?applyTheme=${themeKey}`}>
                  <ExternalLink className="h-3.5 w-3.5" />
                  Appliquer
                </Link>
              </Button>
            </div>
          </div>
          <nav className="flex gap-1 overflow-x-auto pb-0.5 scrollbar-thin" aria-label="Pages démo">
            {DEMO_PAGES.map((p) => (
              <Link
                key={p.path || 'home'}
                to={`${demo.basePath}${p.path}`}
                className="shrink-0 rounded-md bg-white/10 px-2.5 py-1 text-[11px] font-medium text-white/85 hover:bg-white/20"
              >
                {p.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      <Layout forceThemeKey={themeKey} forceBrand={demo.brand}>
        <Outlet />
      </Layout>
    </>
  );
}

export default DesignDemo;
