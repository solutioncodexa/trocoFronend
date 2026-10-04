import { aiCopyApi, type AiCopyKind } from '@/services/api/aiCopy';

/**
 * Texte proposé par le serveur pour un titre, une description, un slogan… dans la langue de l'interface.
 * Renvoie `null` si rien d'utilisable : le serveur renvoie des modèles de phrases en français quand le modèle est
 * indisponible, ils ne sont gardés que pour une interface en français ; sinon l'appelant utilise son propre texte.
 */
export async function proposeCopy(
  kind: AiCopyKind | 'tagline' | 'about' | 'product_description',
  topic: string,
  opts: { storeName?: string; locale: 'fr' | 'en' | 'ar' },
): Promise<string | null> {
  try {
    const res = await aiCopyApi.generate({
      kind: kind as AiCopyKind,
      topic: topic.slice(0, 200),
      storeName: opts.storeName?.slice(0, 120),
      locale: opts.locale,
    });
    const text = typeof res.text === 'string' ? res.text.trim() : '';
    if (!text) return null;
    return res.source === 'llm' || opts.locale === 'fr' ? text : null;
  } catch {
    return null;
  }
}
