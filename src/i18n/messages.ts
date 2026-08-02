import { storefrontExtra, type ExtraMessageKey, type StoreLocale } from './storefrontExtra';
import frCoreJson from './locales/fr-core.json';
import arCoreJson from './locales/ar-core.json';
import enCoreJson from './locales/en-core.json';

export type { ExtraMessageKey, StoreLocale };

export type CoreMessageKey = keyof typeof frCoreJson;

export type MessageKey = CoreMessageKey | ExtraMessageKey;

const frCore = frCoreJson as Record<CoreMessageKey, string>;
const arCore = arCoreJson as Record<CoreMessageKey, string>;
const enCore = enCoreJson as Record<CoreMessageKey, string>;

export const messages: Record<StoreLocale, Record<MessageKey, string>> = {
  fr: { ...frCore, ...storefrontExtra.fr },
  ar: { ...arCore, ...storefrontExtra.ar },
  en: { ...enCore, ...storefrontExtra.en },
};

/** Remplace `{name}`, `{n}`, etc. dans une chaîne traduite. */
export function interpolate(
  template: string,
  vars: Record<string, string | number>,
): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) =>
    vars[key] != null ? String(vars[key]) : `{${key}}`,
  );
}

export function normalizeLocale(raw?: string | null): StoreLocale {
  const v = (raw || 'fr').toLowerCase().slice(0, 2);
  if (v === 'ar') return 'ar';
  if (v === 'en') return 'en';
  return 'fr';
}

export function parseSupportedLocales(raw?: string | null): StoreLocale[] {
  const parts = (raw || 'fr,ar,en')
    .split(/[,;\s]+/)
    .map((s) => normalizeLocale(s))
    .filter(Boolean);
  const uniq = [...new Set(parts)] as StoreLocale[];
  return uniq.length ? uniq : ['fr'];
}
