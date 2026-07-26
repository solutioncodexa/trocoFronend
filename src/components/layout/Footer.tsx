import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { cn } from '@/lib/utils';
import { ANIMATIONS } from '@/config/animations';
import { BrandLogoImg } from '@/components/layout/BrandLogoImg';
import { SocialLinks } from '@/components/layout/SocialLinks';
import { useStoreBrand } from '@/hooks/useStoreBrand';
import { useStorefrontPath } from '@/hooks/useStorefrontPath';
import { useSystemNavReplacements } from '@/hooks/useSystemNavReplacements';
import { useGlobalSections } from '@/hooks/useGlobalSections';
import { categoriesApi } from '@/services/api/categories';
import { staticCatalogQueryOptions } from '@/config/queryOptions';

const Footer = () => {
  const {
    siteName,
    tagline,
    freeShippingThreshold,
    contactEmail,
    contactPhone,
    contactCity,
    store,
  } = useStoreBrand();
  const { to, isDemo, demo } = useStorefrontPath();
  const { navHref, isReplaced } = useSystemNavReplacements();
  const { footerLinksConfig } = useGlobalSections();
  const useCustomFooter = !!footerLinksConfig?.columns.length;
  const surMesureOn = isDemo || store?.surMesureEnabled !== false;

  const { data: categories = [] } = useQuery({
    queryKey: ['categories', 'nav', 'footer'],
    queryFn: () => categoriesApi.getNavCategories(),
    ...staticCatalogQueryOptions,
    enabled: !isDemo,
  });

  const rootCategories = isDemo
    ? (demo?.categories ?? []).slice(0, 6).map((c) => ({ id: c.id, name: c.name, slug: c.slug }))
    : categories.filter((c) => !c.parentId).slice(0, 6);

  const footerLinkClass = cn(
    'text-muted-foreground transition-colors hover:text-primary',
    ANIMATIONS.footerLinkUnderline && 'footer-link-gold',
  );
  const socialIconClass = cn(
    'flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-card text-primary transition-all duration-300 hover:border-primary hover:bg-primary hover:text-primary-foreground',
    ANIMATIONS.footerSocialIconHover && 'hover:scale-105',
  );

  const resolveFooterHref = (href: string) => {
    if (/^https?:\/\//i.test(href)) return href;
    const path = href.startsWith('/') ? href : `/${href}`;
    return to(path);
  };

  return (
    <footer className="w-full max-w-full min-w-0 overflow-x-hidden border-t border-border bg-muted/50 text-foreground">
      <div className="page-padding mx-auto max-w-[1280px] pb-8 pt-14 sm:pb-10 sm:pt-16 md:pt-20">
        <div
          className={cn(
            'mb-12 grid grid-cols-1 gap-10 md:grid-cols-2 lg:mb-16 lg:gap-12',
            useCustomFooter ? 'lg:grid-cols-[minmax(0,1.2fr)_repeat(auto-fit,minmax(10rem,1fr))]' : 'lg:grid-cols-4',
          )}
        >
          <div className="flex w-full flex-col items-center gap-5 lg:items-start">
            <BrandLogoImg
              className="h-14 w-auto object-contain object-center sm:h-16 md:h-20"
              draggable={false}
            />
            <p className="max-w-xs text-center text-sm leading-relaxed text-muted-foreground lg:text-left">
              {tagline}
            </p>
            {(contactEmail || contactPhone || contactCity) && (
              <div className="space-y-1 text-center text-sm text-muted-foreground lg:text-left">
                {contactCity ? <p>{contactCity}</p> : null}
                {contactPhone ? <p>{contactPhone}</p> : null}
                {contactEmail ? (
                  <a className="text-primary hover:underline" href={`mailto:${contactEmail}`}>
                    {contactEmail}
                  </a>
                ) : null}
              </div>
            )}
            <SocialLinks
              className="justify-center lg:justify-start"
              linkClassName={socialIconClass}
            />
          </div>

          {useCustomFooter ? (
            footerLinksConfig!.columns.map((col, colIndex) => (
              <div key={`${col.title}-${colIndex}`}>
                <h5 className="mb-5 font-display text-sm font-semibold tracking-wide text-foreground">
                  {col.title}
                </h5>
                <ul className="flex flex-col gap-3 text-sm">
                  {col.links.map((link, linkIndex) => {
                    const href = resolveFooterHref(link.href);
                    const external = /^https?:\/\//i.test(link.href);
                    return (
                      <li key={`${link.href}-${linkIndex}`}>
                        {external ? (
                          <a className={footerLinkClass} href={href} rel="noopener noreferrer">
                            {link.label}
                          </a>
                        ) : (
                          <Link className={footerLinkClass} to={href}>
                            {link.label}
                          </Link>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))
          ) : (
            <>
          <div>
            <h5 className="mb-5 font-display text-sm font-semibold tracking-wide text-foreground">
              Catégories
            </h5>
            <ul className="flex flex-col gap-3 text-sm">
              {rootCategories.length > 0 ? (
                rootCategories.map((c) => (
                  <li key={c.id}>
                    <Link
                      className={footerLinkClass}
                      to={c.slug ? to(`/boutique?category=${c.slug}`) : to('/boutique')}
                    >
                      {c.name}
                    </Link>
                  </li>
                ))
              ) : (
                <li>
                  <Link className={footerLinkClass} to={to('/boutique')}>
                    Voir la boutique
                  </Link>
                </li>
              )}
            </ul>
          </div>

          <div>
            <h5 className="mb-5 font-display text-sm font-semibold tracking-wide text-foreground">
              Informations
            </h5>
            <ul className="flex flex-col gap-3 text-sm">
              <li><Link className={footerLinkClass} to={to('/boutique')}>Boutique</Link></li>
              <li>
                <Link className={footerLinkClass} to={navHref('/blog')}>
                  Blog
                </Link>
              </li>
              {(surMesureOn || isReplaced('/sur-mesure')) ? (
                <li>
                  <Link className={footerLinkClass} to={navHref('/sur-mesure')}>
                    Sur-mesure
                  </Link>
                </li>
              ) : null}
              {(surMesureOn || isReplaced('/devis')) ? (
                <li>
                  <Link className={footerLinkClass} to={navHref('/devis')}>
                    Demande de devis
                  </Link>
                </li>
              ) : null}
              <li>
                <Link className={footerLinkClass} to={navHref('/codes-promo')}>
                  Codes promo
                </Link>
              </li>
              <li>
                <Link className={footerLinkClass} to={navHref('/livraison-retours')}>
                  Livraison & Retours
                </Link>
              </li>
              <li>
                <Link className={footerLinkClass} to={navHref('/faq')}>
                  FAQ
                </Link>
              </li>
              <li>
                <Link className={footerLinkClass} to={navHref('/contact')}>
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h5 className="mb-5 font-display text-sm font-semibold tracking-wide text-foreground">
              Newsletter
            </h5>
            <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
              {freeShippingThreshold > 0
                ? `Livraison gratuite dès ${freeShippingThreshold} DH. Recevez nos nouveautés.`
                : 'Recevez nos nouveautés et offres.'}
            </p>
            <form className="flex flex-col gap-3" onSubmit={(e) => e.preventDefault()}>
              <label className="sr-only" htmlFor="footer-newsletter-email">
                Adresse email
              </label>
              <input
                id="footer-newsletter-email"
                className="rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/70 transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                placeholder="Votre email"
                type="email"
                autoComplete="email"
              />
              <button
                className="rounded-xl bg-primary px-6 py-3 text-xs font-bold uppercase tracking-wider text-primary-foreground transition-colors hover:bg-primary/90"
                type="submit"
              >
                S&apos;inscrire
              </button>
            </form>
          </div>
              </>
            )}
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-border pt-6 text-center text-xs text-muted-foreground sm:pt-8 md:flex-row md:text-left">
          <p>© {new Date().getFullYear()} {siteName}. Tous droits réservés.</p>
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
            <Link className={footerLinkClass} to="#">Mentions Légales</Link>
            <Link className={footerLinkClass} to="#">Confidentialité</Link>
            <Link className={footerLinkClass} to="#">CGV</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
