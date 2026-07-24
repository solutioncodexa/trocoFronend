import { Quote } from 'lucide-react';
import { RevealOnScroll } from '@/components/animations';

const TestimonialSection = () => {
  return (
    <section className="px-4 py-16 sm:py-20">
      <div className="container mx-auto max-w-3xl">
        <RevealOnScroll>
          <blockquote className="relative rounded-3xl border border-border bg-card p-8 text-center shadow-card sm:p-12 md:p-14">
            <Quote className="absolute left-6 top-6 h-8 w-8 text-primary/25 sm:left-8 sm:top-8" aria-hidden />
            <p className="font-display text-lg font-medium leading-relaxed text-foreground sm:text-xl md:text-2xl">
              &quot;Des emballages soignés qui valorisent vraiment nos commandes. Qualité constante, délais tenus — exactement ce qu&apos;il faut pour un e-commerce exigeant.&quot;
            </p>
            <footer className="mt-6 text-sm font-medium text-muted-foreground">
              — Client e-commerce, Casablanca
            </footer>
          </blockquote>
        </RevealOnScroll>
      </div>
    </section>
  );
};

export default TestimonialSection;
