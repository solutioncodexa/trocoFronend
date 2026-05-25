import { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { generateSizeGuidePdf } from '@/utils/generateSizeGuidePdf';

const RING_SIZES = [
  { fr: 41, circumference: 41, diameter: 13.0 },
  { fr: 42, circumference: 42, diameter: 13.4 },
  { fr: 43, circumference: 43, diameter: 13.7 },
  { fr: 44, circumference: 44, diameter: 14.0 },
  { fr: 45, circumference: 45, diameter: 14.3 },
  { fr: 46, circumference: 46, diameter: 14.6 },
  { fr: 47, circumference: 47, diameter: 15.0 },
  { fr: 48, circumference: 48, diameter: 15.3 },
  { fr: 49, circumference: 49, diameter: 15.6 },
  { fr: 50, circumference: 50, diameter: 15.9 },
  { fr: 51, circumference: 51, diameter: 16.2 },
  { fr: 52, circumference: 52, diameter: 16.5 },
  { fr: 53, circumference: 53, diameter: 16.9 },
  { fr: 54, circumference: 54, diameter: 17.2 },
  { fr: 55, circumference: 55, diameter: 17.5 },
  { fr: 56, circumference: 56, diameter: 17.8 },
  { fr: 57, circumference: 57, diameter: 18.1 },
  { fr: 58, circumference: 58, diameter: 18.5 },
  { fr: 59, circumference: 59, diameter: 18.8 },
  { fr: 60, circumference: 60, diameter: 19.1 },
  { fr: 61, circumference: 61, diameter: 19.4 },
  { fr: 62, circumference: 62, diameter: 19.7 },
  { fr: 63, circumference: 63, diameter: 20.1 },
  { fr: 64, circumference: 64, diameter: 20.4 },
  { fr: 65, circumference: 65, diameter: 20.7 },
  { fr: 66, circumference: 66, diameter: 21.0 },
  { fr: 67, circumference: 67, diameter: 21.3 },
  { fr: 68, circumference: 68, diameter: 21.6 },
  { fr: 69, circumference: 69, diameter: 22.0 },
  { fr: 70, circumference: 70, diameter: 22.3 },
  { fr: 71, circumference: 71, diameter: 22.6 },
  { fr: 72, circumference: 72, diameter: 22.9 },
];

const RING_SIZE_CARDS: { label: string; circleClass: string }[] = [
  { label: '41 (13mm)', circleClass: 'w-10 h-10' },
  { label: '47 (15mm)', circleClass: 'w-12 h-12' },
  { label: '52 (16.5mm)', circleClass: 'w-14 h-14' },
  { label: '57 (18mm)', circleClass: 'w-16 h-16' },
  { label: '64 (20.4mm)', circleClass: 'w-20 h-20' },
  { label: '72 (23mm)', circleClass: 'w-24 h-24' },
];

const ringCardClass =
  'bg-white border border-primary/20 flex min-h-0 min-w-0 h-52 flex-col rounded-lg p-4 hover:border-primary transition-colors';

const GuideTailles = () => {
  const [circumference, setCircumference] = useState<string>('');

  const circumferenceNum = parseFloat(circumference);
  const matchedSize = !isNaN(circumferenceNum) && circumferenceNum >= 40 && circumferenceNum <= 73
    ? RING_SIZES.reduce((closest, size) =>
        Math.abs(size.circumference - circumferenceNum) < Math.abs(closest.circumference - circumferenceNum)
          ? size
          : closest
      )
    : null;

  return (
    <Layout>
      <main className="flex flex-1 justify-center py-12 px-4 min-w-0 max-w-full overflow-x-hidden w-full">
        <div className="flex flex-col max-w-[1000px] flex-1 min-w-0 w-full">
          {/* PageHeading */}
          <div className="flex flex-col sm:flex-row flex-wrap justify-between items-stretch sm:items-end gap-6 p-4 mb-8">
            <div className="flex min-w-0 w-full sm:min-w-72 flex-col gap-3">
              <h1 className="text-secondary-dark text-3xl sm:text-5xl font-black leading-tight tracking-[-0.033em] italic break-words">Guide des Tailles</h1>
              <p className="text-primary text-lg font-normal leading-normal italic">L'art de la mesure par YaraGold Heritage</p>
            </div>
            <button
              onClick={() => generateSizeGuidePdf()}
              className="flex w-full sm:w-auto min-w-0 sm:min-w-[280px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-4 sm:px-6 bg-primary text-white text-sm font-bold leading-normal tracking-[0.05em] uppercase transition-transform hover:scale-105"
            >
              <span className="material-symbols-outlined mr-2">picture_as_pdf</span>
              <span className="truncate">Télécharger le Guide Imprimable (PDF)</span>
            </button>
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

            {/* Interactive Ring Size Calculator */}
            <div className="p-4 mt-4">
              <div className="bg-gradient-to-br from-primary/5 to-primary/10 border-2 border-primary/20 rounded-xl p-6 sm:p-8">
                <h3 className="text-lg font-bold mb-1 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">calculate</span>
                  Calculateur de Taille
                </h3>
                <p className="text-sm text-accent-beige mb-6">
                  Entrez la circonférence de votre doigt en millimètres pour trouver votre taille.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
                  <div className="flex-1 max-w-xs">
                    <label className="block text-xs uppercase tracking-widest text-accent-beige mb-2 font-bold">
                      Circonférence (mm)
                    </label>
                    <input
                      type="number"
                      min={40}
                      max={75}
                      step={0.5}
                      value={circumference}
                      onChange={(e) => setCircumference(e.target.value)}
                      placeholder="Ex: 52"
                      className="w-full h-12 px-4 text-lg font-bold rounded-lg border-2 border-primary/30 bg-white focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                  </div>

                  {matchedSize && (
                    <div className="flex gap-4 items-center bg-white rounded-lg border border-primary/20 px-6 py-3 shadow-sm">
                      <div className="text-center">
                        <p className="text-xs text-accent-beige uppercase tracking-widest">Taille FR</p>
                        <p className="text-3xl font-black text-primary">{matchedSize.fr}</p>
                      </div>
                      <div className="w-px h-12 bg-primary/20" />
                      <div className="text-center">
                        <p className="text-xs text-accent-beige uppercase tracking-widest">Diamètre</p>
                        <p className="text-xl font-bold text-secondary-dark">{matchedSize.diameter} mm</p>
                      </div>
                    </div>
                  )}

                  {circumference && !matchedSize && (
                    <p className="text-sm text-red-500 font-medium py-3">
                      Valeur hors plage (41-72 mm)
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Conversion Table */}
            <div className="p-4 mt-2">
              <div className="bg-white/50 rounded-xl border border-accent-beige/20 overflow-hidden">
                <div className="px-6 py-4 border-b border-accent-beige/10">
                  <h3 className="text-lg font-bold flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">table_chart</span>
                    Tableau de Correspondance
                  </h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-primary/5">
                        <th className="px-4 py-3 text-left font-bold text-xs uppercase tracking-wider text-accent-beige">Taille FR</th>
                        <th className="px-4 py-3 text-left font-bold text-xs uppercase tracking-wider text-accent-beige">Circonférence</th>
                        <th className="px-4 py-3 text-left font-bold text-xs uppercase tracking-wider text-accent-beige">Diamètre</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-accent-beige/10">
                      {RING_SIZES.filter((_, i) => i % 2 === 0).map((size) => (
                        <tr
                          key={size.fr}
                          className={`transition-colors ${
                            matchedSize?.fr === size.fr
                              ? 'bg-primary/10 font-bold'
                              : 'hover:bg-primary/5'
                          }`}
                        >
                          <td className="px-4 py-2.5 font-bold">{size.fr}</td>
                          <td className="px-4 py-2.5">{size.circumference} mm</td>
                          <td className="px-4 py-2.5">{size.diameter} mm</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            
            {/* ImageGrid: Ring Size Chart Circles */}
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4 p-4">
              {RING_SIZE_CARDS.map(({ label, circleClass }) => (
                <div key={label} className={ringCardClass}>
                  <div className="flex min-h-0 flex-1 w-full items-center justify-center">
                    <div className={`shrink-0 rounded-full border-2 border-primary ${circleClass}`} />
                  </div>
                  <p className="text-secondary-dark shrink-0 pt-2 text-center text-sm font-bold leading-tight">
                    {label}
                  </p>
                </div>
              ))}
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
