import { Quote } from 'lucide-react';
import { RevealOnScroll } from '@/components/animations';

const TestimonialSection = () => {
  return (
    <section className="py-16 px-4">
      <div className="container mx-auto max-w-4xl">
        <RevealOnScroll>
        <div className="bg-paper dark:bg-[#2a2515] p-10 md:p-16 border border-accent-beige/20 text-center relative shadow-lg rounded-sm">
          <Quote className="text-6xl text-primary/30 absolute top-8 left-8" />
          <Quote className="text-6xl text-primary/30 absolute bottom-8 right-8 rotate-180" />
          
          <h3 className="text-2xl md:text-3xl font-display text-secondary-dark dark:text-white italic leading-relaxed">
            &quot;L&apos;or, chez nous, ce n&apos;est pas une tendance : c&apos;est ce qu&apos;on garde pour les fiançailles, les alliances, les gourmettes qu&apos;on fait graver au nom des enfants. Ici on retrouve ce qu&apos;on attend d&apos;un maâlem : le poids qui se sent au poignet, le beldi bien assumé, et un or propre — sans le côté &apos;vitrine&apos; qui sonne faux. Un travail de pays, avec une exigence d&apos;aujourd&apos;hui.&quot;
          </h3>
        </div>
        </RevealOnScroll>
      </div>
    </section>
  );
};

export default TestimonialSection;
