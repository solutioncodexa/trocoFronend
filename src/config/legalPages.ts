import type { StorePageBlock, UpsertStorePagePayload } from '@/types/store-pages';

export type LegalPageContext = {
  storeName: string;
  contactEmail?: string;
  contactPhone?: string;
  contactCity?: string;
};

export type LegalPageTemplate = {
  slug: string;
  meta: UpsertStorePagePayload;
  blocks: StorePageBlock[];
};

export const PRIVACY_PAGE_SLUG = 'politique-de-confidentialite';

/** Rappel affiché au marchand : ces textes sont des modèles à faire valider. */
export const LEGAL_DISCLAIMER =
  'Ces textes sont des modèles génériques : relisez-les, complétez les informations entre crochets et faites-les valider avant publication.';

function section(sortOrder: number, title: string, body: string): StorePageBlock {
  return { type: 'rich_text', sortOrder, config: { title, body } };
}

function page(
  slug: string,
  title: string,
  sections: Array<[string, string]>,
): LegalPageTemplate {
  return {
    slug,
    meta: { title, slug, isHome: false, showInNav: false, published: true },
    blocks: sections.map(([t, body], i) => section(i, t, body)),
  };
}

/** Modèles de pages légales (FR) pré-remplis avec les coordonnées de la boutique. */
export function buildLegalPages(ctx: LegalPageContext): LegalPageTemplate[] {
  const name = ctx.storeName.trim() || 'Notre boutique';
  const email = ctx.contactEmail?.trim() || '[email de contact]';
  const phone = ctx.contactPhone?.trim() || '[téléphone]';
  const city = ctx.contactCity?.trim() || '[ville], Maroc';

  return [
    page('mentions-legales', 'Mentions légales', [
      [
        'Éditeur du site',
        `${name}\nAdresse : ${city}\nEmail : ${email}\nTéléphone : ${phone}\nIdentifiant légal (RC / ICE) : [à compléter]`,
      ],
      [
        'Hébergement',
        'Le site est édité avec la plateforme Get STORE. Hébergeur : [nom et adresse de l’hébergeur].',
      ],
      [
        'Propriété intellectuelle',
        `L’ensemble des contenus de ce site (textes, images, logos) est la propriété de ${name} ou de ses partenaires. Toute reproduction sans autorisation est interdite.`,
      ],
    ]),
    page('conditions-generales-de-vente', 'Conditions générales de vente', [
      [
        'Objet',
        `Les présentes conditions régissent les ventes de produits proposés par ${name} sur ce site. Toute commande implique l’acceptation de ces conditions.`,
      ],
      [
        'Produits et prix',
        'Les produits sont décrits avec la plus grande exactitude possible. Les prix sont indiqués en dirhams marocains (MAD), toutes taxes comprises, hors frais de livraison précisés avant la validation de la commande.',
      ],
      [
        'Commande',
        'La commande est validée après confirmation par notre équipe. Nous pouvons vous contacter par téléphone ou WhatsApp pour vérifier les informations de livraison.',
      ],
      [
        'Paiement',
        'Les moyens de paiement acceptés sont affichés lors de la commande (paiement à la livraison et/ou paiement en ligne selon la disponibilité).',
      ],
      [
        'Livraison',
        'Les délais et frais de livraison dépendent de la ville et du transporteur choisi. Ils sont indiqués avant la validation de la commande. Vous recevez un numéro de suivi dès l’expédition.',
      ],
      [
        'Réclamations',
        `Pour toute réclamation, contactez-nous à ${email} ou au ${phone}. Nous nous engageons à vous répondre dans les meilleurs délais.`,
      ],
    ]),
    page('retours-remboursements', 'Retours et remboursements', [
      [
        'Délai de retour',
        'Vous disposez de [7] jours après réception pour demander le retour d’un produit non utilisé, dans son emballage d’origine.',
      ],
      [
        'Procédure',
        `Contactez-nous à ${email} en indiquant votre numéro de commande et le motif du retour. Nous vous indiquerons la marche à suivre.`,
      ],
      [
        'Remboursement',
        'Après réception et vérification du produit retourné, le remboursement est effectué selon le même moyen de paiement dans un délai de [10] jours.',
      ],
      [
        'Produits non retournables',
        'Certains produits (hygiène, personnalisés, denrées périssables) ne peuvent être ni repris ni échangés. Ces exceptions sont précisées sur la fiche produit.',
      ],
    ]),
    page(PRIVACY_PAGE_SLUG, 'Politique de confidentialité', [
      [
        'Données collectées',
        'Nous collectons uniquement les données nécessaires au traitement de vos commandes et à la relation client : nom, téléphone, adresse de livraison, email.',
      ],
      [
        'Utilisation',
        'Vos données servent à traiter et livrer vos commandes, vous informer de leur suivi et, avec votre accord, vous adresser nos offres. Elles ne sont jamais vendues à des tiers.',
      ],
      [
        'Cookies',
        'Nous utilisons des cookies de fonctionnement et, avec votre consentement, des cookies de mesure d’audience et de publicité.',
      ],
      [
        'Vos droits',
        `Conformément à la loi n° 09-08 relative à la protection des personnes physiques à l’égard du traitement des données à caractère personnel, vous disposez d’un droit d’accès, de rectification et d’opposition. Pour l’exercer, écrivez à ${email}.`,
      ],
      [
        'Conservation',
        'Vos données sont conservées pendant la durée nécessaire aux finalités décrites ci-dessus, puis supprimées ou anonymisées.',
      ],
    ]),
  ];
}
