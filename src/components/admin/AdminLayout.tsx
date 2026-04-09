import { ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Package, 
  Palette, 
  Star, 
  MessageSquare, 
  Image as ImageIcon,
  Tag,
  Gem,
  FolderOpen,
  Layers,
  ChevronRight,
  Settings,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import AdminNotification from './AdminNotification';
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
      { href: '/admin/produits-selectionnes', label: 'Produits Sélectionnés', icon: Star },
      { href: '/admin/top-bar-messages', label: 'Messages Top Bar', icon: MessageSquare },
      { href: '/admin/promo-modals', label: 'Promo Modals', icon: ImageIcon },
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Commence ouvert sur desktop

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
    <div className="flex h-screen min-h-0 overflow-hidden bg-background">
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
          'fixed inset-y-0 left-0 z-50 w-64 bg-white text-charcoal transform transition-transform duration-300 flex flex-col',
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full' // Toggle pour tous les écrans
        )}
      >
        {/* Logo - Aligné avec le header principal */}
        <div className="h-16 shrink-0 flex items-center justify-between px-6 border-b border-gray-200">
          <Link to="/admin/dashboard" className="font-script text-xl text-primary">
            YaraGold
          </Link>
          <button
            className="lg:hidden text-gray-600 hover:text-gray-900"
            onClick={() => setIsSidebarOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation - scrollable pour afficher toutes les interfaces */}
        <nav className="flex-1 min-h-0 overflow-y-auto p-4 space-y-6">
          {navSections.map((section) => (
            <div key={section.label}>
              <p className="px-4 mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
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
                        ? 'bg-gold text-white font-medium'
                        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
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

        {/* Footer - Absolument fixé en bas de la sidebar */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-white">
          <Link
            to="/"
            className="block text-center font-body text-xs text-gray-500 hover:text-gray-700 mb-3 transition-colors"
          >
            ← Voir le site
          </Link>
          <Button
            variant="outline"
            onClick={handleLogout}
            className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 font-body transition-colors"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Déconnexion
          </Button>
        </div>
      </aside>

      {/* Main content — flex column + min-h-0 so <main> can scroll (overflow-y-auto) */}
      <div
        className={cn(
          'flex min-h-0 flex-1 flex-col transition-all duration-300',
          isSidebarOpen ? 'lg:ml-64' : 'lg:ml-0'
        )}
      >
        {/* Header - Aligné avec le header du sidebar */}
        <header className="h-16 shrink-0 bg-white border-b border-gray-200 px-4 lg:px-8 flex items-center">
          <div className="flex items-center gap-4 flex-1">
            {/* Bouton toggle sidebar */}
            <button
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              {isSidebarOpen ? (
                <ChevronRight className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
            {/* Breadcrumbs */}
            <div className="flex items-center gap-2 font-body text-sm">
              <Link to="/admin/dashboard" className="text-gray-600 hover:text-gray-900">
                Admin
              </Link>
              {breadcrumbs?.map((crumb, index) => (
                <div key={index} className="flex items-center gap-2">
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                  {crumb.href ? (
                    <Link to={crumb.href} className="text-gray-600 hover:text-gray-900">
                      {crumb.label}
                    </Link>
                  ) : (
                    <span className="text-gray-900">{crumb.label}</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <AdminNotification />
            <span className="font-body text-sm text-gray-600 hidden md:block">
              Administrateur
            </span>
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-body font-semibold">
              A
            </div>
          </div>
        </header>

        {/* Page content — min-h-0 required for flex child to shrink and show vertical scroll */}
        <main className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-4 lg:p-8">
          <h1 className="font-display text-2xl md:text-3xl text-foreground mb-6">{title}</h1>
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;