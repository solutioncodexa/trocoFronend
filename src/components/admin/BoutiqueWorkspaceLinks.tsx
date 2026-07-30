import { Link, useLocation } from 'react-router-dom';
import { FileText, LayoutPanelLeft, MessageSquare, Palette, Store } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const LINKS = [
  { href: '/admin/boutique-en-ligne', label: 'Vue d’ensemble', icon: Store },
  { href: '/admin/parametres', label: 'Apparence', icon: Palette },
  { href: '/admin/pages', label: 'Pages', icon: FileText },
  { href: '/admin/sections', label: 'Navigation', icon: LayoutPanelLeft },
  { href: '/admin/top-bar-messages', label: 'Bandeau', icon: MessageSquare },
] as const;

type Props = {
  /** Masquer le lien de la page courante (détecté via location si omis). */
  current?: (typeof LINKS)[number]['href'];
  className?: string;
  compact?: boolean;
};

/**
 * Raccourcis entre les écrans Boutique en ligne (Apparence ↔ Pages ↔ Navigation…).
 */
export function BoutiqueWorkspaceLinks({ current, className, compact }: Props) {
  const location = useLocation();
  const active =
    current ??
    LINKS.find(
      (l) => location.pathname === l.href || location.pathname.startsWith(`${l.href}/`),
    )?.href;

  return (
    <div
      className={cn(
        'flex flex-wrap items-center gap-1.5',
        !compact && 'rounded-xl border border-border bg-muted/30 p-2',
        className,
      )}
      role="navigation"
      aria-label="Raccourcis boutique en ligne"
    >
      {!compact ? (
        <span className="mr-1 hidden text-[11px] font-medium uppercase tracking-wide text-muted-foreground sm:inline">
          Aller à
        </span>
      ) : null}
      {LINKS.map((item) => {
        const isCurrent = active === item.href;
        return (
          <Button
            key={item.href}
            type="button"
            variant={isCurrent ? 'default' : 'outline'}
            size="sm"
            className={cn('h-8 gap-1.5 text-xs', isCurrent && 'pointer-events-none')}
            asChild={!isCurrent}
            disabled={isCurrent}
          >
            {isCurrent ? (
              <span>
                <item.icon className="h-3.5 w-3.5" />
                {item.label}
              </span>
            ) : (
              <Link to={item.href}>
                <item.icon className="h-3.5 w-3.5" />
                {item.label}
              </Link>
            )}
          </Button>
        );
      })}
    </div>
  );
}
