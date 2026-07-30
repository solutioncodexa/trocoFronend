import { cn } from '@/lib/utils';

export type StorePageLinkOption = {
  value: string;
  label: string;
  published?: boolean;
};

type Props = {
  value: string;
  onPick: (href: string, label: string) => void;
  pages: StorePageLinkOption[];
  disabled?: boolean;
  className?: string;
  id?: string;
};

/** Sélecteur de pages boutique → remplit un champ href (+ libellé optionnel). */
export function StorePageHrefSelect({ value, onPick, pages, disabled, className, id }: Props) {
  const matched = pages.some((p) => p.value === value);
  if (pages.length === 0) {
    return (
      <p className={cn('text-[11px] text-muted-foreground', className)}>
        Aucune page — créez-en dans Pages.
      </p>
    );
  }
  return (
    <select
      id={id}
      disabled={disabled}
      className={cn(
        'flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm disabled:opacity-50',
        className,
      )}
      value={matched ? value : ''}
      onChange={(e) => {
        const v = e.target.value;
        if (!v) return;
        const page = pages.find((p) => p.value === v);
        onPick(v, page?.label?.replace(/\s*\(accueil\)\s*$/i, '') || v);
      }}
    >
      <option value="">Choisir une page…</option>
      {pages.map((p) => (
        <option key={p.value} value={p.value}>
          {p.label}
          {p.published === false ? ' (brouillon)' : ''}
        </option>
      ))}
    </select>
  );
}

export function toStorePageLinkOptions(
  pages: Array<{ slug?: string | null; title?: string | null; isHome?: boolean; published?: boolean }>,
): StorePageLinkOption[] {
  return pages
    .filter((p) => p.slug)
    .map((p) => ({
      value: p.isHome ? '/' : `/page/${p.slug}`,
      label: p.isHome ? `${p.title || 'Accueil'} (accueil)` : p.title || p.slug || '',
      published: p.published,
    }));
}
