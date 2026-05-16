import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { ANIMATIONS } from '@/config/animations';
import { BrandLogoImg } from '@/components/layout/BrandLogoImg';

const Footer = () => {
  const footerLinkClass = cn(
    'hover:text-primary transition-colors',
    ANIMATIONS.footerLinkUnderline && 'footer-link-gold'
  );
  const socialIconClass = cn(
    'w-10 h-10 rounded-full border border-primary/30 flex items-center justify-center text-primary hover:bg-primary hover:text-royal-bordeaux transition-all duration-300',
    ANIMATIONS.footerSocialIconHover && 'hover:scale-110'
  );

  return (
    <footer className="bg-royal-bordeaux text-ivory-text pt-12 sm:pt-16 md:pt-20 pb-8 sm:pb-10 border-t-4 border-primary w-full max-w-full min-w-0 overflow-x-hidden">
      <div className="max-w-[1280px] mx-auto page-padding">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 lg:gap-12 mb-12 sm:mb-16">
          {/* Brand Col — logo centré au-dessus de la rangée d’icônes */}
          <div className="flex w-full flex-col items-center gap-4 lg:items-start">
            <div className="flex max-w-[min(100%,400px)] flex-col items-center gap-4">
              <BrandLogoImg
                className="h-16 w-auto sm:h-20 md:h-24 object-contain object-center"
                draggable={false}
              />
              <nav className="flex justify-center gap-4" aria-label="Réseaux sociaux">
                <a
                href="https://www.instagram.com/gold_yara_/"
                target="_blank"
                rel="noopener noreferrer"
                className={socialIconClass}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1112.324 0 6.162 6.162 0 01-12.324 0zM12 16a4 4 0 110-8 4 4 0 010 8zm4.965-10.405a1.44 1.44 0 112.881.001 1.44 1.44 0 01-2.881-.001z"/>
                </svg>
              </a>
              <a 
                href="https://www.facebook.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className={socialIconClass}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a
                href="https://wa.me/212600000000"
                target="_blank"
                rel="noopener noreferrer"
                className={socialIconClass}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
              </a>
              </nav>
            </div>
          </div>

          {/* Links Col 1 */}
          <div>
            <h5 className="text-primary font-bold uppercase tracking-widest text-sm mb-6">Collections</h5>
            <ul className="flex flex-col gap-3 text-sm text-ivory-text/90">
              <li><Link className={footerLinkClass} to="/boutique?category=solitaires">Solitaires</Link></li>
              <li><Link className={footerLinkClass} to="/boutique?category=beldi">Collection Beldi</Link></li>
              <li><Link className={footerLinkClass} to="/boutique?category=modern">Collection Moderne</Link></li>
              <li><Link className={footerLinkClass} to="/guide-tailles">Guide des Tailles</Link></li>
              <li><Link className={footerLinkClass} to="/boutique?category=haute">Haute Joaillerie</Link></li>
            </ul>
          </div>

          {/* Links Col 2 */}
          <div>
            <h5 className="text-primary font-bold uppercase tracking-widest text-sm mb-6">Informations</h5>
            <ul className="flex flex-col gap-3 text-sm text-ivory-text/90">
              <li><Link className={footerLinkClass} to="/ma-maison">La Maison</Link></li>
              <li><Link className={footerLinkClass} to="/nos-ateliers">Nos Ateliers</Link></li>
              <li><Link className={footerLinkClass} to="/livraison-retours">Livraison & Retours</Link></li>
              <li><Link className={footerLinkClass} to="/faq">FAQ</Link></li>
              <li><Link className={footerLinkClass} to="/contact">Contact</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h5 className="text-primary font-bold uppercase tracking-widest text-sm mb-6">Newsletter</h5>
            <p className="text-ivory-text/70 text-sm mb-4">Inscrivez-vous pour recevoir nos offres exclusives et nos nouveautés.</p>
            <form className="flex flex-col gap-3">
              <input 
                className="bg-white/5 border border-primary/20 px-4 py-3 rounded-sm text-sm focus:outline-none focus:border-primary text-ivory-text placeholder:text-ivory-text/30" 
                placeholder="Votre email" 
                type="email"
              />
              <button 
                className="bg-primary text-royal-bordeaux font-bold uppercase text-xs py-3 px-6 hover:bg-white transition-colors duration-300 rounded-sm" 
                type="button"
              >
                S'inscrire
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-primary/10 pt-6 sm:pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-ivory-text/50 text-center md:text-left">
          <p>© {new Date().getFullYear()} YaraGold. Tous droits réservés.</p>
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
