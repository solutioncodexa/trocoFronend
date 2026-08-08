import { ReactNode, useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Palette,
  Star,
  MessageSquare,
  Image as ImageIcon,
  Ticket,
  FolderOpen,
  ChevronRight,
  LogOut,
  ExternalLink,
  Menu,
  X,
  Warehouse,
  TrendingUp,
  Share2,
  Users,
  History,
  Shield,
  BookOpen,
  Inbox,
  TimerReset,
  LayoutPanelLeft,
  PanelLeftClose,
  PanelLeftOpen,
  Webhook,
  Key,
  Truck,
  Store,
  Settings2,
  FileText,
  Wand2,
  PenTool,
} from 'lucide-react';
import AdminNotification from './AdminNotification';
import StockAlertDialog from './StockAlertDialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAdmin } from '@/contexts/AdminContext';
import { useTenant } from '@/contexts/TenantContext';
import { PERMISSIONS } from '@/config/permissions';
import { cn } from '@/lib/utils';
import { BrandLogoImg } from '@/components/layout/BrandLogoImg';
import { useStoreBrand } from '@/hooks/useStoreBrand';
import { buildFreshStorefrontUrl } from '@/utils/storefrontUrl';
import { applyDocumentBrand } from '@/utils/storeTheme';

interface AdminLayoutProps {
  children: ReactNode;
  title: string;
  breadcrumbs?: { label: string; href?: string }[];
  /** Sous-titre optionnel sous le titre */
  description?: string;
  /** Actions à droite du header de page */
  actions?: ReactNode;
  /**
   * Atelier plein écran (ex. page builder) :
   * contenu sans max-width / padding, hauteur utile pour 3 panneaux.
   */
  workspace?: boolean;
  /** Contenu plus large (ex. paramètres + aperçu côte à côte). */
  wide?: boolean;
  /** Contrôle externe de la sidebar admin (masquer / afficher). */
  sidebarOpen?: boolean;
  onSidebarOpenChange?: (open: boolean) => void;
}

type NavItem = {
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
  permission?: string;
  adminOnly?: boolean;
};

type NavSection = { label: string; items: NavItem[] };

const ALL_NAV: NavSection[] = [
  {
    label: 'Vue d’ensemble',
    items: [
      { href: '/admin/dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
      { href: '/admin/revenus', label: 'Revenus', icon: TrendingUp, permission: PERMISSIONS.STATS_VIEW },
    ],
  },
  {
    label: 'Ventes',
    items: [
      { href: '/admin/commandes', label: 'Commandes', icon: ShoppingCart, permission: PERMISSIONS.ORDERS_VIEW },
      { href: '/admin/paniers-abandonnes', label: 'Paniers abandonnés', icon: TimerReset, permission: PERMISSIONS.ORDERS_VIEW },
      { href: '/admin/personnalisations', label: 'Devis / Sur-mesure', icon: PenTool, permission: PERMISSIONS.CUSTOM_ORDERS_VIEW },
      { href: '/admin/stock', label: 'Stock', icon: Warehouse, permission: PERMISSIONS.STOCK_VIEW },
    ],
  },
  {
    label: 'Catalogue',
    items: [
      { href: '/admin/produits', label: 'Produits', icon: Package, permission: PERMISSIONS.PRODUCTS_VIEW },
      { href: '/admin/categories', label: 'Catégories', icon: FolderOpen, permission: PERMISSIONS.CATALOG_MANAGE },
    ],
  },
  {
    label: 'Boutique en ligne',
    items: [
      { href: '/admin/boutique-en-ligne', label: 'Vue d’ensemble', icon: Store },
      { href: '/admin/parametres', label: 'Apparence', icon: Palette, adminOnly: true },
      { href: '/admin/pages', label: 'Pages', icon: FileText },
      { href: '/admin/sections', label: 'Navigation', icon: LayoutPanelLeft },
      { href: '/admin/top-bar-messages', label: 'Bandeau', icon: MessageSquare, permission: PERMISSIONS.CONTENT_MANAGE },
      { href: '/admin/onboarding', label: 'Assistant', icon: Wand2, adminOnly: true },
    ],
  },
  {
    label: 'Boutique',
    items: [
      { href: '/admin/reglages', label: 'Paramètres', icon: Settings2, adminOnly: true },
    ],
  },
  {
    label: 'Marketing',
    items: [
      { href: '/admin/promo-modals', label: 'Pop-ups promo', icon: ImageIcon, permission: PERMISSIONS.CONTENT_MANAGE },
      { href: '/admin/codes-promo', label: 'Codes promo', icon: Ticket, permission: PERMISSIONS.CONTENT_MANAGE },
      { href: '/admin/blog', label: 'Blog', icon: BookOpen },
      { href: '/admin/leads', label: 'Clients / Leads', icon: Inbox },
      { href: '/admin/avis', label: 'Avis', icon: Star, permission: PERMISSIONS.CONTENT_MANAGE },
      { href: '/admin/reseaux-sociaux', label: 'Réseaux sociaux', icon: Share2, permission: PERMISSIONS.CONTENT_MANAGE },
    ],
  },
  {
    label: 'Intégrations',
    items: [
      { href: '/admin/webhooks', label: 'Webhooks', icon: Webhook, permission: PERMISSIONS.WEBHOOKS_MANAGE },
      { href: '/admin/api-keys', label: 'Clés API', icon: Key, permission: PERMISSIONS.API_KEYS_MANAGE },
    ],
  },
  {
    label: 'Conformité',
    items: [
      { href: '/admin/conformite', label: 'Données personnelles', icon: Shield, permission: PERMISSIONS.PRIVACY_MANAGE },
      { href: '/admin/livraison', label: 'Livraison', icon: Truck, permission: PERMISSIONS.ORDERS_VIEW },
    ],
  },
  {
    label: 'Équipe',
    items: [
      { href: '/admin/membres', label: 'Membres', icon: Users, adminOnly: true },
      { href: '/admin/audit', label: 'Journal d’audit', icon: History, permission: PERMISSIONS.AUDIT_VIEW },
    ],
  },
];

function statusBadge(status?: string | null) {
  const s = (status || '').toUpperCase();
  if (s === 'ACTIVE' || s === 'TRIAL') {
    return <Badge className="bg-emerald-600 hover:bg-emerald-600 text-[10px]">Active</Badge>;
  }
  if (s === 'PENDING') {
    return (
      <Badge variant="outline" className="border-amber-500 text-amber-700 text-[10px]">
        En attente
      </Badge>
    );
  }
  if (s === 'SUSPENDED') {
    return <Badge variant="destructive" className="text-[10px]">Suspendue</Badge>;
  }
  return s ? <Badge variant="secondary" className="text-[10px]">{s}</Badge> : null;
}

const AdminLayout = ({
  children,
  title,
  breadcrumbs,
  description,
  actions,
  workspace = false,
  wide = false,
  sidebarOpen: sidebarOpenProp,
  onSidebarOpenChange,
}: AdminLayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, isAuthenticated, isAdmin, isSuperAdmin, hasPermission, user } = useAdmin();
  const { store } = useTenant();
  const { siteName, logoUrl, slug } = useStoreBrand();
  const storefrontUrl = buildFreshStorefrontUrl(slug || store?.slug);
  const [sidebarOpenInternal, setSidebarOpenInternal] = useState(() => window.innerWidth >= 1024);
  const isSidebarOpen = sidebarOpenProp ?? sidebarOpenInternal;
  const setIsSidebarOpen = (open: boolean) => {
    if (sidebarOpenProp === undefined) setSidebarOpenInternal(open);
    onSidebarOpenChange?.(open);
  };

  // Favicon / titre : branding boutique. Sur Apparence, le workspace applique le brouillon.
  useEffect(() => {
    if (!store) return;
    if (location.pathname.startsWith('/admin/parametres')) return;
    applyDocumentBrand({
      siteName: store.siteName,
      tagline: store.tagline,
      logoUrl: store.logoUrl,
      faviconUrl: store.faviconUrl?.trim() || store.logoUrl,
    });
    return () => applyDocumentBrand(null);
  }, [
    location.pathname,
    store?.siteName,
    store?.tagline,
    store?.logoUrl,
    store?.faviconUrl,
    store,
  ]);

  const navSections = useMemo(() => {
    return ALL_NAV.map((section) => ({
      ...section,
      items: section.items.filter((item) => {
        if (item.adminOnly) return isAdmin;
        if (!item.permission) return true;
        return hasPermission(item.permission);
      }),
    })).filter((s) => s.items.length > 0);
  }, [hasPermission, isAdmin]);

  if (!isAuthenticated) {
    navigate('/admin');
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate('/admin');
  };

  const isActive = (href: string) =>
    location.pathname === href || location.pathname.startsWith(`${href}/`);

  return (
    <div className="flex h-screen min-h-0 overflow-hidden bg-[hsl(220_20%_97%)]">
      <StockAlertDialog />
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-foreground/40 backdrop-blur-sm lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
          aria-hidden
        />
      )}

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex h-full w-[17.5rem] flex-col border-r border-border/70 bg-[hsl(220_22%_12%)] text-white shadow-elegant transition-transform duration-300 ease-premium',
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="flex h-[4.25rem] shrink-0 items-center justify-between border-b border-white/10 px-4">
          <Link
            to="/admin/dashboard"
            className="flex min-w-0 items-center gap-2.5"
            aria-label={`${siteName} — tableau de bord`}
          >
            {logoUrl ? (
              <span className="flex h-10 items-center rounded-lg bg-white px-2">
                <BrandLogoImg className="h-8 w-auto max-w-[9.5rem]" draggable={false} />
              </span>
            ) : (
              <span className="truncate font-display text-base font-semibold tracking-tight">
                {siteName || 'Ma boutique'}
              </span>
            )}
          </Link>
          <button
            type="button"
            className="rounded-lg p-2 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
            onClick={() => setIsSidebarOpen(false)}
            aria-label="Masquer le menu"
            title="Masquer le menu"
          >
            <PanelLeftClose className="hidden h-5 w-5 lg:block" />
            <X className="h-5 w-5 lg:hidden" />
          </button>
        </div>

        <div className="border-b border-white/10 px-4 py-3">
          <div className="flex items-center justify-between gap-2">
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-white">{siteName || 'Boutique'}</p>
              <p className="truncate text-[11px] text-white/50">{slug ? `${slug}.…` : 'Espace vendeur'}</p>
            </div>
            {statusBadge(store?.status)}
          </div>
        </div>

        <nav className="min-h-0 flex-1 space-y-5 overflow-y-auto overscroll-contain p-3 scrollbar-app">
          {navSections.map((section) => (
            <div key={section.label}>
              <p className="mb-1.5 px-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/40">
                {section.label}
              </p>
              <div className="space-y-0.5">
                {section.items.map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={() => {
                      if (window.innerWidth < 1024) setIsSidebarOpen(false);
                    }}
                    className={cn(
                      'flex items-center gap-3 rounded-xl px-3 py-2.5 font-body text-sm transition-all duration-200',
                      isActive(item.href)
                        ? 'bg-primary text-primary-foreground shadow-soft font-medium'
                        : 'text-white/70 hover:bg-white/8 hover:text-white',
                    )}
                  >
                    <item.icon className="h-4 w-4 shrink-0 opacity-90" />
                    <span className="truncate">{item.label}</span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </nav>

        <div className="shrink-0 space-y-1.5 border-t border-white/10 p-3">
          <div className="rounded-xl bg-white/5 px-3 py-2.5">
            <p className="truncate text-xs font-medium text-white">{user?.fullName || user?.email}</p>
            <p className="text-[10px] uppercase tracking-wide text-white/45">{user?.role}</p>
          </div>
          {isSuperAdmin ? (
            <Button
              variant="ghost"
              className="w-full justify-start gap-2 text-white/75 hover:bg-white/10 hover:text-white"
              asChild
            >
              <Link to="/super-admin/dashboard">
                <Shield className="h-4 w-4" />
                Super Admin
              </Link>
            </Button>
          ) : null}
          <Button
            variant="ghost"
            className="w-full justify-start gap-2 text-white/75 hover:bg-white/10 hover:text-white"
            asChild
          >
            <a href={storefrontUrl} target="troco-storefront" rel="noopener noreferrer" title={storefrontUrl}>
              <ExternalLink className="h-4 w-4" />
              Voir ma boutique
            </a>
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start gap-2 text-white/75 hover:bg-white/10 hover:text-white"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
            Déconnexion
          </Button>
        </div>
      </aside>

      <div
        className={cn(
          'flex min-w-0 flex-1 flex-col transition-[padding] duration-300 ease-premium',
          isSidebarOpen && 'lg:pl-[17.5rem]',
        )}
      >
        <header className="flex h-[4.25rem] shrink-0 items-center justify-between gap-3 border-b border-border/80 bg-white/90 px-4 backdrop-blur-md sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              className={cn(
                'rounded-lg p-2 text-muted-foreground hover:bg-muted',
                isSidebarOpen && 'lg:hidden',
              )}
              onClick={() => setIsSidebarOpen(true)}
              aria-label="Afficher le menu"
              title="Afficher le menu"
            >
              <PanelLeftOpen className="hidden h-5 w-5 lg:block" />
              <Menu className="h-5 w-5 lg:hidden" />
            </button>
            {isSidebarOpen ? (
              <button
                type="button"
                className="hidden rounded-lg p-2 text-muted-foreground hover:bg-muted lg:inline-flex"
                onClick={() => setIsSidebarOpen(false)}
                aria-label="Masquer le menu"
                title="Masquer le menu"
              >
                <PanelLeftClose className="h-5 w-5" />
              </button>
            ) : null}
            <div className="min-w-0">
              {breadcrumbs && breadcrumbs.length > 0 && (
                <div className="mb-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                  {breadcrumbs.map((b, i) => (
                    <span key={b.label} className="flex items-center gap-1">
                      {i > 0 && <ChevronRight className="h-3 w-3" />}
                      {b.href ? (
                        <Link to={b.href} className="hover:text-foreground">
                          {b.label}
                        </Link>
                      ) : (
                        <span>{b.label}</span>
                      )}
                    </span>
                  ))}
                </div>
              )}
              <h1 className="truncate font-display text-lg font-semibold tracking-tight sm:text-xl">{title}</h1>
              {description ? (
                <p className="truncate text-xs text-muted-foreground sm:text-sm">{description}</p>
              ) : null}
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            {actions}
            <AdminNotification />
          </div>
        </header>
        <main
          className={cn(
            'min-h-0 flex-1',
            workspace ? 'flex flex-col overflow-hidden' : 'overflow-y-auto',
          )}
        >
          <div
            className={cn(
              'w-full',
              workspace
                ? 'flex min-h-0 flex-1 flex-col overflow-hidden'
                : cn('mx-auto p-4 sm:p-6 lg:p-8', wide ? 'max-w-7xl' : 'max-w-6xl'),
            )}
          >
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
