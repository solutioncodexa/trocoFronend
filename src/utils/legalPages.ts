import { storePagesApi } from '@/services/api/storePages';
import { platformApi } from '@/services/api/platform';
import { buildLegalPages, PRIVACY_PAGE_SLUG, type LegalPageContext } from '@/config/legalPages';

/**
 * Crée les pages légales manquantes (sans écraser celles que le marchand a déjà modifiées)
 * et renseigne l'URL de la politique de confidentialité si elle est vide.
 * Retourne les slugs créés.
 */
export async function createLegalPages(ctx: LegalPageContext): Promise<string[]> {
  const existing = await storePagesApi.list();
  const knownSlugs = new Set(existing.map((p) => (p.slug || '').toLowerCase()));

  const created: string[] = [];
  for (const tpl of buildLegalPages(ctx)) {
    if (knownSlugs.has(tpl.slug)) continue;
    const page = await storePagesApi.create(tpl.meta);
    await storePagesApi.replaceBlocks(page.id!, tpl.blocks, 'Modèle initial');
    created.push(tpl.slug);
  }

  const settings = await platformApi.getMyStoreSettings();
  if (!settings.privacyPolicyUrl?.trim()) {
    await platformApi.updateMyStoreSettings({ privacyPolicyUrl: `/page/${PRIVACY_PAGE_SLUG}` });
  }
  return created;
}
