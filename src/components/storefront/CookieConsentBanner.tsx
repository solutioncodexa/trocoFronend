import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useTenant } from '@/contexts/TenantContext';
import { useLocale } from '@/contexts/LocaleContext';
import { useStorefrontPath } from '@/hooks/useStorefrontPath';
import { useStoreLang } from '@/hooks/useStoreLang';
import { resolvePrivacyPolicyLink } from '@/config/legalPages';
import {
  consentDecisionMade,
  writeCookieConsent,
} from '@/utils/cookieConsent';

const CookieConsentBanner = () => {
  const { store } = useTenant();
  const { t } = useLocale();
  const { to } = useStorefrontPath();
  const { withLang } = useStoreLang();
  const slug = store?.slug;
  const consentRequired = store?.cookieConsentRequired !== false;
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!slug || !consentRequired) {
      setVisible(false);
      return;
    }
    setVisible(!consentDecisionMade(slug, consentRequired));
  }, [slug, consentRequired]);

  if (!visible || !slug) return null;

  const save = (marketing: boolean) => {
    writeCookieConsent(slug, marketing);
    setVisible(false);
    window.dispatchEvent(new CustomEvent('matjarona:consent-updated'));
  };

  const privacy = resolvePrivacyPolicyLink(store?.privacyPolicyUrl);

  return (
    <div
      role="dialog"
      aria-labelledby="cookie-consent-title"
      className="fixed inset-x-0 bottom-0 z-[60] border-t border-border bg-card/95 p-4 shadow-lg backdrop-blur-sm sm:p-5"
    >
      <div className="container mx-auto flex max-w-4xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0 space-y-1">
          <p id="cookie-consent-title" className="text-sm font-semibold text-foreground">
            {t('cookieTitle')}
          </p>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {t('cookieBody')}{' '}
            {privacy.external ? (
              <a
                href={privacy.path}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline-offset-2 hover:underline"
              >
                {t('privacyPolicy')}
              </a>
            ) : (
              <Link
                to={withLang(to(privacy.path))}
                className="text-primary underline-offset-2 hover:underline"
              >
                {t('privacyPolicy')}
              </Link>
            )}
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap gap-2">
          <Button type="button" variant="outline" size="sm" onClick={() => save(false)}>
            {t('essentialOnly')}
          </Button>
          <Button type="button" size="sm" onClick={() => save(true)}>
            {t('acceptAll')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsentBanner;
