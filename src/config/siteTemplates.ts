import type { FooterLayoutKey } from '@/config/storeAppearance';
import type { StylePreset } from '@/config/stylePresets';
import type { AdminLocale } from '@/i18n/admin/adminMessages';

type L10n = Record<AdminLocale, string>;

export type TemplatePalette = { key: string; primary: string; secondary: string; name: L10n };

/**
 * Variante d'un modèle : même contenu et mêmes pages, autre caractère visuel (polices, arrondis, agencement, couleurs).
 * `layout` choisit la miniature (clé de `STYLE_PRESETS`) ; `style` remplace les réglages du style de base du modèle.
 */
export type TemplateVariant = {
  key: string;
  name: L10n;
  layout: string;
  style: Partial<Pick<StylePreset, 'themeKey' | 'fontPair' | 'radiusPreset' | 'lookKey'>>;
  /** Palettes propres à la variante ; sinon celles du modèle. */
  palettes?: TemplatePalette[];
};

/**
 * Modèle de boutique complet : un style (thème, polices, arrondis, agencement), des variantes de couleurs,
 * une page d'accueil, des pages utiles au secteur et un pied de page. Un clic règle tout ça d'un coup.
 */
export type SiteTemplate = {
  key: string;
  name: L10n;
  description: L10n;
  /** Clé de `STYLE_PRESETS` : fournit thème, polices, arrondis et agencement. */
  styleKey: string;
  /** Clé de `STARTER_PACKS` : catégories et produits d'exemple. */
  sector: string;
  /** Page d'accueil (`PAGE_TEMPLATES`, avec `isHome`). */
  homeKey: 'home-complete' | 'home-boutique';
  /** Pages supplémentaires cochées par défaut. */
  pages: string[];
  footer: { layout: FooterLayoutKey; newsletter: boolean; socials: boolean };
  palettes: TemplatePalette[];
  /** La première variante est celle par défaut. */
  variants: TemplateVariant[];
};

const pal = (key: string, primary: string, secondary: string, fr: string, en: string, ar: string): TemplatePalette => ({
  key,
  primary,
  secondary,
  name: { fr, en, ar },
});

const BASE_TEMPLATES: Omit<SiteTemplate, 'variants'>[] = [
  {
    key: 'atelier-mode',
    name: { fr: 'Atelier mode', en: 'Fashion studio', ar: 'استوديو الموضة' },
    description: {
      fr: 'Grandes photos, titres en serif, peu de couleur : vêtements, accessoires, chaussures.',
      en: 'Big photos, serif headlines, little color: clothing, accessories, shoes.',
      ar: 'صور كبيرة وعناوين بخط سيريف وألوان هادئة: ملابس وإكسسوارات وأحذية.',
    },
    styleKey: 'editorial',
    sector: 'mode',
    homeKey: 'home-complete',
    pages: ['lookbook', 'a-propos'],
    footer: { layout: 'centered', newsletter: true, socials: true },
    palettes: [
      pal('encre', '#171717', '#A16207', 'Encre et or', 'Ink and gold', 'حبر وذهب'),
      pal('bordeaux', '#9F1239', '#4C0519', 'Bordeaux', 'Burgundy', 'عنابي'),
      pal('sauge', '#3F4B3B', '#B08968', 'Sauge', 'Sage', 'مريمية'),
    ],
  },
  {
    key: 'beaute-douce',
    name: { fr: 'Beauté douce', en: 'Soft beauty', ar: 'جمال هادئ' },
    description: {
      fr: 'Épuré et lumineux, le produit au centre : cosmétiques, soins, parfums.',
      en: 'Clean and bright, product first: cosmetics, skincare, fragrance.',
      ar: 'نظيف ومضيء والمنتج في المقدمة: مستحضرات تجميل وعناية وعطور.',
    },
    styleKey: 'nordique',
    sector: 'beaute',
    homeKey: 'home-complete',
    pages: ['a-propos'],
    footer: { layout: 'default', newsletter: true, socials: true },
    palettes: [
      pal('rose', '#9D174D', '#F472B6', 'Rose poudré', 'Powder pink', 'وردي ناعم'),
      pal('nude', '#7C5E4B', '#D6B8A0', 'Nude', 'Nude', 'عاري'),
      pal('sauge', '#3F6B5A', '#A7C4B5', 'Sauge', 'Sage', 'مريمية'),
    ],
  },
  {
    key: 'souk-artisan',
    name: { fr: 'Souk artisan', en: 'Artisan souk', ar: 'سوق الحرفيين' },
    description: {
      fr: 'Chaleureux et authentique, avec l’histoire de l’artisan : tapis, poterie, cuir, bijoux.',
      en: 'Warm and authentic, with the maker’s story: rugs, pottery, leather, jewelry.',
      ar: 'دافئ وأصيل مع حكاية الحرفي: زرابي وفخار وجلد ومجوهرات.',
    },
    styleKey: 'artisan',
    sector: 'artisanat',
    homeKey: 'home-complete',
    pages: ['notre-histoire'],
    footer: { layout: 'stacked', newsletter: false, socials: true },
    palettes: [
      pal('terracotta', '#9A3412', '#A8A29E', 'Terracotta', 'Terracotta', 'طين محروق'),
      pal('majorelle', '#1E3A8A', '#F59E0B', 'Bleu majorelle', 'Majorelle blue', 'أزرق ماجوريل'),
      pal('olive', '#4D7C0F', '#365314', 'Olive', 'Olive', 'زيتوني'),
    ],
  },
  {
    key: 'electro-flash',
    name: { fr: 'Électro flash', en: 'Electro flash', ar: 'إلكترو فلاش' },
    description: {
      fr: 'Contrasté, promos en vue, angles droits : high-tech, accessoires, ventes flash.',
      en: 'High contrast, promos up front, square corners: tech, accessories, flash sales.',
      ar: 'تباين قوي وعروض بارزة وزوايا حادة: تقنية وإكسسوارات وتخفيضات خاطفة.',
    },
    styleKey: 'flash',
    sector: 'electronique',
    homeKey: 'home-complete',
    pages: ['promo-flash'],
    footer: { layout: 'compact', newsletter: false, socials: true },
    palettes: [
      pal('rouge', '#E11D48', '#F97316', 'Rouge et orange', 'Red and orange', 'أحمر وبرتقالي'),
      pal('electrique', '#4338CA', '#0E7490', 'Bleu électrique', 'Electric blue', 'أزرق كهربائي'),
      pal('noir', '#18181B', '#CA8A04', 'Noir et jaune', 'Black and yellow', 'أسود وأصفر'),
    ],
  },
  {
    key: 'epicerie-terroir',
    name: { fr: 'Épicerie du terroir', en: 'Local grocer', ar: 'بقالة المنتجات المحلية' },
    description: {
      fr: 'Dense et efficace avec filtres sur le côté : épicerie, pâtisserie, produits du terroir.',
      en: 'Dense and efficient with side filters: grocery, pastry, local produce.',
      ar: 'كثيف وعملي مع مرشحات جانبية: بقالة وحلويات ومنتجات محلية.',
    },
    styleKey: 'marche',
    sector: 'alimentation',
    homeKey: 'home-complete',
    pages: ['a-propos'],
    footer: { layout: 'links_only', newsletter: false, socials: true },
    palettes: [
      pal('verger', '#3F6212', '#B45309', 'Verger', 'Orchard', 'بستان'),
      pal('epice', '#9A3412', '#365314', 'Épices', 'Spice', 'توابل'),
      pal('menthe', '#0F766E', '#B45309', 'Menthe', 'Mint', 'نعناع'),
    ],
  },
  {
    key: 'produit-vedette',
    name: { fr: 'Produit vedette', en: 'Hero product', ar: 'المنتج النجم' },
    description: {
      fr: 'Un accueil court tourné vers une offre, avec page de vente dédiée : un produit, une promo.',
      en: 'A short home built around one offer, with a dedicated sales page: one product, one promo.',
      ar: 'صفحة رئيسية قصيرة حول عرض واحد مع صفحة بيع مخصصة: منتج واحد وعرض واحد.',
    },
    styleKey: 'classique',
    sector: 'general',
    homeKey: 'home-boutique',
    pages: ['landing-offre'],
    footer: { layout: 'compact', newsletter: true, socials: false },
    palettes: [
      pal('lagon', '#0F766E', '#0369A1', 'Lagon', 'Lagoon', 'بحيرة'),
      pal('violet', '#6D28D9', '#DB2777', 'Violet', 'Violet', 'بنفسجي'),
      pal('orange', '#C2410C', '#0F172A', 'Orange', 'Orange', 'برتقالي'),
    ],
  },
  {
    key: 'boutique-polyvalente',
    name: { fr: 'Boutique polyvalente', en: 'All-round store', ar: 'متجر متعدد الاستعمالات' },
    description: {
      fr: 'Équilibré et rassurant, pour tous les catalogues : le bon choix si vous hésitez.',
      en: 'Balanced and reassuring, for any catalog: the safe choice if you are unsure.',
      ar: 'متوازن ومطمئن لكل أنواع المنتجات: الخيار الآمن إذا كنت متردداً.',
    },
    styleKey: 'classique',
    sector: 'general',
    homeKey: 'home-complete',
    pages: ['a-propos'],
    footer: { layout: 'default', newsletter: false, socials: true },
    palettes: [
      pal('lagon', '#0F766E', '#0369A1', 'Lagon', 'Lagoon', 'بحيرة'),
      pal('ardoise', '#334155', '#0EA5E9', 'Ardoise', 'Slate', 'أردواز'),
      pal('indigo', '#4338CA', '#1E1B4B', 'Indigo', 'Indigo', 'نيلي'),
    ],
  },
];

const v = (
  key: string,
  fr: string,
  en: string,
  ar: string,
  layout: string,
  style: TemplateVariant['style'] = {},
  palettes?: TemplatePalette[],
): TemplateVariant => ({ key, name: { fr, en, ar }, layout, style, palettes });

const VARIANTS: Record<string, TemplateVariant[]> = {
  'atelier-mode': [
    v('monochrome', 'Monochrome', 'Monochrome', 'أحادي اللون', 'monochrome',
      { themeKey: 'minimal', fontPair: 'jakarta', radiusPreset: 'sharp', lookKey: 'monochrome' },
      [
        pal('noir', '#111111', '#737373', 'Noir et blanc', 'Black and white', 'أسود وأبيض'),
        pal('sable', '#1C1917', '#A8A29E', 'Pierre', 'Stone', 'حجري'),
        pal('ecru', '#27272A', '#C4B5A0', 'Écru', 'Ecru', 'كريمي'),
      ]),
    v('editorial', 'Éditorial', 'Editorial', 'تحريري', 'editorial'),
    v('streetwear', 'Streetwear', 'Streetwear', 'ستريت وير', 'flash',
      { themeKey: 'bold', fontPair: 'modern_mono', radiusPreset: 'sharp', lookKey: 'bold-sale' },
      [
        pal('noir', '#18181B', '#65A30D', 'Noir et lime', 'Black and lime', 'أسود وليموني'),
        pal('braise', '#1C1917', '#EA580C', 'Braise', 'Ember', 'جمر'),
        pal('nuit', '#312E81', '#E11D48', 'Nuit', 'Night', 'ليل'),
      ]),
    v('chic', 'Chic', 'Chic', 'أنيق', 'classique',
      { themeKey: 'elegant', fontPair: 'jakarta', radiusPreset: 'round', lookKey: 'boutique' },
      [
        pal('prune', '#831843', '#B7791F', 'Prune et or', 'Plum and gold', 'برقوقي وذهبي'),
        pal('marine', '#1E293B', '#A16207', 'Marine', 'Navy', 'كحلي'),
        pal('orchidee', '#6B21A8', '#BE185D', 'Orchidée', 'Orchid', 'أوركيد'),
      ]),
  ],
  'beaute-douce': [
    v('epure', 'Épuré', 'Clean', 'نقي', 'nordique'),
    v('poudre', 'Poudré', 'Powdered', 'ناعم', 'artisan',
      { themeKey: 'elegant', fontPair: 'editorial_serif', radiusPreset: 'round', lookKey: 'boutique' },
      [
        pal('rose', '#9D174D', '#E9A8C0', 'Rose poudré', 'Powder pink', 'وردي ناعم'),
        pal('peche', '#B45309', '#F4B9A0', 'Pêche', 'Peach', 'خوخي'),
        pal('lilas', '#6B21A8', '#C9A7E8', 'Lilas', 'Lilac', 'ليلكي'),
      ]),
    v('clinique', 'Clinique', 'Clinical', 'سريري', 'classique',
      { themeKey: 'minimal', fontPair: 'modern_mono', radiusPreset: 'subtle', lookKey: 'editorial' },
      [
        pal('aqua', '#0E7490', '#22D3EE', 'Aqua', 'Aqua', 'مائي'),
        pal('menthe', '#0F766E', '#5EEAD4', 'Menthe', 'Mint', 'نعناعي'),
        pal('ardoise', '#334155', '#94A3B8', 'Ardoise', 'Slate', 'أردواز'),
      ]),
  ],
  'souk-artisan': [
    v('chaleureux', 'Chaleureux', 'Warm', 'دافئ', 'artisan'),
    v('galerie', 'Galerie', 'Gallery', 'معرض', 'editorial',
      { themeKey: 'elegant', fontPair: 'editorial_serif', radiusPreset: 'subtle', lookKey: 'editorial' },
      [
        pal('charbon', '#292524', '#B45309', 'Charbon et cuivre', 'Charcoal and copper', 'فحمي ونحاسي'),
        pal('brun', '#44403C', '#9A3412', 'Brun', 'Brown', 'بني'),
        pal('vert', '#1E3A34', '#C2956B', 'Vert profond', 'Deep green', 'أخضر داكن'),
      ]),
    v('colore', 'Marché coloré', 'Colorful market', 'سوق ملون', 'marche',
      { themeKey: 'classic', fontPair: 'friendly', radiusPreset: 'round', lookKey: 'dense' },
      [
        pal('epices', '#B91C1C', '#CA8A04', 'Épices', 'Spices', 'توابل'),
        pal('zellige', '#0F766E', '#EA580C', 'Zellige', 'Zellige', 'زليج'),
        pal('prune', '#7E22CE', '#EA580C', 'Prune', 'Plum', 'برقوق'),
      ]),
  ],
  'electro-flash': [
    v('flash', 'Flash', 'Flash', 'فلاش', 'flash'),
    v('sobre', 'Tech sobre', 'Quiet tech', 'تقنية هادئة', 'nordique',
      { themeKey: 'minimal', fontPair: 'jakarta', radiusPreset: 'subtle', lookKey: 'editorial' },
      [
        pal('nuit', '#0F172A', '#0EA5E9', 'Nuit', 'Night', 'ليل'),
        pal('vert', '#1E293B', '#16A34A', 'Vert tech', 'Tech green', 'أخضر تقني'),
        pal('ambre', '#111827', '#D97706', 'Ambre', 'Amber', 'عنبري'),
      ]),
    v('catalogue', 'Catalogue dense', 'Dense catalog', 'كتالوج مكثف', 'marche',
      { themeKey: 'classic', fontPair: 'display_sans', radiusPreset: 'subtle', lookKey: 'dense' },
      [
        pal('bleu', '#1D4ED8', '#EA580C', 'Bleu et orange', 'Blue and orange', 'أزرق وبرتقالي'),
        pal('ciel', '#0369A1', '#CA8A04', 'Ciel', 'Sky', 'سماوي'),
        pal('rubis', '#BE123C', '#1E293B', 'Rubis', 'Ruby', 'ياقوتي'),
      ]),
  ],
  'epicerie-terroir': [
    v('marche', 'Marché', 'Market', 'سوق', 'marche'),
    v('gourmande', 'Gourmande', 'Gourmet', 'شهية', 'classique',
      { themeKey: 'classic', fontPair: 'friendly', radiusPreset: 'round', lookKey: 'boutique' },
      [
        pal('miel', '#B45309', '#3F6212', 'Miel', 'Honey', 'عسلي'),
        pal('cerise', '#9F1239', '#D97706', 'Cerise', 'Cherry', 'كرزي'),
        pal('basilic', '#065F46', '#D97706', 'Basilic', 'Basil', 'ريحاني'),
      ]),
    v('fine', 'Épicerie fine', 'Fine foods', 'مأكولات راقية', 'editorial',
      { themeKey: 'elegant', fontPair: 'editorial_serif', radiusPreset: 'subtle', lookKey: 'editorial' },
      [
        pal('olive', '#365314', '#A16207', 'Olive et or', 'Olive and gold', 'زيتوني وذهبي'),
        pal('truffe', '#44403C', '#B45309', 'Truffe', 'Truffle', 'كمأة'),
        pal('foret', '#1E3A34', '#C2956B', 'Forêt', 'Forest', 'غابة'),
      ]),
  ],
  'produit-vedette': [
    v('standard', 'Standard', 'Standard', 'قياسي', 'classique'),
    v('impact', 'Impact', 'Impact', 'قوي', 'flash',
      { themeKey: 'bold', fontPair: 'friendly', radiusPreset: 'round', lookKey: 'bold-sale' },
      [
        pal('rouge', '#E11D48', '#F97316', 'Rouge et orange', 'Red and orange', 'أحمر وبرتقالي'),
        pal('violet', '#7C3AED', '#D97706', 'Violet et ambre', 'Violet and amber', 'بنفسجي وعنبري'),
        pal('encre', '#0F172A', '#CA8A04', 'Encre et jaune', 'Ink and yellow', 'حبر وأصفر'),
      ]),
    v('minimal', 'Minimal', 'Minimal', 'بسيط', 'nordique',
      { themeKey: 'minimal', fontPair: 'jakarta', radiusPreset: 'subtle', lookKey: 'editorial' },
      [
        pal('indigo', '#111827', '#6366F1', 'Indigo', 'Indigo', 'نيلي'),
        pal('lagon', '#0F766E', '#0EA5E9', 'Lagon', 'Lagoon', 'بحيرة'),
        pal('rose', '#334155', '#F43F5E', 'Corail', 'Coral', 'مرجاني'),
      ]),
  ],
  'boutique-polyvalente': [
    v('classique', 'Classique', 'Classic', 'كلاسيكي', 'classique'),
    v('moderne', 'Moderne', 'Modern', 'عصري', 'nordique',
      { themeKey: 'minimal', fontPair: 'jakarta', radiusPreset: 'soft', lookKey: 'boutique' },
      [
        pal('ardoise', '#334155', '#0EA5E9', 'Ardoise', 'Slate', 'أردواز'),
        pal('emeraude', '#047857', '#0F172A', 'Émeraude', 'Emerald', 'زمردي'),
        pal('fuchsia', '#A21CAF', '#0F172A', 'Fuchsia', 'Fuchsia', 'فوشيا'),
      ]),
    v('vitrine', 'Vitrine', 'Showcase', 'واجهة', 'artisan',
      { themeKey: 'classic', fontPair: 'friendly', radiusPreset: 'round', lookKey: 'boutique' },
      [
        pal('corail', '#C2410C', '#0F766E', 'Corail', 'Coral', 'مرجاني'),
        pal('bleu', '#1D4ED8', '#F59E0B', 'Bleu soleil', 'Sunny blue', 'أزرق مشمس'),
        pal('vert', '#15803D', '#CA8A04', 'Vert', 'Green', 'أخضر'),
      ]),
  ],
};

/** Variantes aux designs plus tranchés : hero asymétrique, plein cadre, deux moitiés, tuiles, catalogue, verre dépoli. */
const MORE_VARIANTS: Record<string, TemplateVariant[]> = {
  'atelier-mode': [
    v('magazine', 'Magazine', 'Magazine', 'مجلة', 'magazine', { themeKey: 'elegant', fontPair: 'editorial_serif', radiusPreset: 'sharp', lookKey: 'magazine' }),
    v('lookbook', 'Lookbook', 'Lookbook', 'لوك بوك', 'lookbook', { themeKey: 'minimal', fontPair: 'jakarta', radiusPreset: 'subtle', lookKey: 'lookbook' }),
  ],
  'beaute-douce': [
    v('verre', 'Verre dépoli', 'Frosted glass', 'زجاج مصنفر', 'glass',
      { themeKey: 'minimal', fontPair: 'friendly', radiusPreset: 'pill', lookKey: 'glass' },
      [
        pal('aurore', '#BE185D', '#7C3AED', 'Aurore', 'Aurora', 'شفق'),
        pal('ocean', '#0E7490', '#6366F1', 'Océan', 'Ocean', 'محيط'),
        pal('peche', '#C2410C', '#DB2777', 'Pêche', 'Peach', 'خوخي'),
      ]),
    v('duo', 'Duo', 'Duo', 'ثنائي', 'split', { themeKey: 'elegant', fontPair: 'editorial_serif', radiusPreset: 'soft', lookKey: 'split' }),
  ],
  'souk-artisan': [
    v('mosaique', 'Mosaïque', 'Mosaic', 'فسيفساء', 'bento',
      { themeKey: 'classic', fontPair: 'friendly', radiusPreset: 'round', lookKey: 'bento' },
      [
        pal('terre', '#9A3412', '#0F766E', 'Terre et jade', 'Earth and jade', 'طين ويشم'),
        pal('bleu', '#1E3A8A', '#EA580C', 'Bleu et orange', 'Blue and orange', 'أزرق وبرتقالي'),
        pal('olive', '#4D7C0F', '#B45309', 'Olive et miel', 'Olive and honey', 'زيتوني وعسلي'),
      ]),
  ],
  'electro-flash': [
    v('modules', 'Modules', 'Modules', 'وحدات', 'bento',
      { themeKey: 'bold', fontPair: 'modern_mono', radiusPreset: 'soft', lookKey: 'bento' },
      [
        pal('indigo', '#4338CA', '#0E7490', 'Indigo', 'Indigo', 'نيلي'),
        pal('matrice', '#111827', '#16A34A', 'Matrice', 'Matrix', 'مصفوفة'),
        pal('rubis', '#BE123C', '#EA580C', 'Rubis', 'Ruby', 'ياقوتي'),
      ]),
  ],
  'epicerie-terroir': [
    v('rayons', 'Rayons', 'Aisles', 'أروقة', 'catalogue', { themeKey: 'classic', fontPair: 'display_sans', radiusPreset: 'subtle', lookKey: 'catalogue' }),
    v('duo', 'Duo', 'Duo', 'ثنائي', 'split', { themeKey: 'classic', fontPair: 'friendly', radiusPreset: 'soft', lookKey: 'split' }),
  ],
  'produit-vedette': [
    v('deux', 'En deux temps', 'Two-part', 'على مرحلتين', 'split', { themeKey: 'bold', fontPair: 'display_sans', radiusPreset: 'soft', lookKey: 'split' }),
    v('plein', 'Plein écran', 'Full screen', 'ملء الشاشة', 'lookbook', { themeKey: 'elegant', fontPair: 'editorial_serif', radiusPreset: 'subtle', lookKey: 'lookbook' }),
  ],
  'boutique-polyvalente': [
    v('magazine', 'Magazine', 'Magazine', 'مجلة', 'magazine', { themeKey: 'classic', fontPair: 'display_sans', radiusPreset: 'subtle', lookKey: 'magazine' }),
    v('catalogue', 'Catalogue', 'Catalog', 'كتالوج', 'catalogue', { themeKey: 'classic', fontPair: 'jakarta', radiusPreset: 'subtle', lookKey: 'catalogue' }),
  ],
};

export const SITE_TEMPLATES: SiteTemplate[] = BASE_TEMPLATES.map((t) => ({
  ...t,
  variants: [...VARIANTS[t.key], ...(MORE_VARIANTS[t.key] ?? [])],
}));

/** Réglages effectifs d'une variante : style de base du modèle + remplacements de la variante. */
export function resolveVariant(template: SiteTemplate, variantKey?: string | null) {
  const variant = template.variants.find((x) => x.key === variantKey) ?? template.variants[0];
  return { variant, palettes: variant.palettes ?? template.palettes };
}

export function getSiteTemplate(key?: string | null): SiteTemplate | undefined {
  return SITE_TEMPLATES.find((t) => t.key === key);
}

/** Les modèles du secteur choisi à l'inscription passent en premier. */
export function sortTemplatesForSector(sector?: string | null): SiteTemplate[] {
  if (!sector) return SITE_TEMPLATES;
  return [...SITE_TEMPLATES.filter((t) => t.sector === sector), ...SITE_TEMPLATES.filter((t) => t.sector !== sector)];
}

export const FOOTER_LAYOUT_LABELS: Record<FooterLayoutKey, L10n> = {
  default: { fr: 'Complet', en: 'Full', ar: 'كامل' },
  compact: { fr: 'Compact', en: 'Compact', ar: 'مضغوط' },
  links_only: { fr: 'Liens seuls', en: 'Links only', ar: 'روابط فقط' },
  centered: { fr: 'Centré', en: 'Centered', ar: 'وسط' },
  stacked: { fr: 'Empilé', en: 'Stacked', ar: 'مكدس' },
};

export type TemplatesCopyKey =
  | 'title' | 'subtitle' | 'pick' | 'colors' | 'colorPrimary' | 'colorSecondary' | 'brand' | 'storeName'
  | 'logo' | 'pages' | 'pagesHint' | 'footer' | 'footerNewsletter' | 'footerSocials' | 'apply' | 'skip'
  | 'variants' | 'mockNote' | 'step' | 'applyError' | 'quick' | 'showPreview' | 'hidePreview' | 'logoColors' | 'useLogoColors' | 'crumb';

export const TEMPLATES_COPY: Record<AdminLocale, Record<TemplatesCopyKey, string>> = {
  fr: {
    crumb: 'Modèles',
    title: 'Choisissez un modèle de boutique',
    subtitle: 'Un modèle règle le style, les couleurs, l’accueil et le pied de page. Vous pourrez tout changer ensuite.',
    pick: 'Choisir ce modèle',
    step: 'Modèle',
    variants: 'Variantes',
    mockNote: 'Aperçu avec des produits d’exemple. Vos propres produits les remplaceront.',
    quick: 'Réglages rapides',
    colors: 'Couleurs',
    colorPrimary: 'Principale',
    colorSecondary: 'Secondaire',
    brand: 'Nom et logo',
    storeName: 'Nom de la boutique',
    logo: 'Logo',
    logoColors: 'Couleurs trouvées dans votre logo',
    useLogoColors: 'Utiliser',
    pages: 'Pages',
    pagesHint: 'Elles sont créées à la publication. Décochez celles dont vous n’avez pas besoin.',
    footer: 'Pied de page',
    footerNewsletter: 'Inscription à la newsletter',
    footerSocials: 'Liens vers les réseaux sociaux',
    apply: 'Appliquer et continuer',
    skip: 'Passer cette étape',
    applyError: 'Impossible d’enregistrer le modèle. Réessayez.',
    showPreview: 'Voir l’aperçu',
    hidePreview: 'Masquer l’aperçu',
  },
  en: {
    crumb: 'Templates',
    title: 'Pick a store template',
    subtitle: 'A template sets the style, colors, home page and footer. You can change everything afterwards.',
    pick: 'Choose this template',
    step: 'Template',
    variants: 'Variants',
    mockNote: 'Preview with sample products. Your own products will replace them.',
    quick: 'Quick settings',
    colors: 'Colors',
    colorPrimary: 'Primary',
    colorSecondary: 'Secondary',
    brand: 'Name and logo',
    storeName: 'Store name',
    logo: 'Logo',
    logoColors: 'Colors found in your logo',
    useLogoColors: 'Use them',
    pages: 'Pages',
    pagesHint: 'They are created when you publish. Untick the ones you don’t need.',
    footer: 'Footer',
    footerNewsletter: 'Newsletter sign-up',
    footerSocials: 'Social media links',
    apply: 'Apply and continue',
    skip: 'Skip this step',
    applyError: 'The template could not be saved. Try again.',
    showPreview: 'Show preview',
    hidePreview: 'Hide preview',
  },
  ar: {
    crumb: 'القوالب',
    title: 'اختر قالب متجرك',
    subtitle: 'القالب يحدد الأسلوب والألوان والصفحة الرئيسية وتذييل الصفحة. يمكنك تغيير كل شيء لاحقاً.',
    pick: 'اختيار هذا القالب',
    step: 'القالب',
    variants: 'تنويعات',
    mockNote: 'معاينة بمنتجات تجريبية. ستحل منتجاتك محلها.',
    quick: 'إعدادات سريعة',
    colors: 'الألوان',
    colorPrimary: 'الرئيسي',
    colorSecondary: 'الثانوي',
    brand: 'الاسم والشعار',
    storeName: 'اسم المتجر',
    logo: 'الشعار',
    logoColors: 'ألوان مستخرجة من شعارك',
    useLogoColors: 'استخدامها',
    pages: 'الصفحات',
    pagesHint: 'يتم إنشاؤها عند النشر. ألغِ تحديد الصفحات التي لا تحتاجها.',
    footer: 'تذييل الصفحة',
    footerNewsletter: 'الاشتراك في النشرة البريدية',
    footerSocials: 'روابط مواقع التواصل',
    apply: 'تطبيق ومتابعة',
    skip: 'تخطي هذه الخطوة',
    applyError: 'تعذر حفظ القالب. أعد المحاولة.',
    showPreview: 'عرض المعاينة',
    hidePreview: 'إخفاء المعاينة',
  },
};
