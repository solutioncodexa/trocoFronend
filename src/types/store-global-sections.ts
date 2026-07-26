export type GlobalSectionKey = 'mega_menu' | 'footer_links' | 'sticky_cta';

export type MegaMenuChildLink = {
  label: string;
  href: string;
};

export type MegaMenuItem = {
  label: string;
  href: string;
  children?: MegaMenuChildLink[];
};

export type MegaMenuConfig = {
  items: MegaMenuItem[];
};

export type FooterLink = {
  label: string;
  href: string;
};

export type FooterLinksColumn = {
  title: string;
  links: FooterLink[];
};

export type FooterLinksConfig = {
  columns: FooterLinksColumn[];
};

export type StickyCtaConfig = {
  text: string;
  ctaLabel: string;
  ctaHref: string;
  dismissible?: boolean;
};

export type StoreGlobalSection = {
  id: number;
  sectionKey: GlobalSectionKey | string;
  enabled: boolean;
  config: Record<string, unknown>;
};

export type UpsertGlobalSectionPayload = {
  sectionKey: GlobalSectionKey | string;
  enabled?: boolean;
  config?: Record<string, unknown>;
};

export function parseMegaMenuConfig(config: Record<string, unknown> | undefined): MegaMenuConfig {
  const raw = config?.items;
  if (!Array.isArray(raw)) return { items: [] };
  const items: MegaMenuItem[] = raw
    .filter((x): x is Record<string, unknown> => x != null && typeof x === 'object')
    .map((item) => {
      const childrenRaw = item.children;
      const children = Array.isArray(childrenRaw)
        ? childrenRaw
            .filter((c): c is Record<string, unknown> => c != null && typeof c === 'object')
            .map((c) => ({
              label: String(c.label ?? ''),
              href: String(c.href ?? ''),
            }))
            .filter((c) => c.label && c.href)
        : undefined;
      return {
        label: String(item.label ?? ''),
        href: String(item.href ?? ''),
        children: children?.length ? children : undefined,
      };
    })
    .filter((i) => i.label && i.href);
  return { items };
}

export function parseFooterLinksConfig(config: Record<string, unknown> | undefined): FooterLinksConfig {
  const raw = config?.columns;
  if (!Array.isArray(raw)) return { columns: [] };
  const columns: FooterLinksColumn[] = raw
    .filter((x): x is Record<string, unknown> => x != null && typeof x === 'object')
    .map((col) => {
      const linksRaw = col.links;
      const links = Array.isArray(linksRaw)
        ? linksRaw
            .filter((l): l is Record<string, unknown> => l != null && typeof l === 'object')
            .map((l) => ({
              label: String(l.label ?? ''),
              href: String(l.href ?? ''),
            }))
            .filter((l) => l.label && l.href)
        : [];
      return {
        title: String(col.title ?? ''),
        links,
      };
    })
    .filter((c) => c.title);
  return { columns };
}

export function parseStickyCtaConfig(config: Record<string, unknown> | undefined): StickyCtaConfig | null {
  if (!config) return null;
  const text = String(config.text ?? '').trim();
  const ctaLabel = String(config.ctaLabel ?? '').trim();
  const ctaHref = String(config.ctaHref ?? '').trim();
  if (!text || !ctaLabel || !ctaHref) return null;
  return {
    text,
    ctaLabel,
    ctaHref,
    dismissible: config.dismissible !== false,
  };
}
