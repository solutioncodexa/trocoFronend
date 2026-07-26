import { Heart, Search, ShoppingBag } from 'lucide-react';
import { useStoreBrand } from '@/hooks/useStoreBrand';
import { BrandLogoImg } from '@/components/layout/BrandLogoImg';
import { cn } from '@/lib/utils';
import type { AppBarConfig } from '@/types/store-global-sections';
import { DEFAULT_APP_BAR } from '@/types/store-global-sections';

/**
 * Coque vitrine (non fixed) pour l’atelier :
 * le vendeur voit la page comme en boutique (header + pied).
 */
export default function StorePreviewChrome({
  children,
  pageTitle,
  appBar = DEFAULT_APP_BAR,
  selectedChrome,
  onSelectChrome,
}: {
  children: React.ReactNode;
  pageTitle?: string;
  appBar?: AppBarConfig;
  selectedChrome?: 'header' | 'footer' | null;
  onSelectChrome?: (part: 'header' | 'footer' | null) => void;
}) {
  const { siteName } = useStoreBrand();
  const logoClass =
    appBar.logoHeight === 'sm' ? 'h-7' : appBar.logoHeight === 'lg' ? 'h-11' : 'h-8';

  return (
    <div className="storefront-skin flex min-h-full flex-col bg-background text-foreground">
      <div
        role="button"
        tabIndex={0}
        onClick={(e) => {
          e.stopPropagation();
          onSelectChrome?.('header');
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onSelectChrome?.('header');
          }
        }}
        className={cn(
          'border-b outline-none transition',
          selectedChrome === 'header'
            ? 'ring-2 ring-inset ring-sky-500'
            : 'hover:ring-2 hover:ring-inset hover:ring-sky-400/40',
        )}
        style={{
          backgroundColor: appBar.bgColor || undefined,
          color: appBar.textColor || undefined,
          borderColor: appBar.bgColor ? 'transparent' : undefined,
        }}
      >
        {appBar.topBarEnabled && appBar.topBarText ? (
          <div
            className="px-4 py-1.5 text-center text-[11px] font-medium sm:px-6"
            style={{
              backgroundColor: appBar.topBarBg || '#0F766E',
              color: appBar.topBarTextColor || '#FFFFFF',
            }}
          >
            {appBar.topBarText}
          </div>
        ) : null}
        <div className="flex items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div className="flex min-w-0 items-center gap-2">
            <BrandLogoImg className={cn('w-auto max-w-[7rem]', logoClass)} draggable={false} />
          </div>
          <nav
            className="hidden items-center gap-4 text-xs sm:flex"
            style={{ color: appBar.textColor || undefined }}
          >
            {(appBar.navLabels.length ? appBar.navLabels : DEFAULT_APP_BAR.navLabels).map((label) => (
              <span key={label} className={appBar.textColor ? 'opacity-90' : 'text-muted-foreground'}>
                {label}
              </span>
            ))}
          </nav>
          <div
            className="flex items-center gap-2"
            style={{ color: appBar.textColor || undefined }}
          >
            {appBar.showSearch ? <Search className="h-4 w-4" /> : null}
            {appBar.showWishlist ? <Heart className="h-4 w-4" /> : null}
            {appBar.showCart ? <ShoppingBag className="h-4 w-4" /> : null}
          </div>
        </div>
        {pageTitle ? (
          <div
            className="border-t px-4 py-1.5 text-[11px] sm:px-6"
            style={{
              borderColor: appBar.textColor ? `${appBar.textColor}33` : undefined,
              color: appBar.textColor ? `${appBar.textColor}cc` : undefined,
              backgroundColor: appBar.bgColor ? undefined : undefined,
            }}
          >
            <span className={appBar.textColor ? '' : 'text-muted-foreground'}>
              Page · <span className={cn('font-medium', !appBar.textColor && 'text-foreground')}>{pageTitle}</span>
            </span>
            <span className="ml-2 rounded bg-sky-500/15 px-1.5 py-0.5 text-[10px] font-semibold text-sky-800">
              Cliquez pour personnaliser
            </span>
          </div>
        ) : null}
      </div>

      <div className="min-h-0 flex-1">{children}</div>

      <footer
        role="button"
        tabIndex={0}
        onClick={(e) => {
          e.stopPropagation();
          onSelectChrome?.('footer');
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onSelectChrome?.('footer');
          }
        }}
        className={cn(
          'mt-auto border-t border-border bg-muted/40 px-4 py-6 outline-none transition sm:px-6',
          selectedChrome === 'footer'
            ? 'ring-2 ring-inset ring-sky-500'
            : 'hover:ring-2 hover:ring-inset hover:ring-sky-400/40',
        )}
      >
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="font-display text-sm font-semibold">{siteName}</p>
            <p className="mt-0.5 text-[11px] text-muted-foreground">
              Pied de page boutique (aperçu)
            </p>
          </div>
          <div className="flex gap-3 text-[11px] text-muted-foreground">
            <span>Livraison</span>
            <span>FAQ</span>
            <span>Contact</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
