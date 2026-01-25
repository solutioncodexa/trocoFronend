import { Link } from 'react-router-dom';
import { Palette, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const CustomOrderCTA = () => {
  return (
    <section className="py-20 bg-charcoal relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gold rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-gold rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          {/* Icon */}
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gold/20 mb-8">
            <Palette className="w-8 h-8 text-gold" />
          </div>

          {/* Content */}
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl text-cream mb-6">
            Créez Votre Bijou{' '}
            <span className="text-gold italic">Sur Mesure</span>
          </h2>
          
          <p className="font-body text-lg text-cream/80 mb-8 max-w-2xl mx-auto">
            Vous avez une idée précise ? Envoyez-nous votre modèle ou décrivez votre vision, 
            et nos artisans donneront vie à votre bijou de rêve.
          </p>

          {/* Features */}
          <div className="grid sm:grid-cols-3 gap-6 mb-10">
            {[
              { title: 'Conception', desc: 'Envoyez votre modèle' },
              { title: 'Artisanat', desc: 'Fabrication à la main' },
              { title: 'Livraison', desc: 'Directement chez vous' },
            ].map((feature, index) => (
              <div
                key={index}
                className="text-center p-4 rounded-lg bg-cream/5 backdrop-blur-sm"
              >
                <div className="font-display text-xl text-gold mb-1">{feature.title}</div>
                <div className="font-body text-sm text-cream/60">{feature.desc}</div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <Button
            asChild
            size="lg"
            className="bg-gold hover:bg-gold-dark text-charcoal font-body uppercase tracking-wider text-sm px-10 py-6 hover-gold"
          >
            <Link to="/commande-personnalisee">
              Démarrer votre création
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CustomOrderCTA;
