import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useGlobalSections } from '@/hooks/useGlobalSections';
import { useStorefrontPath } from '@/hooks/useStorefrontPath';
import { useStoreLang } from '@/hooks/useStoreLang';
import { resolveTenantSlug } from '@/contexts/TenantContext';
import { cn } from '@/lib/utils';

function dismissStorageKey(slug: string | null) {
  return `troco_sticky_cta_dismiss_${slug ?? 'default'}`;
}

const StickyCta = () => {
  const { stickyCtaConfig, isLoading } = useGlobalSections();
  const { to, isDemo } = useStorefrontPath();
  const { withLang } = useStoreLang();
  const slug = resolveTenantSlug();
  const [dismissed, setDismissed] = useState(false);

  const storageKey = useMemo(() => dismissStorageKey(slug), [slug]);

  useEffect(() => {
    if (!stickyCtaConfig?.dismissible) {
      setDismissed(false);
      return;
    }
    try {
      setDismissed(sessionStorage.getItem(storageKey) === '1');
    } catch {
      setDismissed(false);
    }
  }, [storageKey, stickyCtaConfig?.dismissible]);

  if (isDemo || isLoading || !stickyCtaConfig || dismissed) {
    return null;
  }

  const href = stickyCtaConfig.ctaHref.startsWith('http')
    ? stickyCtaConfig.ctaHref
    : withLang(to(stickyCtaConfig.ctaHref.startsWith('/') ? stickyCtaConfig.ctaHref : `/${stickyCtaConfig.ctaHref}`));

  const dismiss = () => {
    try {
      sessionStorage.setItem(storageKey, '1');
    } catch {
      /* ignore */
    }
    setDismissed(true);
  };

  return (
    <div
      className={cn(
        'fixed inset-x-0 bottom-0 z-[45] border-t border-border bg-card/95 shadow-elegant backdrop-blur-sm',
        'pb-[max(0.75rem,env(safe-area-inset-bottom))]',
      )}
      role="complementary"
      aria-label="Appel à l’action"
    >
      <div className="container mx-auto flex flex-wrap items-center justify-center gap-3 px-4 py-3 sm:justify-between">
        <p className="text-center text-sm font-medium text-foreground sm:text-left">{stickyCtaConfig.text}</p>
        <div className="flex shrink-0 items-center gap-2">
          {stickyCtaConfig.ctaHref.startsWith('http') ? (
            <Button size="sm" asChild>
              <a href={href}>{stickyCtaConfig.ctaLabel}</a>
            </Button>
          ) : (
            <Button size="sm" asChild>
              <Link to={href}>{stickyCtaConfig.ctaLabel}</Link>
            </Button>
          )}
          {stickyCtaConfig.dismissible ? (
            <button
              type="button"
              className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              onClick={dismiss}
              aria-label="Masquer"
            >
              <X className="h-4 w-4" />
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default StickyCta;
