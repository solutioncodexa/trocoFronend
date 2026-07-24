import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, ShoppingBag, Menu, X, Heart, ArrowRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { cn } from '@/lib/utils';
import { ANIMATIONS } from '@/config/animations';
import { BrandLogoImg } from '@/components/layout/BrandLogoImg';

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
    { href: '/boutique', label: 'Boutique' },
    { href: '/sur-mesure', label: 'Sur-mesure' },
    { href: '/devis', label: 'Devis' },
    { href: '/contact', label: 'Contact' },
  ];

  const isActive = (href: string) => {
    if (href === '/') return location.pathname === '/';
    const [path, query] = href.split('?');
    if (location.pathname !== path && !location.pathname.startsWith(`${path}/`)) {
      return false;
    }
    if (query) {
      const wanted = new URLSearchParams(query);
      const current = new URLSearchParams(location.search);
      return [...wanted.entries()].every(([k, v]) => current.get(k) === v);
    }
    if (path === '/boutique') {
      return location.pathname === '/boutique' && !new URLSearchParams(location.search).get('category');
    }
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  const iconBtnClass =
    'flex min-h-[44px] min-w-[44px] touch-manipulation items-center justify-center rounded-xl text-foreground transition-colors hover:text-primary';

  return (
    <header className="sticky top-0 z-50 w-full max-w-full min-w-0 overflow-x-clip border-b border-border bg-card shadow-soft">
      <div className="container mx-auto w-full max-w-full min-w-0 px-3 sm:px-4 md:px-6">
        <div className="flex h-[4.25rem] w-full min-w-0 items-center justify-between gap-2 sm:h-[4.75rem] lg:h-20">
          <button
            type="button"
            className={cn(iconBtnClass, 'lg:hidden')}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>

          <Link
            to="/"
            aria-label="Troco — accueil"
            className={cn(
              'flex min-w-0 max-lg:max-w-[56%] shrink items-center overflow-visible py-0.5',
              ANIMATIONS.headerLogoHover &&
                'transition-transform duration-300 ease-premium hover:scale-[1.03] active:scale-100',
            )}
          >
            <BrandLogoImg className="h-12 w-auto sm:h-14 lg:h-[4.25rem]" draggable={false} />
          </Link>

          <nav
            className="ml-6 hidden shrink-0 items-center gap-0.5 xl:ml-10 lg:flex xl:gap-1"
            aria-label="Navigation principale"
          >
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  className={cn(
                    'relative px-3.5 py-2.5 font-display text-[15px] font-semibold tracking-tight transition-colors xl:px-4 xl:text-base',
                    ANIMATIONS.navLinkUnderline && !active && 'link-underline',
                    active ? 'text-primary' : 'text-foreground/80 hover:text-primary',
                  )}
                >
                  {link.label}
                  {active ? (
                    <span
                      className="absolute inset-x-3.5 -bottom-0.5 h-0.5 rounded-full bg-primary xl:inset-x-4"
                      aria-hidden
                    />
                  ) : null}
                </Link>
              );
            })}
          </nav>

          <div className="flex shrink-0 items-center gap-0.5 sm:gap-1 md:gap-1.5">
            <div className="relative" ref={searchRootRef}>
              {isSearchOpen ? (
                <div className="fixed left-3 right-3 top-[4.75rem] z-[60] sm:absolute sm:left-auto sm:right-0 sm:top-1/2 sm:w-[min(100vw-2rem,24rem)] sm:-translate-y-1/2 md:w-[22rem]">
                  <form
                    onSubmit={submitHeaderSearch}
                    className="relative w-full rounded-2xl border border-primary/25 bg-card p-1.5 shadow-elegant"
                  >
                    <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-primary" />
                    <Input
                      type="text"
                      inputMode="search"
                      name="q"
                      value={searchDraft}
                      onChange={(e) => setSearchDraft(e.target.value)}
                      placeholder="Rechercher des produits…"
                      className="h-11 w-full border-0 bg-transparent pl-9 pr-[4.5rem] text-base shadow-none focus-visible:ring-0 md:text-sm"
                      autoFocus
                      autoComplete="off"
                      enterKeyHint="search"
                    />
                    <div className="absolute right-1.5 top-1/2 flex -translate-y-1/2 items-center gap-0.5">
                      <button
                        type="submit"
                        className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground transition-opacity hover:opacity-90"
                        aria-label="Lancer la recherche"
                      >
                        <ArrowRight className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        className="flex h-9 w-9 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                        onClick={() => setIsSearchOpen(false)}
                        aria-label="Fermer la recherche"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                <button type="button" onClick={() => setIsSearchOpen(true)} className={iconBtnClass} aria-label="Rechercher">
                  <Search className="h-5 w-5 sm:h-[1.35rem] sm:w-[1.35rem]" />
                </button>
              )}
            </div>

            <Link to="/favoris" className={cn(iconBtnClass, 'relative')} aria-label="Favoris">
              <Heart className="h-5 w-5 sm:h-[1.35rem] sm:w-[1.35rem]" />
              {wishlistCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[11px] font-bold text-primary-foreground animate-scale-in">
                  {wishlistCount}
                </span>
              )}
            </Link>

            <Link to="/panier" className={cn(iconBtnClass, 'relative')} aria-label="Panier">
              <ShoppingBag className="h-5 w-5 sm:h-[1.35rem] sm:w-[1.35rem]" />
              {itemCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[11px] font-bold text-primary-foreground animate-scale-in">
                  {itemCount}
                </span>
              )}
            </Link>

            <Link to="/admin" className="hidden">
              Admin
            </Link>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <nav
          className={cn(
            'max-h-[min(70dvh,28rem)] overflow-y-auto overscroll-contain border-t border-border bg-card scrollbar-app lg:hidden',
            ANIMATIONS.mobileNavSlideDown ? 'animate-slide-down-fade' : 'animate-fade-in',
          )}
          aria-label="Navigation mobile"
        >
          <div className="container mx-auto space-y-0.5 px-4 py-3 pb-[max(1rem,env(safe-area-inset-bottom))]">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  className={cn(
                    'flex min-h-[48px] touch-manipulation items-center border-l-2 px-4 py-3 font-display text-base font-semibold tracking-tight transition-colors',
                    active
                      ? 'border-primary text-primary'
                      : 'border-transparent text-foreground/85 hover:border-primary/40 hover:text-primary',
                  )}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        </nav>
      )}
    </header>
  );
};

export default Header;
