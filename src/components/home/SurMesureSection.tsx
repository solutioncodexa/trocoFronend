import { Link } from 'react-router-dom';

const SurMesureSection = () => {
  return (
    <section className="py-20 bg-background-light dark:bg-background-dark overflow-hidden border-y border-accent-beige/10">
      <div className="max-w-[1280px] mx-auto px-6">
        <div className="flex flex-col lg:flex-row-reverse items-center gap-16">
          {/* Image */}
          <div className="w-full lg:w-1/2">
            <div className="relative p-6 border border-accent-beige/30 rounded-b-full">
              <div className="aspect-[3/4] rounded-b-full overflow-hidden relative z-10 shadow-2xl">
                <div 
                  className="w-full h-full bg-cover bg-center" 
                  style={{
                    backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuANeZjM2Nd2BTUarfEC5v5c5mj_2tDf5f6rndMsfkwa5YJzXfeoX5dYQF8p_SMpojI-9WdlL1rSXnwJvEAi0OLReU3KRTX7wrA6u3toFw0klmtyihXHwC6ZvfahHG_lIRlGuDyPhEUzqMBf39uKhLksAcBv9QC0Q4HbL4sI2lfvb5EvliEZ1Bo1nkFl86eq3WFVcDxgiEGZ8MAADjx1k-VDZleQfjMkT7UPffFrAUoB8U5bJ7dZ3hZmmkHZkBEDqxN5Zmhk1QDNzSem')"
                  }}
                />
              </div>
              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-32 h-32 border-r-2 border-t-2 border-primary/40 rounded-tr-3xl -z-0"></div>
              <div className="absolute -bottom-4 -left-4 w-32 h-32 border-l-2 border-b-2 border-primary/40 rounded-bl-3xl -z-0"></div>
            </div>
          </div>

          {/* Content */}
          <div className="w-full lg:w-1/2 text-center lg:text-left">
            <div className="flex flex-col items-center lg:items-start">
              <div className="w-16 h-px bg-primary/60 mb-6"></div>
              <h4 className="text-accent-beige uppercase tracking-[0.3em] text-sm mb-4">Création Unique</h4>
              <h2 className="text-4xl lg:text-5xl font-display text-secondary-dark dark:text-white mb-6">
                L'Art du <br/>
                <span className="font-script text-primary text-5xl lg:text-6xl">Sur-Mesure</span>
              </h2>
              <p className="text-secondary-dark/70 dark:text-white/70 leading-relaxed mb-6 font-light text-lg italic">
                "L'imagination est le seul guide de votre élégance."
              </p>
              <p className="text-secondary-dark/70 dark:text-white/70 leading-relaxed mb-8 font-light text-lg">
                Donnez vie à vos rêves les plus précieux. Nos artisans collaborent avec vous pour dessiner et façonner une pièce qui ne ressemble qu'à vous. Du choix de la pierre à la finition de l'or, chaque détail est une expression de votre histoire.
              </p>
              <Link 
                to="/sur-mesure"
                className="group relative bg-primary hover:bg-secondary-dark text-white px-10 py-4 text-sm uppercase tracking-[0.2em] font-bold transition-all duration-300 shadow-xl overflow-hidden inline-block"
              >
                <span className="relative z-10">Démarrer un Projet</span>
                <div className="absolute inset-0 bg-white/10 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SurMesureSection;
