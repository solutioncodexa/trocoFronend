import { ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Palette,
  FolderOpen,
  Tag,
  Layers,
  Gem,
  LogOut,
  Menu,
  X,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAdmin } from '@/contexts/AdminContext';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface AdminLayoutProps {
  children: ReactNode;
  title: string;
  breadcrumbs?: { label: string; href?: string }[];
}

const navSections = [
  {
    label: 'Principal',
    items: [
      { href: '/admin/dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
      { href: '/admin/commandes', label: 'Commandes', icon: ShoppingCart },
      { href: '/admin/personnalisations', label: 'Personnalisations', icon: Palette },
    ],
  },
  {
    label: 'Catalogue',
    items: [
      { href: '/admin/produits', label: 'Produits', icon: Package },
      { href: '/admin/types', label: 'Types de Produits', icon: Tag },
      { href: '/admin/types-or', label: "Types d'or", icon: Gem },
      { href: '/admin/categories', label: 'Catégories', icon: FolderOpen },
      { href: '/admin/collections', label: 'Collections', icon: Layers },
    ],
  },
];

// Liste plate pour compatibilité (évite "navItems is not defined" si cache ancien)
const navItems = navSections.flatMap((s) => s.items);

const AdminLayout = ({ children, title, breadcrumbs }: AdminLayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, isAuthenticated } = useAdmin();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Redirect if not authenticated
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
    <div className="min-h-screen bg-background flex">
      {/* Mobile sidebar overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-charcoal/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed lg:static inset-y-0 left-0 z-50 w-64 bg-charcoal text-cream transform transition-transform duration-300 lg:translate-x-0 flex flex-col',
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Logo */}
        <div className="h-16 shrink-0 flex items-center justify-between px-6 border-b border-cream/10">
          <Link to="/admin/dashboard" className="font-script text-xl text-primary">
            YaraGold
          </Link>
          <button
            className="lg:hidden text-cream/60 hover:text-cream"
            onClick={() => setIsSidebarOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation - scrollable pour afficher toutes les interfaces */}
        <nav className="flex-1 min-h-0 overflow-y-auto p-4 space-y-6">
          {navSections.map((section) => (
            <div key={section.label}>
              <p className="px-4 mb-2 text-xs font-semibold uppercase tracking-wider text-cream/50">
                {section.label}
              </p>
              <div className="space-y-1">
                {section.items.map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={() => setIsSidebarOpen(false)}
                    className={cn(
                      'flex items-center gap-3 px-4 py-3 rounded-lg font-body text-sm transition-all',
                      isActive(item.href)
                        ? 'bg-gold text-charcoal font-medium'
                        : 'text-cream/70 hover:bg-cream/10 hover:text-cream'
                    )}
                  >
                    <item.icon className="w-5 h-5 shrink-0" />
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="shrink-0 p-4 border-t border-cream/10">
          <Link
            to="/"
            className="block text-center font-body text-xs text-cream/50 hover:text-cream mb-4"
          >
            ← Voir le site
          </Link>
          <Button
            variant="outline"
            onClick={handleLogout}
            className="w-full border-cream/20 text-cream hover:bg-cream/10 font-body"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Déconnexion
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="h-16 bg-card border-b border-border flex items-center justify-between px-4 lg:px-8">
          <div className="flex items-center gap-4">
            <button
              className="lg:hidden p-2 hover:bg-muted rounded-lg"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </button>
            
            {/* Breadcrumbs */}
            <div className="flex items-center gap-2 font-body text-sm">
              <Link to="/admin/dashboard" className="text-muted-foreground hover:text-foreground">
                Admin
              </Link>
              {breadcrumbs?.map((crumb, index) => (
                <div key={index} className="flex items-center gap-2">
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  {crumb.href ? (
                    <Link to={crumb.href} className="text-muted-foreground hover:text-foreground">
                      {crumb.label}
                    </Link>
                  ) : (
                    <span className="text-foreground">{crumb.label}</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="font-body text-sm text-muted-foreground hidden md:block">
              Administrateur
            </span>
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-body font-semibold">
              A
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-8">
          <h1 className="font-display text-2xl md:text-3xl text-foreground mb-6">{title}</h1>
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
