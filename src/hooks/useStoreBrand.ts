import { useMemo } from 'react';
import { useTenant } from '@/contexts/TenantContext';
import { useStorefrontBrandOverride } from '@/contexts/StorefrontBrandOverride';
import { FREE_SHIPPING_THRESHOLD_MAD, PUBLIC_SITE_NAME } from '@/config/site';
import { resolvePublicImageUrl } from '@/utils/resolvePublicImageUrl';

function toWhatsAppUrl(raw?: string | null): string | null {
  if (!raw?.trim()) return null;
  const v = raw.trim();
  if (v.startsWith('http://') || v.startsWith('https://') || v.startsWith('wa.me')) {
    return v.startsWith('wa.me') ? `https://${v}` : v;
  }
  const digits = v.replace(/\D/g, '');
  if (!digits) return null;
  return `https://wa.me/${digits}`;
}

function toTelHref(phone?: string | null): string | null {
  if (!phone?.trim()) return null;
  const digits = phone.replace(/[^\d+]/g, '');
  return digits ? `tel:${digits}` : null;
}

/**
 * Branding boutique courant (Shopify-like) — nom, logo, contact, couleurs.
 * Fallback neutre Matjarona si aucune boutique résolue.
 */
export function useStoreBrand() {
  const { store, slug, isLoading } = useTenant();
  const override = useStorefrontBrandOverride();

  return useMemo(() => {
    const siteName =
      override?.siteName?.trim() || store?.siteName?.trim() || PUBLIC_SITE_NAME || 'Boutique';
    const tagline =
      override?.tagline?.trim() ||
      store?.tagline?.trim() ||
      (store || override ? 'Votre boutique en ligne' : 'Créez votre boutique en ligne');
    const rawLogo = override?.logoUrl ?? store?.logoUrl;
    const logoUrl = rawLogo ? resolvePublicImageUrl(rawLogo) : null;
    const faviconUrl = store?.faviconUrl ? resolvePublicImageUrl(store.faviconUrl) : null;
    const freeShippingThreshold =
      store?.freeShippingThreshold != null && store.freeShippingThreshold > 0
        ? Number(store.freeShippingThreshold)
        : FREE_SHIPPING_THRESHOLD_MAD;

    const contactEmail = store?.contactEmail?.trim() || null;
    const contactPhone = store?.contactPhone?.trim() || null;
    const contactCity = store?.contactCity?.trim() || null;
    const whatsappUrl = toWhatsAppUrl(store?.contactWhatsapp) || toWhatsAppUrl(contactPhone);

    return {
      store,
      slug,
      isLoading,
      siteName,
      tagline,
      aboutText: override?.aboutText?.trim() || store?.aboutText?.trim() || null,
      logoUrl,
      faviconUrl,
      primaryColor: override?.primaryColor?.trim() || store?.primaryColor?.trim() || null,
      secondaryColor: override?.secondaryColor?.trim() || store?.secondaryColor?.trim() || null,
      freeShippingThreshold,
      contactEmail,
      contactPhone,
      contactPhoneHref: toTelHref(contactPhone),
      contactCity,
      whatsappUrl,
      facebookUrl: store?.facebookUrl?.trim() || null,
      instagramUrl: store?.instagramUrl?.trim() || null,
      tiktokUrl: store?.tiktokUrl?.trim() || null,
      whatsappOrderTemplate: store?.whatsappOrderTemplate?.trim() || null,
      contactWhatsapp: store?.contactWhatsapp?.trim() || null,
      hasStore: !!store || !!override,
    };
  }, [store, slug, isLoading, override]);
}
