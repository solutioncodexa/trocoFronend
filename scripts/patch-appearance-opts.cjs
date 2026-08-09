const fs = require('fs');
const path = require('path');
const file = path.join(
  __dirname,
  '..',
  'src',
  'components',
  'admin',
  'appearance',
  'AppearanceSectionEditors.tsx',
);
let src = fs.readFileSync(file, 'utf8');

const pairs = [
  ['BUTTON_STYLES.map', 'buttonStyles.map'],
  ['CARD_STYLES.map', 'cardStyles.map'],
  ['CARD_IMAGE_RATIOS.map', 'cardImageRatios.map'],
  ['CARD_INFO_ALIGNS.map', 'cardInfoAligns.map'],
  ['CARD_HOVER_EFFECTS.map', 'cardHoverEffects.map'],
  ['HERO_STYLES.map', 'heroStyles.map'],
  ['HEADER_LAYOUTS.map', 'headerLayouts.map'],
  ['FOOTER_LAYOUTS.map', 'footerLayouts.map'],
  ['CART_DENSITIES.map', 'cartDensities.map'],
  ['CART_EMPTY_STYLES.map', 'cartEmptyStyles.map'],
  ['CHECKOUT_LAYOUTS.map', 'checkoutLayouts.map'],
  ['CHECKOUT_SUMMARY_POSITIONS.map', 'checkoutSummaryPositions.map'],
  ['CHECKOUT_DENSITIES.map', 'checkoutDensities.map'],
  ['CHECKOUT_FORM_STYLES.map', 'checkoutFormStyles.map'],
  ['CHECKOUT_PAYMENT_STYLES.map', 'checkoutPaymentStyles.map'],
  ['CHECKOUT_HEADING_ALIGNS.map', 'checkoutHeadingAligns.map'],
  ['CHECKOUT_CTA_EMPHASIS.map', 'checkoutCtaEmphasis.map'],
  ['SHOP_FILTER_LAYOUTS.map', 'shopFilterLayouts.map'],
  ['SHOP_GRID_COLUMNS.map', 'shopGridColumns.map'],
  ['SHOP_DENSITIES.map', 'shopDensities.map'],
  ['SHOP_EMPTY_STYLES.map', 'shopEmptyStyles.map'],
  ['SHOP_FILTER_MOBILES.map', 'shopFilterMobiles.map'],
  ['PRODUCT_GALLERY_LAYOUTS.map', 'productGalleryLayouts.map'],
  ['PRODUCT_GALLERY_MOBILES.map', 'productGalleryMobiles.map'],
  ['PRODUCT_INFO_POSITIONS.map', 'productInfoPositions.map'],
  ['WISHLIST_GRID_COLUMNS.map', 'wishlistGridColumns.map'],
  ['WISHLIST_EMPTY_STYLES.map', 'wishlistEmptyStyles.map'],
  ['FORMS_LAYOUTS.map', 'formsLayouts.map'],
  ['FORMS_STYLES.map', 'formsStyles.map'],
  ['HOME_DENSITIES.map', 'homeDensities.map'],
];

for (const [from, to] of pairs) {
  src = src.split(from).join(to);
}

// Group titles
const groups = [
  ['<GroupTitle>Arrondis</GroupTitle>', "<GroupTitle>{t('appearance.group.radius')}</GroupTitle>"],
  ['<GroupTitle>Surfaces rapides</GroupTitle>', "<GroupTitle>{t('appearance.group.surfaces')}</GroupTitle>"],
  ['<GroupTitle>Fonds</GroupTitle>', "<GroupTitle>{t('appearance.group.backgrounds')}</GroupTitle>"],
  ['<GroupTitle>Textes</GroupTitle>', "<GroupTitle>{t('appearance.group.texts')}</GroupTitle>"],
  ['<GroupTitle>Scrollbar</GroupTitle>', "<GroupTitle>{t('appearance.group.scrollbar')}</GroupTitle>"],
  ['<GroupTitle>Disposition</GroupTitle>', "<GroupTitle>{t('appearance.group.layout')}</GroupTitle>"],
  ['<GroupTitle>Style header</GroupTitle>', "<GroupTitle>{t('appearance.group.headerStyle')}</GroupTitle>"],
  ['<GroupTitle>Éléments</GroupTitle>', "<GroupTitle>{t('appearance.group.elements')}</GroupTitle>"],
  ['<GroupTitle>Bandeaux promo</GroupTitle>', "<GroupTitle>{t('appearance.group.promoBars')}</GroupTitle>"],
  ['<GroupTitle>Boutons système</GroupTitle>', "<GroupTitle>{t('appearance.group.systemButtons')}</GroupTitle>"],
  ['<GroupTitle>Pages personnalisées</GroupTitle>', "<GroupTitle>{t('appearance.group.customPages')}</GroupTitle>"],
  ['<GroupTitle>Logo</GroupTitle>', "<GroupTitle>{t('appearance.group.logo')}</GroupTitle>"],
  ['<GroupTitle>Favicon</GroupTitle>', "<GroupTitle>{t('appearance.group.favicon')}</GroupTitle>"],
  ['<GroupTitle>Schémas de couleurs</GroupTitle>', "<GroupTitle>{t('appearance.group.colorSchemes')}</GroupTitle>"],
  ['<GroupTitle>Personnaliser</GroupTitle>', "<GroupTitle>{t('appearance.group.customize')}</GroupTitle>"],
  ['<GroupTitle>Aperçu</GroupTitle>', "<GroupTitle>{t('appearance.group.preview')}</GroupTitle>"],
  ['<GroupTitle>Densité</GroupTitle>', "<GroupTitle>{t('appearance.group.density')}</GroupTitle>"],
  ['<GroupTitle>Panier vide</GroupTitle>', "<GroupTitle>{t('appearance.group.emptyCart')}</GroupTitle>"],
  ['<GroupTitle>Position du récap</GroupTitle>', "<GroupTitle>{t('appearance.group.summaryPos')}</GroupTitle>"],
  ['<GroupTitle>Style formulaire</GroupTitle>', "<GroupTitle>{t('appearance.group.formStyle')}</GroupTitle>"],
  ['<GroupTitle>Style paiements</GroupTitle>', "<GroupTitle>{t('appearance.group.paymentStyle')}</GroupTitle>"],
  ['<GroupTitle>Titre</GroupTitle>', "<GroupTitle>{t('appearance.group.title')}</GroupTitle>"],
  ['<GroupTitle>Bouton de paiement</GroupTitle>', "<GroupTitle>{t('appearance.group.payButton')}</GroupTitle>"],
  ['<GroupTitle>Options</GroupTitle>', "<GroupTitle>{t('appearance.group.options')}</GroupTitle>"],
];
for (const [from, to] of groups) {
  src = src.split(from).join(to);
}

// subsection labels
src = src.split('Style carte').join("{t('appearance.group.cardStyle')}");
src = src.split('>« Auto » utilise la couleur du thème actif. Ou choisissez une surface prête.<').join(
  ">{t('appearance.autoSurfaceHint')}<",
);
if (src.includes('« Auto » utilise la couleur')) {
  src = src.split('« Auto » utilise la couleur du thème actif. Ou choisissez une surface prête.').join(
    "{t('appearance.autoSurfaceHint')}",
  );
}

fs.writeFileSync(file, src);
console.log('patched editors');
