import { Link } from 'react-router-dom';
import { Gift, Truck, Shield, Clock } from 'lucide-react';

const features = [
  {
    icon: Truck,
    title: 'Livraison Gratuite',
    description: 'À partir de 5000 MAD',
  },
  {
    icon: Shield,
    title: 'Or Garanti',
    description: '18 carats certifié',
  },
  {
    icon: Gift,
    title: 'Emballage Luxe',
    description: 'Écrin offert',
  },
  {
    icon: Clock,
    title: 'Paiement à la Livraison',
    description: 'Cash on delivery',
  },
];

const PromotionBanner = () => {
  return (
    <section className="py-16 bg-cream-dark border-y border-border">
      <div className="container mx-auto px-4">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex items-center gap-4 justify-center sm:justify-start"
            >
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-display text-lg text-foreground">
                  {feature.title}
                </h3>
                <p className="font-body text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PromotionBanner;
