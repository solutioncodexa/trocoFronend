import { useState, useEffect, useRef, type CSSProperties } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, ShoppingBag, Menu, X, Heart, ArrowRight, ChevronDown } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { cn } from '@/lib/utils';
import { ANIMATIONS } from '@/config/animations';
import { BrandLogoImg } from '@/components/layout/BrandLogoImg';
import { useStoreBrand } from '@/hooks/useStoreBrand';
import { useStorefrontPath } from '@/hooks/useStorefrontPath';
import { useSystemNavReplacements } from '@/hooks/useSystemNavReplacements';
import { useGlobalSections } from '@/hooks/useGlobalSections';
import { useStoreLang } from '@/hooks/useStoreLang';
import { useLocale } from '@/contexts/LocaleContext';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { SYSTEM_NAV_REPLACEMENTS } from '@/config/pageTemplates';
import type { MegaMenuItem } from '@/types/store-global-sections';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState<number | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchDraft, setSearchDraft] = useState('');
  const searchRootRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { getItemCount } = useCart();
  const { wishlistCount } = useWishlist();
  const location = useLocation();
  const { to, isDemo, demo } = useStorefrontPath();
  const { customNav, isReplaced, navHref } = useSystemNavReplacements();
  const { megaMenuConfig, useMegaMenuNav, appBarConfig } = useGlobalSections();
  const { lang, setLang, withLang } = useStoreLang();
  const { locale, supportedLocales, setLocale, t } = useLocale();
  const itemCount = isDemo ? demo?.cartCount ?? 0 : getItemCount();
  const favCount = isDemo ? 3 : wishlistCount;
  const { siteName, store } = useStoreBrand();
  const surMesureOn = isDemo || store?.surMesureEnabled !== false;
  const boutiquePath = to('/boutique');
  const homePath = to('/');
  const showSearch = appBarConfig?.showSearch !== false;
  const showWishlist = appBarConfig?.showWishlist !== false;
  const showCart = appBarConfig?.showCart !== false;
  const logoClass =
    appBarConfig?.logoHeight === 'sm'
      ? 'h-10 w-auto sm:h-11 lg:h-12'
      : appBarConfig?.logoHeight === 'lg'
        ? 'h-14 w-auto sm:h-16 lg:h-[4.75rem]'
        : 'h-12 w-auto sm:h-14 lg:h-[4.25rem]';
  const headerStyle = appBarConfig
    ? {
        backgroundColor: appBarConfig.bgColor || undefined,
        color: appBarConfig.textColor || undefined,
        borderColor: appBarConfig.bgColor ? 'transparent' : undefined,
      }
    : undefined;
  const iconTone: CSSProperties | undefined = appBarConfig?.textColor
    ? { color: appBarConfig.textColor }
    : undefined;

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
    const onBoutique =
      location.pathname === boutiquePath || location.pathname.endsWith('/boutique');
    const params = onBoutique ? new URLSearchParams(location.search) : new URLSearchParams();
    params.set('keyword', q);
    navigate({ pathname: boutiquePath, search: params.toString() });
    setIsSearchOpen(false);
  };

  const resolveStoreHref = (href: string) => {
    if (/^https?:\/\//i.test(href)) return href;
    const path = href.startsWith('/') ? href : `/${href}`;
    return withLang(to(path));
  };

  const customExtra = customNav.filter(
    (p) => !(SYSTEM_NAV_REPLACEMENTS as readonly string[]).includes(p.slug.toLowerCase()),
  );

  const defaultNavLinks = [
    { href: withLang(homePath), label: lang === 'ar' ? 'الرئيسية' : 'Accueil' },
    { href: withLang(boutiquePath), label: lang === 'ar' ? 'المتجر' : 'Boutique' },
    ...customExtra.map((p) => ({
      href: withLang(to(`/page/${p.slug}`)),
      label: p.title,
    })),
    ...(surMesureOn && !isReplaced('/sur-mesure')
      ? [{ href: withLang(to('/sur-mesure')), label: lang === 'ar' ? 'حسب الطلب' : 'Sur-mesure' }]
      : isReplaced('/sur-mesure')
        ? [{ href: navHref('/sur-mesure'), label: lang === 'ar' ? 'حسب الطلب' : 'Sur-mesure' }]
        : []),
    ...(surMesureOn && !isReplaced('/devis')
      ? [{ href: withLang(to('/devis')), label: lang === 'ar' ? 'عرض سعر' : 'Devis' }]
      : isReplaced('/devis')
        ? [{ href: navHref('/devis'), label: lang === 'ar' ? 'عرض سعر' : 'Devis' }]
        : []),
    {
      href: navHref('/contact'),
      label: lang === 'ar' ? 'اتصل بنا' : 'Contact',
    },
  ].filter((link, i, arr) => arr.findIndex((x) => x.href === link.href) === i);

  const megaMenuItems: MegaMenuItem[] | null =
    useMegaMenuNav && megaMenuConfig?.items.length ? megaMenuConfig.items : null;

  const navLinks = defaultNavLinks;

  const navLinkClass = (active: boolean) =>
    cn(
      'relative px-3.5 py-2.5 font-display text-[15px] font-semibold tracking-tight transition-colors xl:px-4 xl:text-base',
      ANIMATIONS.navLinkUnderline && !active && 'link-underline',
      active ? 'text-primary' : 'text-foreground/80 hover:text-primary',
    );

  const renderNavAnchor = (href: string, label: string, active: boolean, external?: boolean) => {
    const className = navLinkClass(active);
    const activeBar = active ? (
      <span
        className="absolute inset-x-3.5 -bottom-0.5 h-0.5 rounded-full bg-primary xl:inset-x-4"
        aria-hidden
      />
    ) : null;
    if (external) {
      return (
        <a href={href} className={className} rel="noopener noreferrer">
          {label}
          {activeBar}
        </a>
      );
    }
    return (
      <Link to={href} className={className}>
        {label}
        {activeBar}
      </Link>
    );
  };

  const renderDesktopMegaItem = (item: MegaMenuItem, index: number) => {
    const href = resolveStoreHref(item.href);
    const external = /^https?:\/\//i.test(item.href);
    const active = isActive(href);
    const children = item.children ?? [];
    if (!children.length) {
      return (
        <div key={`${item.href}-${index}`}>{renderNavAnchor(href, item.label, active, external)}</div>
      );
    }
    return (
      <div key={`${item.href}-${index}`} className="group relative">
        <span
          className={cn(
            navLinkClass(active),
            'inline-flex cursor-default items-center gap-1',
          )}
        >
          {item.label}
          <ChevronDown className="h-3.5 w-3.5 opacity-70 transition-transform group-hover:rotate-180" />
        </span>
        <div className="invisible absolute left-0 top-full z-[60] min-w-[12rem] pt-1 opacity-0 transition-all group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
          <div className="rounded-xl border border-border bg-card py-1 shadow-elegant">
            <Link
              to={href}
              className="block px-4 py-2 text-sm font-medium text-foreground hover:bg-muted hover:text-primary"
            >
              {item.label}
            </Link>
            {children.map((child, ci) => {
              const childHref = resolveStoreHref(child.href);
              const childExternal = /^https?:\/\//i.test(child.href);
              if (childExternal) {
                return (
                  <a
                    key={`${child.href}-${ci}`}
                    href={childHref}
                    className="block px-4 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-primary"
                    rel="noopener noreferrer"
                  >
                    {child.label}
                  </a>
                );
              }
              return (
                <Link
                  key={`${child.href}-${ci}`}
                  to={childHref}
                  className="block px-4 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-primary"
                >
                  {child.label}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  const isActive = (href: string) => {
    const [path] = href.split('?');
    if (path === homePath || path === '/') {
      return location.pathname === homePath || location.pathname === '/' || location.pathname === `${demo?.basePath}`;
    }
    if (location.pathname !== path && !location.pathname.startsWith(`${path}/`)) {
      return false;
    }
    if (path === boutiquePath) {
      return location.pathname === boutiquePath && !new URLSearchParams(location.search).get('category');
    }
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  const iconBtnClass =
    'flex min-h-[44px] min-w-[44px] touch-manipulation items-center justify-center rounded-xl text-foreground transition-colors hover:text-primary';

  return (
    <header
      className={cn(
        'z-50 w-full max-w-full min-w-0 overflow-x-clip border-b border-border bg-card shadow-soft',
        appBarConfig?.sticky === false ? 'relative' : 'sticky top-0',
      )}
      style={headerStyle}
    >
      {appBarConfig?.topBarEnabled && appBarConfig.topBarText ? (
        <div
          className="px-3 py-1.5 text-center text-xs font-medium sm:px-4"
          style={{
            backgroundColor: appBarConfig.topBarBg || '#0F766E',
            color: appBarConfig.topBarTextColor || '#FFFFFF',
          }}
        >
          {appBarConfig.topBarText}
        </div>
      ) : null}
      <div className="container mx-auto w-full max-w-full min-w-0 px-3 sm:px-4 md:px-6">
        <div className="flex h-[4.25rem] w-full min-w-0 items-center justify-between gap-2 sm:h-[4.75rem] lg:h-20">
          <button
            type="button"
            className={cn(iconBtnClass, 'lg:hidden')}
            style={iconTone}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>

          <Link
            to={homePath}
            aria-label={`${siteName} — accueil`}
            className={cn(
              'flex min-w-0 max-lg:max-w-[56%] shrink items-center overflow-visible py-0.5',
              ANIMATIONS.headerLogoHover &&
                'transition-transform duration-300 ease-premium hover:scale-[1.03] active:scale-100',
            )}
          >
            <BrandLogoImg className={logoClass} draggable={false} />
          </Link>

          <nav
            className="ml-6 hidden shrink-0 items-center gap-0.5 xl:ml-10 lg:flex xl:gap-1"
            aria-label="Navigation principale"
          >
            {megaMenuItems
              ? megaMenuItems.map((item, index) => renderDesktopMegaItem(item, index))
              : navLinks.map((link) => {
                  const active = isActive(link.href);
                  return (
                    <div key={link.href}>{renderNavAnchor(link.href, link.label, active)}</div>
                  );
                })}
          </nav>

          <div className="flex shrink-0 items-center gap-0.5 sm:gap-1 md:gap-1.5" style={iconTone}>
            {showSearch ? (
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
                <button type="button" onClick={() => setIsSearchOpen(true)} className={iconBtnClass} style={iconTone} aria-label="Rechercher">
                  <Search className="h-5 w-5 sm:h-[1.35rem] sm:w-[1.35rem]" />
                </button>
              )}
            </div>
            ) : null}

            <Select
              value={locale}
              onValueChange={(v) => {
                const next = v as 'fr' | 'ar' | 'en';
                setLocale(next);
                if (next === 'ar' || next === 'fr') setLang(next === 'ar' ? 'ar' : 'fr');
              }}
            >
              <SelectTrigger
                className="hidden h-9 w-[4.25rem] border-0 bg-transparent px-1 text-xs font-bold shadow-none sm:flex"
                aria-label={t('language')}
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {supportedLocales.map((code) => (
                  <SelectItem key={code} value={code}>
                    {code.toUpperCase()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <button
              type="button"
              className={cn(iconBtnClass, 'px-1.5 text-xs font-bold sm:hidden')}
              onClick={() => {
                const idx = supportedLocales.indexOf(locale);
                const next = supportedLocales[(idx + 1) % supportedLocales.length] ?? 'fr';
                setLocale(next);
                if (next === 'ar' || next === 'fr') setLang(next === 'ar' ? 'ar' : 'fr');
              }}
              aria-label={t('language')}
            >
              {locale.toUpperCase()}
            </button>

            {showWishlist ? (
            <Link to={withLang(to('/favoris'))} className={cn(iconBtnClass, 'relative')} style={iconTone} aria-label="Favoris">
              <Heart className="h-5 w-5 sm:h-[1.35rem] sm:w-[1.35rem]" />
              {favCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[11px] font-bold text-primary-foreground animate-scale-in">
                  {favCount}
                </span>
              )}
            </Link>
            ) : null}

            {showCart ? (
            <Link to={withLang(to('/panier'))} className={cn(iconBtnClass, 'relative')} style={iconTone} aria-label="Panier">
              <ShoppingBag className="h-5 w-5 sm:h-[1.35rem] sm:w-[1.35rem]" />
              {itemCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[11px] font-bold text-primary-foreground animate-scale-in">
                  {itemCount}
                </span>
              )}
            </Link>
            ) : null}

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
            {megaMenuItems
              ? megaMenuItems.map((item, index) => {
                  const href = resolveStoreHref(item.href);
                  const external = /^https?:\/\//i.test(item.href);
                  const active = isActive(href);
                  const children = item.children ?? [];
                  const expanded = mobileExpanded === index;
                  return (
                    <div key={`${item.href}-${index}`} className="border-b border-border/60 last:border-0">
                      <div className="flex items-center">
                        {external ? (
                          <a
                            href={href}
                            className={cn(
                              'flex min-h-[48px] flex-1 touch-manipulation items-center border-l-2 px-4 py-3 font-display text-base font-semibold',
                              active ? 'border-primary text-primary' : 'border-transparent text-foreground/85',
                            )}
                            onClick={() => setIsMenuOpen(false)}
                          >
                            {item.label}
                          </a>
                        ) : (
                          <Link
                            to={href}
                            className={cn(
                              'flex min-h-[48px] flex-1 touch-manipulation items-center border-l-2 px-4 py-3 font-display text-base font-semibold',
                              active ? 'border-primary text-primary' : 'border-transparent text-foreground/85',
                            )}
                            onClick={() => setIsMenuOpen(false)}
                          >
                            {item.label}
                          </Link>
                        )}
                        {children.length > 0 ? (
                          <button
                            type="button"
                            className="flex h-12 w-12 items-center justify-center text-muted-foreground"
                            aria-expanded={expanded}
                            onClick={() => setMobileExpanded(expanded ? null : index)}
                          >
                            <ChevronDown className={cn('h-5 w-5 transition-transform', expanded && 'rotate-180')} />
                          </button>
                        ) : null}
                      </div>
                      {expanded && children.length > 0 ? (
                        <div className="pb-2 pl-6">
                          {children.map((child, ci) => {
                            const childHref = resolveStoreHref(child.href);
                            const childExternal = /^https?:\/\//i.test(child.href);
                            if (childExternal) {
                              return (
                                <a
                                  key={`${child.href}-${ci}`}
                                  href={childHref}
                                  className="block py-2 text-sm text-muted-foreground hover:text-primary"
                                  onClick={() => setIsMenuOpen(false)}
                                >
                                  {child.label}
                                </a>
                              );
                            }
                            return (
                              <Link
                                key={`${child.href}-${ci}`}
                                to={childHref}
                                className="block py-2 text-sm text-muted-foreground hover:text-primary"
                                onClick={() => setIsMenuOpen(false)}
                              >
                                {child.label}
                              </Link>
                            );
                          })}
                        </div>
                      ) : null}
                    </div>
                  );
                })
              : navLinks.map((link) => {
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
