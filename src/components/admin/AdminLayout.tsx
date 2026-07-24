import { ReactNode, useMemo, useState } from 'react';
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
  Sparkles,
  Warehouse,
  TrendingUp,
  Share2,
  Users,
  History,
} from 'lucide-react';
import AdminNotification from './AdminNotification';
import StockAlertDialog from './StockAlertDialog';
import { Button } from '@/components/ui/button';
import { useAdmin } from '@/contexts/AdminContext';
import { PERMISSIONS } from '@/config/permissions';
import { cn } from '@/lib/utils';
import { BrandLogoImg } from '@/components/layout/BrandLogoImg';

interface AdminLayoutProps {
  children: ReactNode;
  title: string;
  breadcrumbs?: { label: string; href?: string }[];
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
    label: 'Principal',
    items: [
      { href: '/admin/dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
      { href: '/admin/commandes', label: 'Commandes', icon: ShoppingCart, permission: PERMISSIONS.ORDERS_VIEW },
      { href: '/admin/personnalisations', label: 'Personnalisations', icon: Palette, permission: PERMISSIONS.CUSTOM_ORDERS_VIEW },
      { href: '/admin/produits-selectionnes', label: 'Produits Sélectionnés', icon: Star, permission: PERMISSIONS.CATALOG_MANAGE },
      { href: '/admin/stock', label: 'Stock', icon: Warehouse, permission: PERMISSIONS.STOCK_VIEW },
      { href: '/admin/revenus', label: 'Revenus', icon: TrendingUp, permission: PERMISSIONS.STATS_VIEW },
      { href: '/admin/top-bar-messages', label: 'Messages Top Bar', icon: MessageSquare, permission: PERMISSIONS.CONTENT_MANAGE },
      { href: '/admin/promo-modals', label: 'Promo Modals', icon: ImageIcon, permission: PERMISSIONS.CONTENT_MANAGE },
      { href: '/admin/codes-promo', label: 'Codes Promo', icon: Ticket, permission: PERMISSIONS.CONTENT_MANAGE },
      { href: '/admin/reseaux-sociaux', label: 'Réseaux sociaux', icon: Share2, permission: PERMISSIONS.CONTENT_MANAGE },
    ],
  },
  {
    label: 'Catalogue',
    items: [
      { href: '/admin/categories', label: 'Catégories', icon: FolderOpen, permission: PERMISSIONS.CATALOG_MANAGE },
      { href: '/admin/produits', label: 'Produits', icon: Package, permission: PERMISSIONS.PRODUCTS_VIEW },
      { href: '/admin/accueil-categories', label: 'Catégories accueil', icon: Sparkles, permission: PERMISSIONS.CATALOG_MANAGE },
    ],
  },
  {
    label: 'Équipe',
    items: [
      { href: '/admin/membres', label: 'Membres', icon: Users, adminOnly: true },
      { href: '/admin/audit', label: 'Audit', icon: History, permission: PERMISSIONS.AUDIT_VIEW },
    ],
  },
];

const AdminLayout = ({ children, title, breadcrumbs }: AdminLayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, isAuthenticated, isAdmin, hasPermission, user } = useAdmin();
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => window.innerWidth >= 1024);

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

  const isActive = (href: string) => location.pathname === href;

  return (
    <div className="flex h-screen min-h-0 overflow-hidden bg-background surface-mesh">
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
          'fixed inset-y-0 left-0 z-50 flex h-full w-64 flex-col border-r border-border/80 bg-card/95 text-foreground shadow-elegant backdrop-blur-xl transition-transform duration-300 ease-premium',
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-border px-5">
          <Link to="/admin/dashboard" className="flex min-w-0 items-center" aria-label="Troco — tableau de bord">
            <BrandLogoImg className="h-9 w-auto max-w-[11rem]" draggable={false} />
          </Link>
          <button
            type="button"
            className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
            aria-label="Fermer le menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="min-h-0 flex-1 space-y-6 overflow-y-auto overscroll-contain p-3 scrollbar-app">
          {navSections.map((section) => (
            <div key={section.label}>
              <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
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
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                    )}
                  >
                    <item.icon className="h-4 w-4 shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </nav>

        <div className="shrink-0 border-t border-border p-3 space-y-2">
          <div className="px-3 py-1">
            <p className="text-xs font-medium truncate">{user?.fullName || user?.email}</p>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wide">{user?.role}</p>
          </div>
          <Button variant="ghost" className="w-full justify-start gap-2" asChild>
            <Link to="/">
              <ExternalLink className="h-4 w-4" />
              Voir le site
            </Link>
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-2" onClick={handleLogout}>
            <LogOut className="h-4 w-4" />
            Déconnexion
          </Button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col lg:pl-64">
        <header className="flex h-16 shrink-0 items-center justify-between gap-3 border-b border-border bg-card/80 px-4 backdrop-blur-md sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              className="rounded-lg p-2 text-muted-foreground hover:bg-muted lg:hidden"
              onClick={() => setIsSidebarOpen(true)}
              aria-label="Ouvrir le menu"
            >
              <Menu className="h-5 w-5" />
            </button>
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
              <h1 className="truncate font-display text-lg sm:text-xl">{title}</h1>
            </div>
          </div>
          <AdminNotification />
        </header>
        <main className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;
