import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, ShoppingBag, Menu, X, Heart } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import GoldPriceNav from './GoldPriceNav';
import { cn } from '@/lib/utils';
import { ANIMATIONS } from '@/config/animations';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { getItemCount } = useCart();
  const { wishlistCount } = useWishlist();
  const location = useLocation();
  const itemCount = getItemCount();

  const navLinks = [
    { href: '/', label: 'Accueil' },
    { href: '/boutique', label: 'Boutique' },
    { href: '/boutique?category=beldi', label: 'Beldi' },
    { href: '/boutique?category=modern', label: 'Moderne' },
    { href: '/prix-or-maroc', label: 'Cours de l\'Or' },
    { href: '/sur-mesure', label: 'Sur Mesure' },
  ];

  const isActive = (href: string) => {
    if (href === '/') return location.pathname === '/';
    return location.pathname.startsWith(href.split('?')[0]);
  };

  return (
    <header className="w-full max-w-full min-w-0 overflow-x-clip bg-background/95 backdrop-blur-md border-b border-border">
      <div className="container mx-auto w-full max-w-full min-w-0 px-3 sm:px-4 md:px-6">
        <div className="flex items-center justify-between h-16 lg:h-20 min-h-[4rem] lg:min-h-[5rem] gap-1 sm:gap-2 min-w-0 w-full">
          {/* Mobile menu button */}
          <button
            type="button"
            className="lg:hidden p-2 min-h-[44px] min-w-[44px] flex items-center justify-center shrink-0 touch-manipulation"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Menu"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>

          {/* Logo */}
          <Link
            to="/"
            className={cn(
              'flex items-center min-w-0 shrink max-lg:max-w-[42%]',
              ANIMATIONS.headerLogoHover && 'transition-transform duration-300 ease-out hover:scale-[1.03] active:scale-100'
            )}
          >
            <span className="font-script text-xl sm:text-2xl md:text-3xl text-primary truncate">
              YaraGold
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8 shrink-0">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={cn(
                  'font-body text-sm uppercase tracking-wider transition-colors',
                  ANIMATIONS.navLinkUnderline && 'link-underline',
                  isActive(link.href) ? 'text-primary font-semibold' : 'text-foreground hover:text-primary'
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Gold price graph */}
          <div className="flex min-w-0 shrink justify-center lg:flex-1 lg:justify-center">
            <GoldPriceNav />
          </div>

          {/* Right side icons */}
          <div className="flex items-center gap-0.5 sm:gap-1 md:gap-3 shrink-0">
            {/* Search */}
            <div className="relative">
              {isSearchOpen ? (
                <div className="fixed left-3 right-3 top-[4.5rem] z-[60] sm:absolute sm:left-auto sm:right-0 sm:inset-x-auto sm:top-1/2 sm:-translate-y-1/2 sm:w-48 md:w-64">
                  <div className="relative w-full max-w-full">
                    <Input
                      type="search"
                      placeholder="Rechercher..."
                      className="w-full pr-10 shadow-lg sm:shadow-none"
                      autoFocus
                      onBlur={() => setIsSearchOpen(false)}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-0 bg-transparent border-0 cursor-pointer"
                      onClick={() => setIsSearchOpen(false)}
                      aria-label="Fermer la recherche"
                    >
                      <X className="w-4 h-4 text-muted-foreground" />
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsSearchOpen(true)}
                  className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center hover:text-primary transition-colors touch-manipulation"
                  aria-label="Rechercher"
                >
                  <Search className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Wishlist */}
            <Link
              to="/favoris"
              className="relative flex p-2 min-h-[44px] min-w-[44px] items-center justify-center hover:text-primary transition-colors touch-manipulation"
              aria-label="Favoris"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs w-5 h-5 rounded-full flex items-center justify-center font-semibold animate-scale-in">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link to="/panier" className="relative p-2 min-h-[44px] min-w-[44px] flex items-center justify-center hover:text-primary transition-colors touch-manipulation">
              <ShoppingBag className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs w-5 h-5 rounded-full flex items-center justify-center font-semibold animate-scale-in">
                  {itemCount}
                </span>
              )}
            </Link>

            {/* Admin link (hidden for regular users) */}
            <Link to="/admin" className="hidden">
              Admin
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <nav
          className={cn(
            'lg:hidden bg-background border-t border-border max-h-[min(70dvh,28rem)] overflow-y-auto overscroll-contain',
            ANIMATIONS.mobileNavSlideDown ? 'animate-slide-down-fade' : 'animate-fade-in'
          )}
        >
          <div className="container mx-auto px-4 py-4 space-y-1 pb-[max(1rem,env(safe-area-inset-bottom))]">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={cn(
                  'flex items-center py-3 min-h-[44px] font-body text-sm uppercase tracking-wider touch-manipulation',
                  isActive(link.href) ? 'text-primary font-semibold' : 'text-foreground'
                )}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
};

export default Header;
