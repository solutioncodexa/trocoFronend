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
          
          <h3 className="text-2xl md:text-3xl font-display text-secondary-dark dark:text-white mb-6 italic leading-relaxed">
            &quot;Un bijou d&apos;une beauté rare, reçu dans un écrin magnifique. Le service client est d&apos;une grande attention, digne des plus grandes maisons parisiennes.&quot;
          </h3>
          
          <div className="flex flex-col items-center">
            <div className="text-primary text-xl mb-2">★★★★★</div>
            <p className="text-sm font-bold uppercase tracking-widest text-accent-beige">Sophie Dubois</p>
            <p className="text-xs text-gray-400">Cliente Vérifiée</p>
          </div>
        </div>
        </RevealOnScroll>
      </div>
    </section>
  );
};

export default TestimonialSection;
