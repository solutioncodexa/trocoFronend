import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, ShoppingBag, Menu, X, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { cn } from '@/lib/utils';

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
    { href: '/sur-mesure', label: 'Sur Mesure' },
  ];

  const isActive = (href: string) => {
    if (href === '/') return location.pathname === '/';
    return location.pathname.startsWith(href.split('?')[0]);
  };

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Mobile menu button */}
          <button
            className="lg:hidden p-2"
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
          <Link to="/" className="flex items-center space-x-2">
            <span className="font-script text-2xl md:text-3xl text-primary">
              NazGold
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={cn(
                  'link-underline font-body text-sm uppercase tracking-wider transition-colors',
                  isActive(link.href) ? 'text-primary font-semibold' : 'text-foreground hover:text-primary'
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right side icons */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="relative">
              {isSearchOpen ? (
                <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center animate-fade-in">
                  <Input
                    type="search"
                    placeholder="Rechercher..."
                    className="w-48 md:w-64 pr-10"
                    autoFocus
                    onBlur={() => setIsSearchOpen(false)}
                  />
                  <X
                    className="absolute right-3 w-4 h-4 cursor-pointer text-muted-foreground"
                    onClick={() => setIsSearchOpen(false)}
                  />
                </div>
              ) : (
                <button
                  onClick={() => setIsSearchOpen(true)}
                  className="p-2 hover:text-primary transition-colors"
                  aria-label="Rechercher"
                >
                  <Search className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Wishlist */}
            <Link
              to="/favoris"
              className="relative hidden md:block p-2 hover:text-primary transition-colors"
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
            <Link to="/panier" className="relative p-2 hover:text-primary transition-colors">
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
        <nav className="lg:hidden bg-background border-t border-border animate-fade-in">
          <div className="container mx-auto px-4 py-4 space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={cn(
                  'block py-2 font-body text-sm uppercase tracking-wider',
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
