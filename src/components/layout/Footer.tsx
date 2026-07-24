import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { ANIMATIONS } from '@/config/animations';
import { BrandLogoImg } from '@/components/layout/BrandLogoImg';
import { SocialLinks } from '@/components/layout/SocialLinks';

const Footer = () => {
  const footerLinkClass = cn(
    'text-muted-foreground transition-colors hover:text-primary',
    ANIMATIONS.footerLinkUnderline && 'footer-link-gold',
  );
  const socialIconClass = cn(
    'flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-card text-primary transition-all duration-300 hover:border-primary hover:bg-primary hover:text-primary-foreground',
    ANIMATIONS.footerSocialIconHover && 'hover:scale-105',
  );

  return (
    <footer className="w-full max-w-full min-w-0 overflow-x-hidden border-t border-border bg-muted/50 text-foreground">
      <div className="page-padding mx-auto max-w-[1280px] pb-8 pt-14 sm:pb-10 sm:pt-16 md:pt-20">
        <div className="mb-12 grid grid-cols-1 gap-10 md:grid-cols-2 lg:mb-16 lg:grid-cols-4 lg:gap-12">
          <div className="flex w-full flex-col items-center gap-5 lg:items-start">
            <BrandLogoImg
              className="h-14 w-auto object-contain object-center sm:h-16 md:h-20"
              draggable={false}
            />
            <p className="max-w-xs text-center text-sm leading-relaxed text-muted-foreground lg:text-left">
              Emballage professionnel pour e-commerce au Maroc.
            </p>
            <SocialLinks
              className="justify-center lg:justify-start"
              linkClassName={socialIconClass}
            />
          </div>

          <div>
            <h5 className="mb-5 font-display text-sm font-semibold tracking-wide text-foreground">Catégories</h5>
            <ul className="flex flex-col gap-3 text-sm">
              <li><Link className={footerLinkClass} to="/boutique?category=sachets-pochettes">Sachets & Pochettes</Link></li>
              <li><Link className={footerLinkClass} to="/boutique?category=carton-boites">Carton & Boites</Link></li>
              <li><Link className={footerLinkClass} to="/boutique?category=protections">Protections</Link></li>
              <li><Link className={footerLinkClass} to="/boutique?category=decorations">Décorations</Link></li>
              <li><Link className={footerLinkClass} to="/boutique?category=materiels">Matériels</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="mb-5 font-display text-sm font-semibold tracking-wide text-foreground">Informations</h5>
            <ul className="flex flex-col gap-3 text-sm">
              <li><Link className={footerLinkClass} to="/boutique">Boutique</Link></li>
              <li><Link className={footerLinkClass} to="/sur-mesure">Sur-mesure</Link></li>
              <li><Link className={footerLinkClass} to="/devis">Demande de devis</Link></li>
              <li><Link className={footerLinkClass} to="/codes-promo">Codes promo</Link></li>
              <li><Link className={footerLinkClass} to="/livraison-retours">Livraison & Retours</Link></li>
              <li><Link className={footerLinkClass} to="/faq">FAQ</Link></li>
              <li><Link className={footerLinkClass} to="/contact">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="mb-5 font-display text-sm font-semibold tracking-wide text-foreground">Newsletter</h5>
            <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
              Livraison gratuite dès 750 DH. Recevez nos nouveautés emballage.
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
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-border pt-6 text-center text-xs text-muted-foreground sm:pt-8 md:flex-row md:text-left">
          <p>© {new Date().getFullYear()} Troco. Tous droits réservés.</p>
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
