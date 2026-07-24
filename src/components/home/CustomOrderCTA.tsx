import { Link } from 'react-router-dom';
import { Palette, FileText, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const CustomOrderCTA = () => {
  return (
    <section className="py-20 bg-gradient-hero relative overflow-hidden">
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-sky/80 blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full bg-primary-foreground/25 blur-2xl translate-y-1/2 -translate-x-1/2" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center animate-fade-in">
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl text-primary-foreground mb-6">
            Sur mesure <span className="text-primary-foreground/50">&amp;</span>{' '}
            <span className="text-primary-foreground italic">devis</span>
          </h2>

          <p className="font-body text-lg text-primary-foreground/80 mb-10 max-w-2xl mx-auto">
            Personnalisez votre emballage avec logo, ou demandez un chiffrage pour vos volumes pro.
          </p>

          <div className="grid sm:grid-cols-2 gap-4 max-w-xl mx-auto">
            <Button
              asChild
              size="lg"
              className="bg-card text-primary hover:bg-card/90 font-body uppercase tracking-wider text-sm px-8 py-6 rounded-2xl shadow-card"
            >
              <Link to="/sur-mesure">
                <Palette className="mr-2 w-5 h-5" />
                Sur mesure
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground font-body uppercase tracking-wider text-sm px-8 py-6 rounded-2xl"
            >
              <Link to="/devis">
                <FileText className="mr-2 w-5 h-5" />
                Demander un devis
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CustomOrderCTA;
