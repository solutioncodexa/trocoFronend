import { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useGoldTypes } from '@/hooks/useGoldTypes';

const SurMesure = () => {
  const [formData, setFormData] = useState({
    type: '',
    style: '',
    poids: '',
    description: '',
    goldType: ''
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Handle form submission logic here
  };

  const { goldTypesWithColors: goldTypes } = useGoldTypes();

  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-16 md:py-24 bg-paper-pattern relative">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="flex flex-col items-center mb-12">
            <div className="w-16 h-px bg-primary/60 mb-4"></div>
            <h1 className="font-script text-6xl md:text-8xl text-primary mb-6">L'artisanat sur mesure</h1>
            <p className="text-accent-beige uppercase tracking-[0.3em] text-sm mb-8">Votre vision, notre savoir-faire</p>
            <div className="w-16 h-px bg-primary/60 mt-4"></div>
          </div>
          <div className="bg-white/50 dark:bg-background-dark/50 backdrop-blur-sm p-8 md:p-12 border border-accent-beige/20 shadow-xl rounded-sm">
            <p className="text-lg md:text-xl text-secondary-dark/80 dark:text-white/80 leading-relaxed font-light italic">
              "Donnez vie à vos rêves les plus précieux. Nos maîtres joailliers mettent leur expertise à votre service pour créer une pièce unique, reflet de votre personnalité et de votre histoire. Chaque détail est minutieusement étudié pour atteindre la perfection de l'artisanat."
            </p>
          </div>
        </div>
      </section>

      {/* Main Form Section */}
      <section className="py-20 bg-white dark:bg-background-dark border-y border-accent-beige/10">
        <div className="max-w-[1280px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-20">
          {/* Form Section */}
          <div className="order-2 lg:order-1">
            <h2 className="text-3xl font-display mb-8 flex items-center gap-4">
              <span className="material-symbols-outlined text-4xl text-primary">edit_note</span>
              Détails du projet
            </h2>
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <Label htmlFor="type" className="block text-xs uppercase tracking-widest text-accent-beige mb-3 font-bold">
                    Type de bijou
                  </Label>
                  <select 
                    id="type"
                    value={formData.type} 
                    onChange={(e) => handleInputChange('type', e.target.value)}
                    className="w-full bg-paper dark:bg-secondary-dark border-accent-beige/30 py-3 px-4 focus:ring-primary focus:border-primary rounded-none text-sm"
                  >
                    <option value="">Sélectionnez un type</option>
                    <option value="bague">Bague / Alliance</option>
                    <option value="collier">Collier</option>
                    <option value="bracelet">Bracelet</option>
                    <option value="boucles">Boucles d'oreilles</option>
                    <option value="parure">Parure complète</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="style" className="block text-xs uppercase tracking-widest text-accent-beige mb-3 font-bold">
                    Style souhaité
                  </Label>
                  <select 
                    id="style"
                    value={formData.style} 
                    onChange={(e) => handleInputChange('style', e.target.value)}
                    className="w-full bg-paper dark:bg-secondary-dark border-accent-beige/30 py-3 px-4 focus:ring-primary focus:border-primary rounded-none text-sm"
                  >
                    <option value="">Sélectionnez un style</option>
                    <option value="beldi">Style Beldi (Traditionnel)</option>
                    <option value="moderne">Moderne & Minimaliste</option>
                    <option value="fusion">Fusion (Beldi-Moderne)</option>
                  </select>
                </div>
              </div>
              <div>
                <Label htmlFor="poids" className="block text-xs uppercase tracking-widest text-accent-beige mb-3 font-bold">
                  Poids estimé (grammes d'or)
                </Label>
                <Input
                  id="poids"
                  type="number"
                  placeholder="Ex: 15"
                  value={formData.poids}
                  onChange={(e) => handleInputChange('poids', e.target.value)}
                  className="w-full bg-paper dark:bg-secondary-dark border-accent-beige/30 py-3 px-4 focus:ring-primary focus:border-primary rounded-none text-sm"
                />
                <p className="text-[10px] text-accent-beige/60 mt-2 italic">Estimation indicative pour le devis initial</p>
              </div>

              {/* Type d'Or */}
              <div>
                <Label className="block text-xs uppercase tracking-widest text-accent-beige mb-3 font-bold">
                  Type d'Or
                </Label>
                <div className="flex gap-4">
                  {goldTypes.map(goldType => (
                    <button
                      key={goldType.id}
                      onClick={() => handleInputChange('goldType', goldType.id)}
                      className={`size-8 rounded-full border-2 border-white shadow-sm ring-1 ring-accent-beige/20 hover:scale-110 transition-transform ${formData.goldType === goldType.id ? 'ring-2 ring-primary' : ''}`}
                      style={{ backgroundColor: goldType.color }}
                      title={goldType.label}
                    />
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="desc" className="block text-xs uppercase tracking-widest text-accent-beige mb-3 font-bold">
                  Description de votre projet
                </Label>
                <Textarea
                  id="desc"
                  placeholder="Décrivez les motifs, les pierres souhaitées ou l'histoire derrière ce bijou..."
                  rows={5}
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className="w-full bg-paper dark:bg-secondary-dark border-accent-beige/30 py-3 px-4 focus:ring-primary focus:border-primary rounded-none text-sm"
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-secondary-dark text-white hover:bg-primary transition-all duration-500 py-4 px-8 text-sm uppercase tracking-[0.2em] font-bold shadow-lg flex items-center justify-center gap-3"
              >
                Soumettre ma demande
                <span className="material-symbols-outlined text-lg">auto_awesome</span>
              </Button>
            </form>
          </div>

          {/* Upload Section */}
          <div className="order-1 lg:order-2 flex flex-col justify-center">
            <div className="relative group">
              <h2 className="text-3xl font-display mb-8 flex items-center gap-4">
                <span className="material-symbols-outlined text-4xl text-primary">draw</span>
                Inspirations & Croquis
              </h2>
              <p className="text-secondary-dark/70 dark:text-white/70 mb-8 font-light leading-relaxed">
                Si vous possédez des croquis, des photos d'inspiration ou des références de notre catalogue, merci de les joindre ici. Cela aidera nos artisans à mieux cerner votre demande.
              </p>
              <div className="dotted-gold-border rounded-lg p-12 flex flex-col items-center justify-center text-center cursor-pointer transition-transform hover:scale-[1.01] group border-2">
                <div className="size-20 rounded-full bg-white dark:bg-secondary-dark shadow-inner flex items-center justify-center mb-6 group-hover:bg-primary/10 transition-colors">
                  <span className="material-symbols-outlined text-4xl text-primary">cloud_upload</span>
                </div>
                <h4 className="text-lg font-bold mb-2">Déposez vos fichiers ici</h4>
                <p className="text-sm text-accent-beige/80 mb-6">Formats acceptés : JPG, PNG, PDF (Max 10MB)</p>
                <Button
                  type="button"
                  variant="outline"
                  className="border border-primary text-primary px-6 py-2 text-xs uppercase tracking-widest font-bold hover:bg-primary hover:text-white transition-all"
                >
                  Parcourir mes dossiers
                </Button>
              </div>
            </div>

            {/* Expert Advice */}
            <div className="mt-12 p-8 border border-accent-beige/10 bg-paper dark:bg-secondary-dark/30 rounded-sm">
              <div className="flex items-center gap-4 mb-4">
                <div className="size-12 rounded-full overflow-hidden border-2 border-primary/20">
                  <img
                    alt="Artisan"
                    className="w-full h-full object-cover"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBPWlW1V_WB8y-vOvxcgRMAegm0uaK5rCfOEXZxeM1sbC0b3WM4QohiZrFS_tVTAVuMKGz3KFGVP5H93yoocVbIzJUd0qImXuLlXwJQlUMungiFff5pLPk-Cy-om2EQSEalkdfxn1r9xXZFQ_cnkCbzIMj04DwnVYdDDvSuBX7GUdrkE2kdsoycZg8CnDeMJqMsRyiHKVgFgNDkY9VbOoFehCt_Xq_5xCLsMbit3W3NMX8Ng1WsLHFTVPEUWjL1nu54xZuFKUHJ-6Qk"
                  />
                </div>
                <div>
                  <p className="text-sm font-bold uppercase tracking-wide">Conseil d'expert</p>
                  <p className="text-xs text-accent-beige italic">Nezha, Maître Joaillière</p>
                </div>
              </div>
              <p className="text-sm italic text-secondary-dark/70 dark:text-white/70">
                "Pour les pièces Beldi, n'hésitez pas à mentionner si vous souhaitez une finition martelée ou lisse. C'est ce qui donne toute l'âme au bijou."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-16 md:py-24 bg-bg-paper-pattern">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="flex flex-col items-center mb-16 text-center">
            <div className="w-24 h-px bg-accent-beige/40 mb-4 relative">
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 size-2 rotate-45 border border-accent-beige bg-background-light"></div>
            </div>
            <h3 className="font-script text-6xl text-primary mb-2">Processus</h3>
            <p className="text-accent-beige uppercase tracking-widest text-sm">Votre bijou sur-mesure en 3 étapes</p>
            <div className="w-24 h-px bg-accent-beige/40 mt-4 relative">
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 size-2 rotate-45 border border-accent-beige bg-background-light"></div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group bg-paper dark:bg-[#2a2515] p-8 border border-accent-beige/20 shadow-sm hover:shadow-lg transition-all duration-500 hover:-translate-y-1 text-center">
              <div className="w-20 h-20 bg-primary text-white rounded-full flex items-center justify-center text-3xl font-bold mb-6 mx-auto">
                1
              </div>
              <h4 className="font-display text-lg font-bold text-secondary-dark dark:text-white mb-3">Envoyez votre idée</h4>
              <p className="text-accent-beige text-sm leading-relaxed">Image ou description de votre bijou</p>
            </div>
            
            <div className="group bg-paper dark:bg-[#2a2515] p-8 border border-accent-beige/20 shadow-sm hover:shadow-lg transition-all duration-500 hover:-translate-y-1 text-center">
              <div className="w-20 h-20 bg-primary text-white rounded-full flex items-center justify-center text-3xl font-bold mb-6 mx-auto">
                2
              </div>
              <h4 className="font-display text-lg font-bold text-secondary-dark dark:text-white mb-3">Devis personnalisé</h4>
              <p className="text-accent-beige text-sm leading-relaxed">Nous vous contactons sous 48h</p>
            </div>
            
            <div className="group bg-paper dark:bg-[#2a2515] p-8 border border-accent-beige/20 shadow-sm hover:shadow-lg transition-all duration-500 hover:-translate-y-1 text-center">
              <div className="w-20 h-20 bg-primary text-white rounded-full flex items-center justify-center text-3xl font-bold mb-6 mx-auto">
                3
              </div>
              <h4 className="font-display text-lg font-bold text-secondary-dark dark:text-white mb-3">Fabrication</h4>
              <p className="text-accent-beige text-sm leading-relaxed">Création artisanale de votre bijou</p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default SurMesure;
