import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-[#8a8060] text-white pt-20 pb-10 border-t-4 border-primary" style={{ backgroundColor: '#8a8060' }}>
      <div className="max-w-[1280px] mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Col */}
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-2 text-primary">
              <div className="size-6">
                <svg fill="currentColor" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                  <path d="M42.1739 20.1739L27.8261 5.82609C29.1366 7.13663 28.3989 10.1876 26.2002 13.7654C24.8538 15.9564 22.9595 18.3449 20.6522 20.6522C18.3449 22.9595 15.9564 24.8538 13.7654 26.2002C10.1876 28.3989 7.13663 29.1366 5.82609 27.8261L20.1739 42.1739C21.4845 43.4845 24.5355 42.7467 28.1133 40.548C30.3042 39.2016 32.6927 37.3073 35 35C37.3073 32.6927 39.2016 30.3042 40.548 28.1133C42.7467 24.5355 43.4845 21.4845 42.1739 20.1739Z"></path>
                </svg>
              </div>
              <span className="text-xl font-bold font-display tracking-tight">NazGold</span>
            </div>
            <p className="text-white/80 text-sm leading-relaxed">
              L'excellence de la joaillerie, la passion de l'or et l'amour du travail bien fait. Une maison de tradition depuis 1952.
            </p>
            <div className="flex gap-4">
              <a className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary hover:text-secondary-dark transition-colors" href="#" target="_blank" rel="noopener noreferrer">
                <span className="material-symbols-outlined text-sm">language</span>
              </a>
              <a className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary hover:text-secondary-dark transition-colors" href="#" target="_blank" rel="noopener noreferrer">
                <span className="material-symbols-outlined text-sm">photo_camera</span>
              </a>
              <a className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary hover:text-secondary-dark transition-colors" href="#" target="_blank" rel="noopener noreferrer">
                <span className="material-symbols-outlined text-sm">mail</span>
              </a>
            </div>
          </div>

          {/* Links Col 1 */}
          <div>
            <h5 className="text-primary font-bold uppercase tracking-widest text-sm mb-6">Collections</h5>
            <ul className="flex flex-col gap-3 text-sm text-[#d4d4d0]">
              <li><Link className="hover:text-primary transition-colors" to="/boutique?category=alliances">Alliances</Link></li>
              <li><Link className="hover:text-primary transition-colors" to="/boutique?category=solitaires">Solitaires</Link></li>
              <li><Link className="hover:text-primary transition-colors" to="/boutique?category=beldi">Collection Beldi</Link></li>
              <li><Link className="hover:text-primary transition-colors" to="/boutique?category=modern">Collection Moderne</Link></li>
              <li><Link className="hover:text-primary transition-colors" to="/boutique?category=haute">Haute Joaillerie</Link></li>
            </ul>
          </div>

          {/* Links Col 2 */}
          <div>
            <h5 className="text-primary font-bold uppercase tracking-widest text-sm mb-6">Informations</h5>
            <ul className="flex flex-col gap-3 text-sm text-[#d4d4d0]">
              <li><Link className="hover:text-primary transition-colors" to="#">La Maison</Link></li>
              <li><Link className="hover:text-primary transition-colors" to="#">Nos Ateliers</Link></li>
              <li><Link className="hover:text-primary transition-colors" to="#">Livraison & Retours</Link></li>
              <li><Link className="hover:text-primary transition-colors" to="#">FAQ</Link></li>
              <li><Link className="hover:text-primary transition-colors text-primary" to="/contact">Contact</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h5 className="text-primary font-bold uppercase tracking-widest text-sm mb-6">Newsletter</h5>
            <p className="text-white/70 text-sm mb-4">Inscrivez-vous pour recevoir nos offres exclusives et nos nouveautés.</p>
            <form className="flex flex-col gap-3">
              <input 
                className="bg-white/5 border border-white/10 px-4 py-3 rounded-sm text-sm focus:outline-none focus:border-primary text-white placeholder:text-white/30" 
                placeholder="Votre email" 
                type="email"
              />
              <button 
                className="bg-primary text-secondary-dark font-bold uppercase text-xs py-3 px-6 hover:bg-[#d9a50b] transition-colors rounded-sm" 
                type="button"
              >
                S'inscrire
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-white/60">
          <p>© {new Date().getFullYear()} NazGold. Tous droits réservés.</p>
          <div className="flex gap-6">
            <Link className="hover:text-white transition-colors" to="#">Mentions Légales</Link>
            <Link className="hover:text-white transition-colors" to="#">Confidentialité</Link>
            <Link className="hover:text-white transition-colors" to="#">CGV</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
