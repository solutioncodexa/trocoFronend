import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useTenant } from '@/contexts/TenantContext';
import { useAdminLocale } from '@/contexts/AdminLocaleContext';
import { buildFreshStorefrontUrl } from '@/utils/storefrontUrl';

const SETUP_PATH = '/admin/onboarding';

/**
 * Ouvre la vitrine publique uniquement si la boutique a un slug et est lancée.
 * Sinon : toast + redirection vers l’assistant (configurer / publier).
 */
export function useOpenStorefront() {
  const navigate = useNavigate();
  const { store, slug: tenantSlug } = useTenant();
  const { t } = useAdminLocale();

  const slug = (tenantSlug || store?.slug || '').trim().toLowerCase() || null;
  const isLive = store?.storefrontLive !== false;
  const canViewPublic = !!slug && isLive;

  const openStorefront = useCallback(() => {
    if (!slug) {
      toast.message(t('launch.needSetup'), {
        description: t('launch.needSetupBody'),
      });
      navigate(SETUP_PATH);
      return;
    }
    if (store?.storefrontLive === false) {
      toast.message(t('launch.title'), {
        description: t('launch.body'),
      });
      navigate(SETUP_PATH);
      return;
    }
    window.open(buildFreshStorefrontUrl(slug), '_blank', 'noopener,noreferrer');
  }, [navigate, slug, store?.storefrontLive, t]);

  return {
    slug,
    canViewPublic,
    isLive,
    openStorefront,
    storefrontUrl: slug ? buildFreshStorefrontUrl(slug) : null,
  };
}
