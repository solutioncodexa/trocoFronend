/**
 * Active ou désactive chaque animation (une ligne = un effet à ajuster).
 * Mettre `false` pour désactiver sans toucher au code des composants.
 */
export const ANIMATIONS = {
  /** Fond du hero : zoom lent type Ken Burns sur l’image */
  heroKenBurns: true,

  /** Hero : le bloc titre / texte / CTA apparaît en fondu (remplace le pulse sur le surtitre) */
  heroContentFadeIn: true,

  /** Sections au scroll (accueil : catégories, Heritage, Sur-Mesure, témoignage) */
  sectionRevealOnScroll: true,

  /** Reflet lumineux au survol sur les CTA principaux (hero + boutons type “Voir le produit”) */
  ctaShineOnHover: true,

  /** Cartes produit : léger lift + zoom image au survol */
  productCardHover: true,

  /** Grille boutique : les cartes apparaissent en cascade */
  productGridStagger: true,

  /** Home — grilles produits : cascade sur les cartes */
  homeCollectionStagger: true,

  /** Liens du menu desktop : soulignement animé (classe `link-underline`) */
  navLinkUnderline: true,

  /** Léger fondu à chaque changement de page (le contenu du `main` est remonté avec la clé route) */
  pageFadeOnRouteChange: true,

  /** Menu mobile : panneau qui glisse depuis le haut + fondu */
  mobileNavSlideDown: true,

  /** Logo dans le header : léger agrandissement au survol */
  headerLogoHover: true,

  /** Liens du pied de page (colonnes + bas de page) : soulignement or animé */
  footerLinkUnderline: true,

  /** Pastilles réseaux sociaux dans le footer : zoom léger au survol */
  footerSocialIconHover: true,

  /** Barre d’info (TopBar) : léger pulse sur le texte (un seul message ; désactivé si rotation pour éviter le conflit avec le fondu) */
  topBarTextPulse: true,
} as const;

export type AnimationFlag = keyof typeof ANIMATIONS;
