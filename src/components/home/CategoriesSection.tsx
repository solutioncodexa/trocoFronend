import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const categories = [
  {
    id: 'beldi',
    name: 'Bijoux Beldi',
    description: 'L\'héritage artisanal marocain sublimé dans chaque création',
    image: 'https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=800',
    link: '/boutique?category=beldi',
  },
  {
    id: 'modern',
    name: 'Bijoux Modernes',
    description: 'Des designs contemporains pour une élégance intemporelle',
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800',
    link: '/boutique?category=modern',
  },
];

const CategoriesSection = () => {
  return (
    <section className="py-20 bg-cream">
      <div className="container mx-auto px-4">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="font-display text-3xl md:text-4xl text-charcoal mb-4">
            Nos Collections
          </h2>
          <p className="font-body text-muted-foreground max-w-2xl mx-auto">
            Explorez notre sélection de bijoux en or, des pièces traditionnelles aux créations modernes
          </p>
        </div>

        {/* Categories grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {categories.map((category, index) => (
            <Link
              key={category.id}
              to={category.link}
              className="group relative overflow-hidden rounded-2xl aspect-[4/3] luxury-card"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Background image */}
              <img
                src={category.image}
                alt={category.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/50 to-transparent" />
              
              {/* Content */}
              <div className="absolute inset-0 p-8 flex flex-col justify-end">
                <h3 className="font-display text-2xl md:text-3xl text-cream mb-2">
                  {category.name}
                </h3>
                <p className="font-body text-cream/80 mb-4 max-w-sm">
                  {category.description}
                </p>
                <div className="inline-flex items-center text-gold font-body text-sm uppercase tracking-wider group-hover:gap-4 transition-all">
                  Découvrir
                  <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-2" />
                </div>
              </div>

              {/* Decorative border */}
              <div className="absolute inset-4 border border-gold/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;
