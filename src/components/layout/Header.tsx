import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, ShoppingBag, Menu, X, Heart, ArrowRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import GoldPriceNav from './GoldPriceNav';
import { cn } from '@/lib/utils';
import { ANIMATIONS } from '@/config/animations';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchDraft, setSearchDraft] = useState('');
  const searchRootRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { getItemCount } = useCart();
  const { wishlistCount } = useWishlist();
  const location = useLocation();
  const itemCount = getItemCount();

  useEffect(() => {
    if (!isSearchOpen) return;
    const params = new URLSearchParams(location.search);
    setSearchDraft(params.get('keyword') ?? '');
  }, [isSearchOpen, location.pathname, location.search]);

  useEffect(() => {
    if (!isSearchOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsSearchOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isSearchOpen]);

  useEffect(() => {
    if (!isSearchOpen) return;
    const onPointerDown = (e: MouseEvent | PointerEvent) => {
      const el = searchRootRef.current;
      if (!el || el.contains(e.target as Node)) return;
      setIsSearchOpen(false);
    };
    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('touchstart', onPointerDown, { passive: true });
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('touchstart', onPointerDown);
    };
  }, [isSearchOpen]);

  const submitHeaderSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchDraft.trim();
    if (!q) {
      setIsSearchOpen(false);
      return;
    }
    const params =
      location.pathname === '/boutique'
        ? new URLSearchParams(location.search)
        : new URLSearchParams();
    params.set('keyword', q);
    navigate({ pathname: '/boutique', search: params.toString() });
    setIsSearchOpen(false);
  };

  const navLinks = [
    { href: '/', label: 'Accueil' },
    { href: '/boutique', label: 'Catégories' },
    { href: '/boutique?category=beldi', label: 'Beldi' },
    { href: '/boutique?category=modern', label: 'Moderne' },
    { href: '/sur-mesure', label: 'Sur-Mesure' },
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
              'flex items-center min-w-0 shrink max-lg:max-w-[42%] py-1 overflow-visible',
              ANIMATIONS.headerLogoHover && 'transition-transform duration-300 ease-out hover:scale-[1.03] active:scale-100'
            )}
          >
            <span className="font-script text-xl sm:text-2xl md:text-3xl leading-[1.35] text-primary whitespace-nowrap inline-block py-0.5">
              YaraGold
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8 ml-10 xl:ml-14 shrink-0">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={cn(
                  'font-display text-[13px] uppercase tracking-[0.2em] transition-colors',
                  ANIMATIONS.navLinkUnderline && 'link-underline',
                  isActive(link.href)
                    ? 'text-primary font-semibold'
                    : 'text-secondary-dark hover:text-primary dark:text-ivory-text dark:hover:text-primary'
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
            <div className="relative" ref={searchRootRef}>
              {isSearchOpen ? (
                <div className="fixed left-3 right-3 top-[4.5rem] z-[60] sm:absolute sm:left-auto sm:right-0 sm:top-1/2 sm:-translate-y-1/2 sm:w-[min(100vw-2rem,22rem)] md:w-80">
                  <form
                    onSubmit={submitHeaderSearch}
                    className="relative w-full rounded-lg border border-border bg-card p-1.5 shadow-lg sm:shadow-md"
                  >
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      type="text"
                      inputMode="search"
                      name="q"
                      value={searchDraft}
                      onChange={(e) => setSearchDraft(e.target.value)}
                      placeholder="Rechercher un bijou…"
                      className="h-10 w-full border-0 bg-transparent pl-9 pr-[4.25rem] text-sm shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
                      autoFocus
                      autoComplete="off"
                      enterKeyHint="search"
                    />
                    <div className="absolute right-1 top-1/2 flex -translate-y-1/2 items-center gap-0.5">
                      <button
                        type="submit"
                        className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground hover:opacity-90"
                        aria-label="Lancer la recherche"
                      >
                        <ArrowRight className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
                        onClick={() => setIsSearchOpen(false)}
                        aria-label="Fermer la recherche"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </form>
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
            'lg:hidden bg-background border-t border-border max-h-[min(70dvh,28rem)] overflow-y-auto overscroll-contain scrollbar-app',
            ANIMATIONS.mobileNavSlideDown ? 'animate-slide-down-fade' : 'animate-fade-in'
          )}
        >
          <div className="container mx-auto px-4 py-4 space-y-1 pb-[max(1rem,env(safe-area-inset-bottom))]">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={cn(
                  'flex items-center py-3 min-h-[44px] font-display text-sm uppercase tracking-[0.16em] touch-manipulation',
                  isActive(link.href)
                    ? 'text-primary font-semibold'
                    : 'text-secondary-dark dark:text-ivory-text'
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
