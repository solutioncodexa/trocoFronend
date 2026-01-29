import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';

const GuideTailles = () => {
  return (
    <Layout>
      <main className="flex flex-1 justify-center py-12 px-4">
        <div className="flex flex-col max-w-[1000px] flex-1">
          {/* PageHeading */}
          <div className="flex flex-wrap justify-between items-end gap-6 p-4 mb-8">
            <div className="flex min-w-72 flex-col gap-3">
              <h1 className="text-secondary-dark text-5xl font-black leading-tight tracking-[-0.033em] italic">Guide des Tailles</h1>
              <p className="text-primary text-lg font-normal leading-normal italic">L'art de la mesure par YaraGold Heritage</p>
            </div>
            <a 
              href="/guide-tailles-yaragold.pdf" 
              download="guide-tailles-yaragold.pdf"
              className="flex min-w-[280px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-6 bg-primary text-white text-sm font-bold leading-normal tracking-[0.05em] uppercase transition-transform hover:scale-105"
            >
              <span className="material-symbols-outlined mr-2">picture_as_pdf</span>
              <span className="truncate">Télécharger le Guide Imprimable (PDF)</span>
            </a>
          </div>
          
          <div className="flex justify-center py-12">
            <div className="w-48 h-px bg-accent-beige/20 relative">
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 size-3 rotate-45 border border-primary bg-white"></div>
            </div>
          </div>

          {/* Section: Bagues */}
          <section className="mb-16">
            <div className="flex items-center gap-3 px-4">
              <span className="material-symbols-outlined text-primary">trip_origin</span>
              <h2 className="text-secondary-dark text-[28px] font-bold leading-tight tracking-[-0.015em] py-5">Bagues & Alliances</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-4">
              <div className="bg-white/50 p-6 rounded-xl border border-accent-beige/20">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">straighten</span>
                  Méthode du Ruban
                </h3>
                <p className="text-accent-beige text-base font-normal leading-relaxed mb-4">
                  Enroulez un ruban ou une bande de papier autour de la base de votre doigt. Marquez le point de rencontre et mesurez la distance avec une règle millimétrée. Cette mesure correspond à votre taille française.
                </p>
                <a className="text-sm font-bold leading-normal tracking-[0.015em] flex items-center gap-2 text-primary hover:underline" href="#">
                  Voir le tutoriel vidéo
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </a>
              </div>
              <div className="bg-white/50 p-6 rounded-xl border border-accent-beige/20">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">info</span>
                  Conseils d'expert
                </h3>
                <ul className="text-accent-beige text-sm space-y-2 italic">
                  <li>• Mesurez votre doigt en fin de journée quand il est le plus large.</li>
                  <li>• Si vous hésitez entre deux tailles, choisissez la plus grande.</li>
                  <li>• N'oubliez pas de prendre en compte la taille de l'articulation.</li>
                </ul>
              </div>
            </div>
            
            {/* ImageGrid: Ring Size Chart Circles */}
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4 p-4">
              <div className="bg-white border border-primary/20 flex flex-col items-center justify-center p-6 rounded-lg aspect-square hover:border-primary transition-colors">
                <div className="w-10 h-10 rounded-full border-2 border-primary mb-3"></div>
                <p className="text-secondary-dark text-sm font-bold">41 (13mm)</p>
              </div>
              <div className="bg-white border border-primary/20 flex flex-col items-center justify-center p-6 rounded-lg aspect-square hover:border-primary transition-colors">
                <div className="w-12 h-12 rounded-full border-2 border-primary mb-3"></div>
                <p className="text-secondary-dark text-sm font-bold">47 (15mm)</p>
              </div>
              <div className="bg-white border border-primary/20 flex flex-col items-center justify-center p-6 rounded-lg aspect-square hover:border-primary transition-colors">
                <div className="w-14 h-14 rounded-full border-2 border-primary mb-3"></div>
                <p className="text-secondary-dark text-sm font-bold">52 (16.5mm)</p>
              </div>
              <div className="bg-white border border-primary/20 flex flex-col items-center justify-center p-6 rounded-lg aspect-square hover:border-primary transition-colors">
                <div className="w-16 h-16 rounded-full border-2 border-primary mb-3"></div>
                <p className="text-secondary-dark text-sm font-bold">57 (18mm)</p>
              </div>
              <div className="bg-white border border-primary/20 flex flex-col items-center justify-center p-6 rounded-lg aspect-square hover:border-primary transition-colors">
                <div className="w-20 h-20 rounded-full border-2 border-primary mb-3"></div>
                <p className="text-secondary-dark text-sm font-bold">64 (20.4mm)</p>
              </div>
              <div className="bg-white border border-primary/20 flex flex-col items-center justify-center p-6 rounded-lg aspect-square hover:border-primary transition-colors">
                <div className="w-24 h-24 rounded-full border-2 border-primary mb-3"></div>
                <p className="text-secondary-dark text-sm font-bold">72 (23mm)</p>
              </div>
            </div>
          </section>

          <div className="flex justify-center py-12">
            <div className="w-48 h-px bg-accent-beige/20 relative">
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 size-3 rotate-45 border border-primary bg-white"></div>
            </div>
          </div>

          {/* Section: Colliers */}
          <section className="mb-16">
            <div className="flex items-center gap-3 px-4">
              <span className="material-symbols-outlined text-primary">conversion_path</span>
              <h2 className="text-secondary-dark text-[28px] font-bold leading-tight tracking-[-0.015em] py-5">Colliers & Sautoirs</h2>
            </div>
            <div className="flex flex-col md:flex-row gap-8 p-4 items-center">
              <div className="flex-1">
                <div className="bg-cover bg-center rounded-xl overflow-hidden border border-primary/30 h-[400px] w-full" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBPRGFY3A74mp0JFJLuwu5IuS6KT-GNJa1nNWABU_P97hBBN2knMO0h4986NzCQsyhJ_3s68n6DckjxO2S1gFK-N-3ZuFRm6i35WXsmWhbFdRwOziCt2zqISxDaaiE1WwiCSD8wuJ-B01G1CWBbho9mKN31LFApC8s11D5F6KNV7QisI7BRre0urfc2IJba_TBYFNBX7a8P8JUj7x3Xz42sOBNSC12bGui8wxymLCoxl0uVnZbgdrHv87_RBUVoaKTdnzu4U88guZXR")'}}>
                  <div className="h-full w-full flex flex-col justify-end p-8 bg-black/20">
                    <p className="text-white text-xl italic">Visualisez la portée de nos créations</p>
                  </div>
                </div>
              </div>
              <div className="flex-1 space-y-6">
                <div className="border-l-4 border-primary pl-4">
                  <h4 className="font-bold text-lg">Choker (35 - 40 cm)</h4>
                  <p className="text-sm text-accent-beige">Se porte ajusté à la base du cou.</p>
                </div>
                <div className="border-l-4 border-primary/60 pl-4">
                  <h4 className="font-bold text-lg">Princesse (42 - 48 cm)</h4>
                  <p className="text-sm text-accent-beige">La longueur classique, tombe sur le haut du buste.</p>
                </div>
                <div className="border-l-4 border-primary/40 pl-4">
                  <h4 className="font-bold text-lg">Sautoir (50 - 60 cm)</h4>
                  <p className="text-sm text-accent-beige">Idéal pour les pendentifs imposants et les tenues de soirée.</p>
                </div>
                <div className="mt-8">
                  <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg italic text-sm">
                    "Chaque pièce YaraGold peut être ajustée sur mesure dans nos ateliers."
                  </div>
                </div>
              </div>
            </div>
          </section>

          <div className="flex justify-center py-12">
            <div className="w-48 h-px bg-accent-beige/20 relative">
              <div className="absolute left-1/2 top-1/2 -translate-y-1/2 size-3 rotate-45 border border-primary bg-white"></div>
            </div>
          </div>

          {/* Section: Bracelets */}
          <section className="mb-16">
            <div className="flex items-center gap-3 px-4">
              <span className="material-symbols-outlined text-primary">circle</span>
              <h2 className="text-secondary-dark text-[28px] font-bold leading-tight tracking-[-0.015em] py-5">Bracelets & Joncs</h2>
            </div>
            <div className="p-4">
              <div className="flex flex-1 flex-col items-start justify-between gap-6 rounded-xl border border-accent-beige/20 bg-white p-8 md:flex-row md:items-center">
                <div className="flex flex-col gap-3 max-w-xl">
                  <p className="text-secondary-dark text-xl font-bold leading-tight">Mesure du Poignet</p>
                  <p className="text-accent-beige text-base font-normal leading-normal">
                    Utilisez un mètre ruban souple juste au-dessus de l'os du poignet. Ajoutez 1,5 cm à 2 cm selon le confort souhaité (ajusté ou libre). Nos joncs héritage sont disponibles en trois diamètres standards.
                  </p>
                  <div className="grid grid-cols-3 gap-4 mt-4">
                    <div className="text-center p-3 border border-primary/20 rounded">
                      <span className="block text-primary font-bold">Small</span>
                      <span className="text-xs uppercase">15 - 16 cm</span>
                    </div>
                    <div className="text-center p-3 border border-primary/20 rounded">
                      <span className="block text-primary font-bold">Medium</span>
                      <span className="text-xs uppercase">17 - 18 cm</span>
                    </div>
                    <div className="text-center p-3 border border-primary/20 rounded">
                      <span className="block text-primary font-bold">Large</span>
                      <span className="text-xs uppercase">19 - 20 cm</span>
                    </div>
                  </div>
                </div>
                <div className="bg-cover bg-center size-48 rounded-lg border border-primary/20 shadow-xl" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAvEJk_wwIleG-2GgG8VwnfLXLIptxMaFCSYvsgvdUHm4fu-1b4dobFb8pQQ4PYtrM_-IFN8qSvOwElNfyh5I5ww_ni6RsK5TRjUUIVzhskk3upWSbyT0Gps7z-2eGWVaciaAdxkMwHXcZZCK95xiXtJIAqevItFIlm1IwkyQzInkFywMvFZRFNmLd5CyBq-vswCfnOR4Q7bPbHxZkfjKkQ_zGZk81Xr0mUHmQSIFzmmr3wBv7GNNagmUpdm-F7md2Enf65jzv_1ngO")'}}></div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </Layout>
  );
};

export default GuideTailles;
