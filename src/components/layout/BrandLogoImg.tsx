import trocoLogo from '@/assets/troco-logo.png';
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
  const resolvedSrc = explicit || storeLogo || (platformFallback || !hasStore ? trocoLogo : null);
  const resolvedAlt = alt ?? siteName;

  if (!resolvedSrc) {
    return (
      <span
        className={cn(
          'inline-flex max-w-full items-center font-display text-xl font-bold tracking-tight text-foreground sm:text-2xl',
          className,
        )}
        aria-label={resolvedAlt}
      >
        <span className="truncate">{siteName}</span>
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
