const fs = require('fs');
const path = require('path');

const src = fs.readFileSync(
  path.join(__dirname, '..', 'src', 'config', 'storeAppearance.ts'),
  'utf8',
);

const ARRAY_TO_GROUP = {
  HEADER_LAYOUTS: 'headerLayout',
  CART_DENSITIES: 'cartDensity',
  CART_EMPTY_STYLES: 'cartEmpty',
  CHECKOUT_LAYOUTS: 'checkoutLayout',
  CHECKOUT_CTA_EMPHASIS: 'checkoutCta',
  CHECKOUT_SUMMARY_POSITIONS: 'checkoutSummary',
  CHECKOUT_DENSITIES: 'checkoutDensity',
  CHECKOUT_FORM_STYLES: 'checkoutForm',
  CHECKOUT_PAYMENT_STYLES: 'checkoutPayment',
  CHECKOUT_HEADING_ALIGNS: 'checkoutHeading',
  SHOP_FILTER_LAYOUTS: 'shopFilter',
  SHOP_GRID_COLUMNS: 'shopGrid',
  SHOP_DENSITIES: 'shopDensity',
  SHOP_EMPTY_STYLES: 'shopEmpty',
  SHOP_FILTER_MOBILES: 'shopFilterMobile',
  PRODUCT_GALLERY_MOBILES: 'productGalleryMobile',
  HOME_DENSITIES: 'homeDensity',
  PRODUCT_GALLERY_LAYOUTS: 'productGallery',
  PRODUCT_INFO_POSITIONS: 'productInfo',
  CARD_IMAGE_RATIOS: 'cardRatio',
  CARD_INFO_ALIGNS: 'cardAlign',
  CARD_HOVER_EFFECTS: 'cardHover',
  WISHLIST_EMPTY_STYLES: 'wishlistEmpty',
  WISHLIST_GRID_COLUMNS: 'wishlistGrid',
  FORMS_LAYOUTS: 'formsLayout',
  FORMS_STYLES: 'formsStyle',
  BUTTON_STYLES: 'button',
  CARD_STYLES: 'card',
  HERO_STYLES: 'hero',
  FOOTER_LAYOUTS: 'footerLayout',
};

/** Manual AR/EN for French labels (label + description). */
const TR = {
  // shared densités
  Compact: { ar: 'مضغوط', en: 'Compact' },
  Confort: { ar: 'مريح', en: 'Comfortable' },
  Aéré: { ar: 'واسع', en: 'Spacious' },
  Simple: { ar: 'بسيط', en: 'Simple' },
  Illustré: { ar: 'مصوّر', en: 'Illustrated' },
  Marque: { ar: 'علامة', en: 'Branded' },
  Centré: { ar: 'وسط', en: 'Centered' },
  Empilé: { ar: 'متراص', en: 'Stacked' },
  Split: { ar: 'منقسم', en: 'Split' },
  Carte: { ar: 'بطاقة', en: 'Card' },
  Plat: { ar: 'مسطّح', en: 'Flat' },
  Bordure: { ar: 'إطار', en: 'Bordered' },
  Plein: { ar: 'ممتلئ', en: 'Solid' },
  Contour: { ar: 'خط خارجي', en: 'Outline' },
  Doux: { ar: 'ناعم', en: 'Soft' },
  Pilule: { ar: 'كبسولة', en: 'Pill' },
  Fantôme: { ar: 'شفاف', en: 'Ghost' },
  Dégradé: { ar: 'تدرج', en: 'Gradient' },
  Inverse: { ar: 'معكوس', en: 'Inverse' },
  Relief: { ar: 'بارز', en: 'Elevated' },
  Minimal: { ar: 'بسيط', en: 'Minimal' },
  Verre: { ar: 'زجاجي', en: 'Glass' },
  Flottant: { ar: 'عائم', en: 'Lifted' },
  Velours: { ar: 'مخملي', en: 'Velvet' },
  'Plein écran': { ar: 'ملء الشاشة', en: 'Full bleed' },
  Bannière: { ar: 'شريط', en: 'Banner' },
  Overlay: { ar: 'تراكب', en: 'Overlay' },
  Asymétrique: { ar: 'غير متماثل', en: 'Asymmetric' },
  Complet: { ar: 'كامل', en: 'Full' },
  'Liens seuls': { ar: 'روابط فقط', en: 'Links only' },
  Ligne: { ar: 'صف', en: 'Inline' },
  'Une page': { ar: 'صفحة واحدة', en: 'Single page' },
  Étapes: { ar: 'خطوات', en: 'Steps' },
  Standard: { ar: 'قياسي', en: 'Standard' },
  Fort: { ar: 'قوي', en: 'Bold' },
  'À droite': { ar: 'يمين', en: 'Right' },
  'À gauche': { ar: 'يسار', en: 'Left' },
  'En bas': { ar: 'أسفل', en: 'Bottom' },
  Liste: { ar: 'قائمة', en: 'List' },
  Puces: { ar: 'حبات', en: 'Pills' },
  Cartes: { ar: 'بطاقات', en: 'Cards' },
  Gauche: { ar: 'يسار', en: 'Left' },
  Sidebar: { ar: 'شريط جانبي', en: 'Sidebar' },
  Tiroir: { ar: 'درج', en: 'Drawer' },
  Haut: { ar: 'أعلى', en: 'Top' },
  Feuille: { ar: 'ورقة', en: 'Sheet' },
  Miniatures: { ar: 'مصغّرات', en: 'Thumbnails' },
  Swipe: { ar: 'سحب', en: 'Swipe' },
  'Miniatures gauche': { ar: 'مصغّرات يسار', en: 'Left thumbs' },
  'Miniatures bas': { ar: 'مصغّرات أسفل', en: 'Bottom thumbs' },
  'En dessous': { ar: 'أسفل', en: 'Below' },
  Carré: { ar: 'مربع', en: 'Square' },
  Portrait: { ar: 'عمودي', en: 'Portrait' },
  Paysage: { ar: 'أفقي', en: 'Landscape' },
  Aucun: { ar: 'بدون', en: 'None' },
  Zoom: { ar: 'تكبير', en: 'Zoom' },
  '2 colonnes': { ar: 'عمودان', en: '2 columns' },
  '3 colonnes': { ar: '3 أعمدة', en: '3 columns' },
  '4 colonnes': { ar: '4 أعمدة', en: '4 columns' },
};

const DESC_TR = {
  'Logo + nav + icônes sur une rangée.': {
    ar: 'الشعار والتنقل والأيقونات في صف واحد.',
    en: 'Logo + nav + icons on one row.',
  },
  'Logo au centre, nav dessous.': {
    ar: 'الشعار في الوسط والتنقل تحته.',
    en: 'Logo centered, nav below.',
  },
  'Logo puis nav pleine largeur.': {
    ar: 'الشعار ثم تنقل بعرض كامل.',
    en: 'Logo then full-width nav.',
  },
  'Moins d’espace, plus d’articles visibles.': {
    ar: 'مسافة أقل، المزيد من العناصر ظاهرة.',
    en: 'Less space, more items visible.',
  },
  'Équilibre classique.': { ar: 'توازن كلاسيكي.', en: 'Classic balance.' },
  'Grands espacements, look premium.': {
    ar: 'مسافات واسعة، مظهر فاخر.',
    en: 'Large spacing, premium look.',
  },
  'Icône + texte + CTA.': { ar: 'أيقونة + نص + زر.', en: 'Icon + text + CTA.' },
  'Zone visuelle + message accueillant.': {
    ar: 'منطقة بصرية + رسالة ترحيب.',
    en: 'Visual area + welcoming message.',
  },
  'Fond teinté aux couleurs de la boutique.': {
    ar: 'خلفية بلون المتجر.',
    en: 'Tinted background with store colors.',
  },
  'Tout le formulaire sur un écran.': {
    ar: 'النموذج بالكامل في شاشة واحدة.',
    en: 'Entire form on one screen.',
  },
  'Livraison puis paiement.': { ar: 'التوصيل ثم الدفع.', en: 'Shipping then payment.' },
  'CTA primaire classique.': { ar: 'زر أساسي كلاسيكي.', en: 'Classic primary CTA.' },
  'Plus grand, ombre marquée.': { ar: 'أكبر مع ظل واضح.', en: 'Larger, stronger shadow.' },
  'Teinte légère, moins agressif.': { ar: 'درجة خفيفة، أقل حدة.', en: 'Soft tint, less aggressive.' },
  'Bouton très arrondi.': { ar: 'زر دائري جداً.', en: 'Very rounded button.' },
  'Récap à droite du formulaire.': {
    ar: 'الملخص يمين النموذج.',
    en: 'Summary to the right of the form.',
  },
  'Récap avant le formulaire.': {
    ar: 'الملخص قبل النموذج.',
    en: 'Summary before the form.',
  },
  'Récap sous le formulaire.': {
    ar: 'الملخص تحت النموذج.',
    en: 'Summary below the form.',
  },
  'Moins d’espace, formulaire dense.': {
    ar: 'مسافة أقل، نموذج مكثف.',
    en: 'Less space, dense form.',
  },
  'Grands espacements premium.': {
    ar: 'مسافات واسعة فاخرة.',
    en: 'Premium large spacing.',
  },
  'Fond carte + ombre douce.': {
    ar: 'خلفية بطاقة مع ظل خفيف.',
    en: 'Card background + soft shadow.',
  },
  'Sans chrome, fond page.': {
    ar: 'بدون إطار، خلفية الصفحة.',
    en: 'No chrome, page background.',
  },
  'Contour net, sans ombre.': {
    ar: 'إطار واضح بدون ظل.',
    en: 'Clean border, no shadow.',
  },
  'Grandes options avec icônes.': {
    ar: 'خيارات كبيرة مع أيقونات.',
    en: 'Large options with icons.',
  },
  'Rangées compactes alignées.': {
    ar: 'صفوف مضغوطة ومتراصة.',
    en: 'Compact aligned rows.',
  },
  'Choix en pastilles serrées.': {
    ar: 'اختيارات على شكل حبات متقاربة.',
    en: 'Tight pill choices.',
  },
  'Titre aligné à gauche (desktop).': {
    ar: 'عنوان بمحاذاة اليسار (سطح المكتب).',
    en: 'Left-aligned title (desktop).',
  },
  'Titre centré sur toute largeur.': {
    ar: 'عنوان في الوسط بعرض كامل.',
    en: 'Centered title across full width.',
  },
  'Filtres à gauche (desktop).': {
    ar: 'الفلاتر على اليسار (سطح المكتب).',
    en: 'Filters on the left (desktop).',
  },
  'Filtres via bouton / panneau.': {
    ar: 'فلاتر عبر زر / لوحة.',
    en: 'Filters via button / panel.',
  },
  'Filtres au-dessus de la grille.': {
    ar: 'فلاتر فوق الشبكة.',
    en: 'Filters above the grid.',
  },
  'Grille serrée.': { ar: 'شبكة ضيقة.', en: 'Tight grid.' },
  'Espacement classique.': { ar: 'تباعد كلاسيكي.', en: 'Classic spacing.' },
  'Look premium aéré.': { ar: 'مظهر فاخر واسع.', en: 'Airy premium look.' },
  'Zone visuelle accueillante.': {
    ar: 'منطقة بصرية مريحة.',
    en: 'Welcoming visual area.',
  },
  'Fond teinté boutique.': { ar: 'خلفية بلون المتجر.', en: 'Store-tinted background.' },
  'Bouton Filtres → panneau latéral.': {
    ar: 'زر الفلاتر ← لوحة جانبية.',
    en: 'Filters button → side panel.',
  },
  'Panneau plein écran mobile.': {
    ar: 'لوحة ملء الشاشة للجوال.',
    en: 'Full-screen mobile panel.',
  },
  'Filtres déroulés au-dessus.': {
    ar: 'فلاتر مفتوحة في الأعلى.',
    en: 'Expanded filters on top.',
  },
  'Bandeau sous l’image.': { ar: 'شريط تحت الصورة.', en: 'Strip under the image.' },
  'Toutes les images en colonne.': {
    ar: 'كل الصور في عمود.',
    en: 'All images in a column.',
  },
  'Image + flèches, sans thumbs.': {
    ar: 'صورة + أسهم بدون مصغّرات.',
    en: 'Image + arrows, no thumbs.',
  },
  'Sections plus serrées.': { ar: 'أقسام أكثر تقارباً.', en: 'Tighter sections.' },
  'Plus d’air entre blocs.': { ar: 'مسافة أكبر بين الكتل.', en: 'More space between blocks.' },
  'Thumbs verticaux + image.': {
    ar: 'مصغّرات عمودية + صورة.',
    en: 'Vertical thumbs + image.',
  },
  'Image puis bandeau thumbs.': {
    ar: 'صورة ثم شريط مصغّرات.',
    en: 'Image then thumbs strip.',
  },
  'Images en colonne verticale.': {
    ar: 'صور في عمود عمودي.',
    en: 'Images in a vertical column.',
  },
  'Infos à côté de la galerie.': {
    ar: 'المعلومات بجانب المعرض.',
    en: 'Info beside the gallery.',
  },
  'Infos sous la galerie.': {
    ar: 'المعلومات تحت المعرض.',
    en: 'Info below the gallery.',
  },
  '1:1, look catalogue.': { ar: '1:1، مظهر كتالوج.', en: '1:1, catalog look.' },
  '4:5, mode / packaging.': { ar: '4:5، موضة / تغليف.', en: '4:5, fashion / packaging.' },
  '4:3, plus large.': { ar: '4:3، أعرض.', en: '4:3, wider.' },
  'Texte aligné à gauche.': { ar: 'نص بمحاذاة اليسار.', en: 'Left-aligned text.' },
  'Titre et prix centrés.': { ar: 'العنوان والسعر في الوسط.', en: 'Centered title and price.' },
  'Pas de mouvement au survol.': {
    ar: 'بدون حركة عند التمرير.',
    en: 'No hover motion.',
  },
  'Carte qui se soulève.': { ar: 'بطاقة ترتفع.', en: 'Card lifts up.' },
  'Image qui zoome.': { ar: 'صورة تتكبر.', en: 'Image zooms.' },
  'Zone visuelle douce.': { ar: 'منطقة بصرية ناعمة.', en: 'Soft visual area.' },
  'Formulaire + infos côte à côte.': {
    ar: 'نموذج ومعلومات جنباً إلى جنب.',
    en: 'Form + info side by side.',
  },
  'Formulaire seul, centré.': {
    ar: 'النموذج وحده في الوسط.',
    en: 'Form alone, centered.',
  },
  'Infos puis formulaire.': {
    ar: 'المعلومات ثم النموذج.',
    en: 'Info then form.',
  },
  'Fond carte + ombre.': {
    ar: 'خلفية بطاقة مع ظل.',
    en: 'Card background + shadow.',
  },
  'Sans chrome.': { ar: 'بدون إطار.', en: 'No chrome.' },
  'Contour net.': { ar: 'إطار واضح.', en: 'Clean border.' },
  'Fond primaire, fort contraste.': {
    ar: 'خلفية أساسية وتباين قوي.',
    en: 'Primary fill, strong contrast.',
  },
  'Bordure, fond transparent.': {
    ar: 'إطار وخلفية شفافة.',
    en: 'Border, transparent fill.',
  },
  'Fond teinté léger.': { ar: 'خلفية بدرجة خفيفة.', en: 'Light tinted fill.' },
  'Plein, très arrondi.': { ar: 'ممتلئ ودائري جداً.', en: 'Solid, very rounded.' },
  'Texte seul, hover discret.': {
    ar: 'نص فقط مع تأثير خفيف.',
    en: 'Text only, subtle hover.',
  },
  'Primaire → secondaire.': { ar: 'أساسي ← ثانوي.', en: 'Primary → secondary.' },
  'Fond sombre, texte clair.': {
    ar: 'خلفية داكنة ونص فاتح.',
    en: 'Dark fill, light text.',
  },
  'Ombre douce, carte classique.': {
    ar: 'ظل ناعم، بطاقة كلاسيكية.',
    en: 'Soft shadow, classic card.',
  },
  'Fond discret, minimaliste.': {
    ar: 'خلفية خفيفة وبسيطة.',
    en: 'Subtle fill, minimalist.',
  },
  'Presque sans chrome.': { ar: 'شبه بدون إطار.', en: 'Almost no chrome.' },
  'Fond translucide flouté.': {
    ar: 'خلفية شفافة مع ضبابية.',
    en: 'Translucent blurred fill.',
  },
  'Ombre forte, carte mise en avant.': {
    ar: 'ظل قوي، بطاقة بارزة.',
    en: 'Strong shadow, highlighted card.',
  },
  'Fond teinté doux, sans bordure.': {
    ar: 'خلفية ناعمة بدون إطار.',
    en: 'Soft tinted fill, no border.',
  },
  'Image dominante edge-to-edge.': {
    ar: 'صورة مهيمنة من طرف لطرف.',
    en: 'Dominant edge-to-edge image.',
  },
  'Texte + image côte à côte.': {
    ar: 'نص وصورة جنباً إلى جنب.',
    en: 'Text + image side by side.',
  },
  'Titre centré, peu d’ornement.': {
    ar: 'عنوان في الوسط وقليل من الزخرفة.',
    en: 'Centered title, little ornament.',
  },
  'Bandeau compact sous le header.': {
    ar: 'شريط مضغوط تحت الرأس.',
    en: 'Compact strip under the header.',
  },
  'Image au-dessus, texte en dessous.': {
    ar: 'صورة في الأعلى ونص تحتها.',
    en: 'Image above, text below.',
  },
  'Texte centré sur l’image.': {
    ar: 'نص في وسط الصورة.',
    en: 'Centered text over the image.',
  },
  'Mise en page magazine décalée.': {
    ar: 'تخطيط مجلة غير متماثل.',
    en: 'Offset magazine layout.',
  },
  'Brand + colonnes + bas de page.': {
    ar: 'العلامة + أعمدة + أسفل الصفحة.',
    en: 'Brand + columns + page bottom.',
  },
  'Moins d’espace, grille serrée.': {
    ar: 'مسافة أقل وشبكة ضيقة.',
    en: 'Less space, tight grid.',
  },
  'Colonnes de liens, brand réduit.': {
    ar: 'أعمدة روابط وعلامة مصغّرة.',
    en: 'Link columns, reduced brand.',
  },
  'Brand et liens centrés.': {
    ar: 'العلامة والروابط في الوسط.',
    en: 'Centered brand and links.',
  },
  'Brand puis liens en colonnes verticales.': {
    ar: 'العلامة ثم روابط بأعمدة عمودية.',
    en: 'Brand then vertical link columns.',
  },
  'Grands produits, look éditorial.': {
    ar: 'منتجات كبيرة، مظهر تحريري.',
    en: 'Large products, editorial look.',
  },
  'Équilibre catalogue.': { ar: 'توازن الكتالوج.', en: 'Catalog balance.' },
  'Densité maximale.': { ar: 'أقصى كثافة.', en: 'Maximum density.' },
  'Grands favoris.': { ar: 'مفضلات كبيرة.', en: 'Large wishlist items.' },
  'Équilibre.': { ar: 'توازن.', en: 'Balance.' },
  'Densité max.': { ar: 'أقصى كثافة.', en: 'Max density.' },
};

function extractItems(body) {
  const items = [];
  const ire =
    /key:\s*'([^']+)'\s*,\s*label:\s*'((?:\\'|[^'])*)'\s*,\s*description:\s*'((?:\\'|[^'])*)'/g;
  let im;
  while ((im = ire.exec(body))) {
    items.push({
      key: im[1],
      label: im[2].replace(/\\'/g, "'"),
      description: im[3].replace(/\\'/g, "'"),
    });
  }
  // also double-quoted descriptions with backticks? skip
  const ire2 =
    /key:\s*'([^']+)'\s*,\s*label:\s*'((?:\\'|[^'])*)'\s*,\s*description:\s*"((?:\\"|[^"])*)"/g;
  while ((im = ire2.exec(body))) {
    if (!items.find((x) => x.key === im[1])) {
      items.push({
        key: im[1],
        label: im[2].replace(/\\'/g, "'"),
        description: im[3].replace(/\\"/g, '"'),
      });
    }
  }
  return items;
}

const fr = {};
const ar = {};
const en = {};
const missingLabels = new Set();
const missingDescs = new Set();

const re = /export const ([A-Z_]+):[^=]*=\s*\[([\s\S]*?)\];/g;
let m;
while ((m = re.exec(src))) {
  const name = m[1];
  const group = ARRAY_TO_GROUP[name];
  if (!group) continue;
  const items = extractItems(m[2]);
  for (const item of items) {
    const lk = `${group}.${item.key}`;
    const dk = `${group}.${item.key}.desc`;
    fr[lk] = item.label;
    fr[dk] = item.description;
    const lt = TR[item.label];
    if (lt) {
      ar[lk] = lt.ar;
      en[lk] = lt.en;
    } else {
      missingLabels.add(item.label);
      ar[lk] = item.label;
      en[lk] = item.label;
    }
    const dt = DESC_TR[item.description];
    if (dt) {
      ar[dk] = dt.ar;
      en[dk] = dt.en;
    } else {
      missingDescs.add(item.description);
      ar[dk] = item.description;
      en[dk] = item.description;
    }
  }
}

const out = `import type { StoreLocale } from '@/i18n/messages';

/** Labels / descriptions des options Apparence (clé = \`group.optionKey\`). */
export const appearanceOptionI18n: Record<StoreLocale, Record<string, string>> = {
  fr: ${JSON.stringify(fr, null, 2)},
  ar: ${JSON.stringify(ar, null, 2)},
  en: ${JSON.stringify(en, null, 2)},
};

export function appearanceOptLabel(
  locale: StoreLocale,
  group: string,
  key: string,
  fallback: string,
): string {
  return appearanceOptionI18n[locale][\`\${group}.\${key}\`]
    ?? appearanceOptionI18n.fr[\`\${group}.\${key}\`]
    ?? fallback;
}

export function appearanceOptDesc(
  locale: StoreLocale,
  group: string,
  key: string,
  fallback: string,
): string {
  return appearanceOptionI18n[locale][\`\${group}.\${key}.desc\`]
    ?? appearanceOptionI18n.fr[\`\${group}.\${key}.desc\`]
    ?? fallback;
}
`;

fs.writeFileSync(
  path.join(__dirname, '..', 'src', 'i18n', 'admin', 'appearanceOptionI18n.ts'),
  out,
);
console.log('wrote', Object.keys(fr).length / 2, 'options');
if (missingLabels.size) {
  console.log('MISSING LABELS:');
  [...missingLabels].forEach((x) => console.log(' -', x));
}
if (missingDescs.size) {
  console.log('MISSING DESCS', missingDescs.size);
  [...missingDescs].slice(0, 20).forEach((x) => console.log(' -', x));
}
