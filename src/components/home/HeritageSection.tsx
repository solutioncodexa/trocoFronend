import { Quote, Users, Facebook, Instagram } from 'lucide-react';
import { Link } from 'react-router-dom';

const HeritageSection = () => {
  return (
    <section className="py-20 bg-paper dark:bg-[#2a2515] overflow-hidden">
      <div className="max-w-[1280px] mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          {/* Image Grid */}
          <div className="w-full lg:w-1/2">
            <div className="relative p-6 border border-accent-beige/30 rounded-t-full">
              <div className="aspect-[3/4] rounded-t-full overflow-hidden relative z-10">
                <div className="w-full h-full bg-cover bg-center" 
                     style={{backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuC7-aLgGSZQV64bxRSynXXolsArrjJbCAD7cNZa_PYgdnEkyPf_GF7OZy8zi2QM5ZuAkBKk6_etuUn2-11cWQPoAYtrfAtQQH6h6h_U2Cu-5t-taRP4_t6oJDxMSzzwtsXmKF7MahexLyXUxfP1b30GPzfueBMTvGNspRQ3LZBBey41OlvJ5W1BbEkCpgVbmxPWvq9h0au-AzB5UyjDaYFbFSu2FTi9NmkWOYQiunBce_wp4hi9McoVaqooVCIAphYmIxlegE-SQXB6')"}}>
                </div>
              </div>
              {/* Decorative elements behind */}
              <div className="absolute -bottom-4 -right-4 w-32 h-32 border-r-2 border-b-2 border-primary/40 rounded-br-3xl -z-0"></div>
              <div className="absolute -top-4 -left-4 w-32 h-32 border-l-2 border-t-2 border-primary/40 rounded-tl-3xl -z-0"></div>
            </div>
          </div>

          {/* Content */}
          <div className="w-full lg:w-1/2 text-center lg:text-left">
            <h4 className="text-accent-beige uppercase tracking-[0.3em] text-sm mb-4">Savoir-faire</h4>
            <h2 className="text-4xl lg:text-5xl font-display text-secondary-dark dark:text-white mb-6">
              Notre Histoire & <br/>
              <span className="font-script text-primary text-5xl lg:text-6xl">Passion</span>
            </h2>
            <p className="text-secondary-dark/70 dark:text-white/70 leading-relaxed mb-6 font-light text-lg">
             Inspirée par l’héritage beldi, Naz célèbre l’art de la joaillerie marocaine dans toute sa noblesse. Chaque bijou est travaillé avec soin, dans le respect du geste artisanal et de la tradition.
            </p>
            <p className="text-secondary-dark/70 dark:text-white/70 leading-relaxed mb-8 font-light text-lg">
            Plus qu’un bijou, chaque pièce est un symbole d’identité, de fierté et de transmission.

            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start items-center">
              <Link to="/boutique" className="bg-secondary-dark text-white px-8 py-3 text-sm uppercase tracking-widest hover:bg-primary transition-colors inline-block">
                Voir Tous Les Produits
              </Link>
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2 overflow-hidden">
                  <a 
                    href="https://www.facebook.com/votrefacebook" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center h-10 w-10 rounded-full ring-2 ring-white bg-blue-600 hover:bg-blue-700 transition-colors"
                  >
                    <Facebook className="w-5 h-5 text-white" />
                  </a>
                  <a 
                    href="https://www.instagram.com/votreinstagram" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center h-10 w-10 rounded-full ring-2 ring-white bg-gradient-to-br from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-colors"
                  >
                    <Instagram className="w-5 h-5 text-white" />
                  </a>
                </div>
                <span className="text-sm italic text-accent-beige flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  Découvrir Notre Platforms
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeritageSection;
