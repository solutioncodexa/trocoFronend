import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import heroImage from '@/assets/hero-jewelry.jpg';

const HeroSection = () => {
  return (
    <section className="relative px-4 py-8 md:px-12 lg:px-24">
      <div className="container mx-auto max-w-[1400px]">
        {/* Classic Frame Effect */}
        <div className="border-2 border-accent-beige/30 p-2 md:p-3 rounded-sm">
          <div className="border border-accent-beige/20 p-1 md:p-2 rounded-sm">
            <div className="relative min-h-[600px] w-full bg-cover bg-center rounded-sm overflow-hidden flex items-center justify-center" 
                 style={{
                   backgroundImage: "linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.4)), url('https://lh3.googleusercontent.com/aida-public/AB6AXuAPwS7jO8A1t0pR7RdBRWLxuk5M-uQ2Pr5sW8bsJJcNxvG1WjyJVuf3Pw62lMnrvRlnI0OSSnOOmqkHjofPmZwy84ILuzFh3Bf9LPjbHlxKpPFJ44lZUsEi3Z5RqcFfOdBR0weUDXezHrCdJj5e0v_2LgVafALx3D7vMyIqOlMTAsp2URper5YYhweiF-d3AaD4a4RiPWcQEE1wIiivezdK0m1vlJ4uekuDFJ4ueIfuJdbF8j_roqacvNCt57ff2oW2UHxk6dcx6Hla')"
                 }}>
              <div className="relative z-10 text-center px-6 max-w-2xl mx-auto">
                <span className="inline-block py-1 px-4 border border-white/40 text-white text-xs tracking-[0.2em] uppercase mb-6 bg-black/20 backdrop-blur-sm">
                  Nouvelle Collection
                </span>
                <h2 className="text-5xl md:text-7xl text-white font-display mb-6 drop-shadow-md">
                  L'élégance <br/>
                  <span className="font-script text-primary text-6xl md:text-8xl">intemporelle</span>
                </h2>
                <p className="text-white/90 text-lg md:text-xl font-light mb-10 max-w-lg mx-auto leading-relaxed">
                  Découvrez nos bijoux en or d'une finesse incomparable, inspirés par la tradition et le luxe d'antan.
                </p>
                <Button
                  asChild
                  className="bg-primary hover:bg-[#d9a50b] text-white px-8 py-4 text-sm uppercase tracking-widest font-bold transition-all transform hover:scale-105 shadow-lg border border-white/20"
                >
                  <Link to="/boutique">
                    Découvrir la collection
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
