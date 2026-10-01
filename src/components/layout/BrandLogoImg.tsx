import getStoreLogo from '@/assets/getstore-logo.png';
import { PUBLIC_SITE_NAME } from '@/config/site';
import { cn } from '@/lib/utils';
import { useStoreBrand } from '@/hooks/useStoreBrand';

type BrandLogoImgProps = Omit<React.ComponentPropsWithoutRef<'img'>, 'src'> & {
  className?: string;
  /** Force une URL (ex. aperçu admin) */
  src?: string | null;
  /** Désactive la lecture du tenant (logo plateforme) */
  platformFallback?: boolean;
};

/**
 * Logo boutique : URL tenant si présente.
 * Sans logo : wordmark du nom de boutique (jamais le logo Troco d’une autre marque).
 * `platformFallback` : logo plateforme Get STORE uniquement.
 */
export function BrandLogoImg({
  className,
  alt,
  src,
  platformFallback = false,
  ...props
}: BrandLogoImgProps) {
  const { siteName, logoUrl, hasStore } = useStoreBrand();
  const explicit = src?.trim() || null;
  const storeLogo = !platformFallback ? logoUrl : null;
  const platformLogo = platformFallback || !hasStore ? getStoreLogo : null;
  const resolvedSrc = explicit || storeLogo || platformLogo;
  const wordmark = platformFallback || !hasStore ? PUBLIC_SITE_NAME : siteName;
  const resolvedAlt = alt ?? wordmark;

  if (!resolvedSrc) {
    return (
      <span
        className={cn(
          'inline-flex max-w-full items-center font-display text-xl font-bold tracking-tight text-foreground sm:text-2xl',
          className,
        )}
        aria-label={resolvedAlt}
      >
        <span className="truncate">{wordmark}</span>
      </span>
    );
  }

  return (
    <img
      src={resolvedSrc}
      alt={resolvedAlt}
      className={cn('h-auto w-auto max-w-full object-contain object-left', className)}
      {...props}
    />
  );
}
