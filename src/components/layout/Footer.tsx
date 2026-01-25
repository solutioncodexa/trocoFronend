import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Instagram, Facebook } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-charcoal text-cream">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="font-display text-2xl text-gold">Or Élégance</h3>
            <p className="font-body text-sm text-cream/80 leading-relaxed">
              Bijouterie de luxe proposant des créations uniques en or, alliant tradition marocaine et design contemporain.
            </p>
            <div className="flex space-x-4 pt-4">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-cream/10 flex items-center justify-center hover:bg-gold hover:text-charcoal transition-all"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-cream/10 flex items-center justify-center hover:bg-gold hover:text-charcoal transition-all"
              >
                <Facebook className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-display text-lg text-gold">Liens Rapides</h4>
            <nav className="flex flex-col space-y-3">
              <Link to="/boutique" className="font-body text-sm text-cream/80 hover:text-gold transition-colors">
                Notre Collection
              </Link>
              <Link to="/boutique?category=beldi" className="font-body text-sm text-cream/80 hover:text-gold transition-colors">
                Bijoux Beldi
              </Link>
              <Link to="/boutique?category=modern" className="font-body text-sm text-cream/80 hover:text-gold transition-colors">
                Bijoux Modernes
              </Link>
              <Link to="/commande-personnalisee" className="font-body text-sm text-cream/80 hover:text-gold transition-colors">
                Commande Sur Mesure
              </Link>
            </nav>
          </div>

          {/* Customer Service */}
          <div className="space-y-4">
            <h4 className="font-display text-lg text-gold">Service Client</h4>
            <nav className="flex flex-col space-y-3">
              <Link to="/livraison" className="font-body text-sm text-cream/80 hover:text-gold transition-colors">
                Livraison
              </Link>
              <Link to="/retours" className="font-body text-sm text-cream/80 hover:text-gold transition-colors">
                Retours & Échanges
              </Link>
              <Link to="/garantie" className="font-body text-sm text-cream/80 hover:text-gold transition-colors">
                Garantie
              </Link>
              <Link to="/faq" className="font-body text-sm text-cream/80 hover:text-gold transition-colors">
                FAQ
              </Link>
            </nav>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="font-display text-lg text-gold">Contact</h4>
            <div className="space-y-3">
              <a
                href="tel:+212600000000"
                className="flex items-center space-x-3 font-body text-sm text-cream/80 hover:text-gold transition-colors"
              >
                <Phone className="w-4 h-4" />
                <span>+212 6 00 00 00 00</span>
              </a>
              <a
                href="mailto:contact@orelegance.ma"
                className="flex items-center space-x-3 font-body text-sm text-cream/80 hover:text-gold transition-colors"
              >
                <Mail className="w-4 h-4" />
                <span>contact@orelegance.ma</span>
              </a>
              <div className="flex items-start space-x-3 font-body text-sm text-cream/80">
                <MapPin className="w-4 h-4 mt-1 flex-shrink-0" />
                <span>123 Avenue Mohammed V<br />Casablanca, Maroc</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-cream/20">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="font-body text-xs text-cream/60">
              © 2024 Or Élégance. Tous droits réservés.
            </p>
            <div className="flex items-center space-x-4 text-xs text-cream/60">
              <span className="font-body">Paiement à la livraison uniquement</span>
              <span className="text-gold">•</span>
              <span className="font-body">Livraison dans tout le Maroc</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
