import { useState, useRef, useMemo, useEffect } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { customOrdersApi, productTypesApi, categoriesApi } from '@/services/api';
import { sortProductTypesForEnsemble } from '@/utils/productTypeSort';
import { getSurMesureSizeOptionsForCategory } from '@/config/surMesureSizes';
import { CustomOrderDTO } from '@/types/api';
import { toast } from 'sonner';
import { toastError } from '@/utils/toastMessages';
import { staticCatalogQueryOptions } from '@/config/queryOptions';
import { CloudUpload, X, Loader2, Check } from 'lucide-react';

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ACCEPTED_TYPES = 'image/jpeg,image/png,image/webp,.pdf';

const SurMesure = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: productTypes = [] } = useQuery({
    queryKey: ['productTypes'],
    queryFn: () => productTypesApi.getAllProductTypes(),
    ...staticCatalogQueryOptions,
  });
  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoriesApi.getAllCategories(),
    ...staticCatalogQueryOptions,
  });

  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [isSuccess, setIsSuccess] = useState(false);

  const [formData, setFormData] = useState({
    type: '',
    style: '',
    taille: '',
    poids: '',
    description: '',
    fullName: '',
    phone: '',
    email: '',
    address: '',
    city: '',
  });

  const sortedProductTypes = useMemo(() => {
    const list = [...productTypes];
    if (formData.style === 'ensemble') {
      return sortProductTypesForEnsemble(list);
    }
    return list.sort((a, b) => a.name.localeCompare(b.name, 'fr'));
  }, [productTypes, formData.style]);

  const sizeOptions = useMemo(
    () => getSurMesureSizeOptionsForCategory(formData.style),
    [formData.style]
  );

  useEffect(() => {
    setFormData((prev) => ({ ...prev, taille: '' }));
  }, [formData.style]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles: File[] = [];

    for (const file of files) {
      if (file.size > MAX_FILE_SIZE) {
        toast.error(`${file.name} dépasse 10 MB`);
        continue;
      }
      validFiles.push(file);
    }

    const imageFiles = validFiles.filter((f) => f.type.startsWith('image/'));
    const promises = imageFiles.map(
      (f) =>
        new Promise<string>((res) => {
          const r = new FileReader();
          r.onload = () => res(r.result as string);
          r.readAsDataURL(f);
        })
    );

    Promise.all(promises).then((previews) => {
      const allPreviews: string[] = [];
      let idx = 0;
      validFiles.forEach((f) => {
        if (f.type.startsWith('image/')) {
          allPreviews.push(previews[idx++] || '');
        } else {
          allPreviews.push('');
        }
      });
      setImageFiles((prev) => [...prev, ...validFiles].slice(0, 5));
      setImagePreviews((prev) => [...prev, ...allPreviews].slice(0, 5));
    });

    e.target.value = '';
  };

  const removeImage = (index: number) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const createMutation = useMutation({
    mutationFn: async (payload: { order: Partial<CustomOrderDTO>; images: File[] }) => {
      if (payload.images.length > 0) {
        return customOrdersApi.createCustomOrderWithImages(payload.order, payload.images);
      }
      return customOrdersApi.createCustomOrder(payload.order);
    },
    onSuccess: () => {
      setIsSuccess(true);
      toast.success('Votre demande a été envoyée avec succès !');
    },
    onError: (err: Error) => {
      toastError(err, 'Erreur lors de l\'envoi');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.fullName?.trim()) {
      toast.error('Nom complet requis');
      return;
    }
    if (!formData.phone?.trim()) {
      toast.error('Téléphone requis');
      return;
    }
    if (!formData.address?.trim()) {
      toast.error('Adresse requise');
      return;
    }
    if (!formData.city?.trim()) {
      toast.error('Ville requise');
      return;
    }
    if (!formData.type) {
      toast.error('Type de bijou requis');
      return;
    }
    if (!formData.style) {
      toast.error('Style souhaité requis');
      return;
    }

    const sizeLine = formData.taille
      ? `Taille / tour souhaité : ${sizeOptions.find((o) => o.value === formData.taille)?.label || formData.taille}. `
      : '';
    const fullDesc = (sizeLine + (formData.description || '')).trim() || 'Commande personnalisée';

    const customOrder: Partial<CustomOrderDTO> = {
      type: formData.type,
      style: formData.style,
      size: formData.taille || undefined,
      weight: formData.poids ? parseFloat(formData.poids) : undefined,
      description: fullDesc,
      customer: {
        fullName: formData.fullName.trim(),
        phone: formData.phone.trim(),
        email: formData.email?.trim() || undefined,
        address: formData.address.trim(),
        city: formData.city.trim(),
      },
    };

    createMutation.mutate({ order: customOrder, images: imageFiles });
  };

  const resetForm = () => {
    setIsSuccess(false);
    setFormData({
      type: '',
      style: '',
      taille: '',
      address: '',
      city: '',
      poids: '',
      description: '',
      fullName: '',
      phone: '',
      email: '',
    });
    setImageFiles([]);
    setImagePreviews([]);
  };

  if (isSuccess) {
    return (
      <Layout>
        <section className="py-24 bg-paper-pattern">
          <div className="max-w-lg mx-auto px-6 text-center">
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
              <Check className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="font-script text-5xl text-primary mb-4">Demande envoyée !</h1>
            <p className="text-secondary-dark/80 dark:text-white/80 mb-8">
              Merci pour votre demande de création sur mesure, {formData.fullName} !
              Notre équipe examinera votre projet et vous contactera sous 48h.
            </p>
            <Button onClick={resetForm} variant="outline" className="font-body">
              Faire une nouvelle demande
            </Button>
          </div>
        </section>
      </Layout>
    );
  }

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
              "Donnez vie à vos rêves les plus précieux. Nos maîtres joailliers mettent leur expertise à votre service pour créer une pièce unique, reflet de votre personnalité et de votre histoire."
            </p>
          </div>
        </div>
      </section>

      {/* Main Form Section */}
      <section className="py-20 bg-white dark:bg-background-dark border-y border-accent-beige/10">
        <div className="max-w-[1280px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-20">
          <div className="order-2 lg:order-1">
            <h2 className="text-3xl font-display mb-8 flex items-center gap-4">
              <span className="material-symbols-outlined text-4xl text-primary">edit_note</span>
              Détails du projet
            </h2>
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <Label className="block text-xs uppercase tracking-widest text-accent-beige mb-3 font-bold">
                    Type de bijou *
                  </Label>
                  <select
                    value={formData.type}
                    onChange={(e) => handleInputChange('type', e.target.value)}
                    className="w-full bg-paper dark:bg-secondary-dark border-accent-beige/30 py-3 px-4 focus:ring-primary focus:border-primary rounded-none text-sm"
                    required
                  >
                    <option value="">Sélectionnez un type</option>
                    {sortedProductTypes.map((pt) => (
                      <option key={pt.id} value={pt.code.toLowerCase()}>
                        {pt.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label className="block text-xs uppercase tracking-widest text-accent-beige mb-3 font-bold">
                    Style souhaité *
                  </Label>
                  <select
                    value={formData.style}
                    onChange={(e) => handleInputChange('style', e.target.value)}
                    className="w-full bg-paper dark:bg-secondary-dark border-accent-beige/30 py-3 px-4 focus:ring-primary focus:border-primary rounded-none text-sm"
                    required
                  >
                    <option value="">Sélectionnez un style</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.slug}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <Label className="block text-xs uppercase tracking-widest text-accent-beige mb-3 font-bold">
                  Taille / tour (selon la catégorie)
                </Label>
                <select
                  value={formData.taille}
                  onChange={(e) => handleInputChange('taille', e.target.value)}
                  disabled={!formData.style}
                  className="w-full bg-paper dark:bg-secondary-dark border-accent-beige/30 py-3 px-4 focus:ring-primary focus:border-primary rounded-none text-sm disabled:opacity-50"
                >
                  <option value="">
                    {formData.style ? 'Sélectionnez une taille (optionnel)' : 'Choisissez d’abord une catégorie'}
                  </option>
                  {sizeOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label className="block text-xs uppercase tracking-widest text-accent-beige mb-3 font-bold">
                  Poids estimé (grammes d'or)
                </Label>
                <Input
                  type="number"
                  placeholder="Ex: 15"
                  value={formData.poids}
                  onChange={(e) => handleInputChange('poids', e.target.value)}
                  className="w-full bg-paper dark:bg-secondary-dark border-accent-beige/30 py-3 px-4 focus:ring-primary focus:border-primary rounded-none text-sm"
                />
                <p className="text-[10px] text-accent-beige/60 mt-2 italic">Estimation indicative pour le devis initial</p>
              </div>

              <div>
                <Label className="block text-xs uppercase tracking-widest text-accent-beige mb-3 font-bold">
                  Description de votre projet
                </Label>
                <Textarea
                  placeholder="Décrivez les motifs, les pierres souhaitées ou l'histoire derrière ce bijou..."
                  rows={5}
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className="w-full bg-paper dark:bg-secondary-dark border-accent-beige/30 py-3 px-4 focus:ring-primary focus:border-primary rounded-none text-sm"
                />
              </div>

              <div className="space-y-6 border-t border-accent-beige/20 pt-8">
                <h3 className="font-display text-xl">Vos coordonnées *</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label className="block text-xs uppercase tracking-widest text-accent-beige mb-2 font-bold">
                      Nom complet *
                    </Label>
                    <Input
                      value={formData.fullName}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                      placeholder="Votre nom et prénom"
                      className="w-full bg-paper dark:bg-secondary-dark border-accent-beige/30"
                      required
                    />
                  </div>
                  <div>
                    <Label className="block text-xs uppercase tracking-widest text-accent-beige mb-2 font-bold">
                      Téléphone *
                    </Label>
                    <Input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="06 XX XX XX XX"
                      className="w-full bg-paper dark:bg-secondary-dark border-accent-beige/30"
                      required
                    />
                  </div>
                  <div>
                    <Label className="block text-xs uppercase tracking-widest text-accent-beige mb-2 font-bold">
                      Adresse *
                    </Label>
                    <Input
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      placeholder="Votre adresse complète"
                      className="w-full bg-paper dark:bg-secondary-dark border-accent-beige/30"
                      required
                    />
                  </div>
                  <div>
                    <Label className="block text-xs uppercase tracking-widest text-accent-beige mb-2 font-bold">
                      Ville *
                    </Label>
                    <Input
                      value={formData.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      placeholder="Ex: Casablanca"
                      className="w-full bg-paper dark:bg-secondary-dark border-accent-beige/30"
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label className="block text-xs uppercase tracking-widest text-accent-beige mb-2 font-bold">
                      Email
                    </Label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="votre@email.com"
                      className="w-full bg-paper dark:bg-secondary-dark border-accent-beige/30"
                    />
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                disabled={createMutation.isPending}
                className="w-full bg-secondary-dark text-white hover:bg-primary transition-all py-4 px-8 text-sm uppercase tracking-[0.2em] font-bold shadow-lg flex items-center justify-center gap-3"
              >
                {createMutation.isPending ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    Soumettre ma demande
                    <span className="material-symbols-outlined text-lg">auto_awesome</span>
                  </>
                )}
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
                Si vous possédez des croquis, des photos d'inspiration ou des références de notre catalogue, merci de les joindre ici.
              </p>

              <input
                ref={fileInputRef}
                type="file"
                accept={ACCEPTED_TYPES}
                multiple
                onChange={handleImageSelect}
                className="hidden"
              />

              <div
                onClick={() => fileInputRef.current?.click()}
                className="dotted-gold-border rounded-lg p-12 flex flex-col items-center justify-center text-center cursor-pointer transition-transform hover:scale-[1.01] group border-2 min-h-[200px]"
              >
                {imagePreviews.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 w-full">
                    {imagePreviews.map((preview, i) => (
                      <div key={i} className="relative aspect-square rounded-lg overflow-hidden bg-muted">
                        {preview ? (
                          <img src={preview} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-sm text-muted-foreground">
                            PDF
                          </div>
                        )}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeImage(i);
                          }}
                          className="absolute top-1 right-1 p-1 rounded-full bg-destructive text-destructive-foreground"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    {imagePreviews.length < 5 && (
                      <div className="aspect-square rounded-lg border-2 border-dashed border-accent-beige/40 flex flex-col items-center justify-center text-muted-foreground hover:border-primary transition-colors">
                        <CloudUpload className="w-8 h-8 mb-2" />
                        <span className="text-xs">Ajouter</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <>
                    <div className="size-20 rounded-full bg-white dark:bg-secondary-dark shadow-inner flex items-center justify-center mb-6 group-hover:bg-primary/10 transition-colors">
                      <CloudUpload className="w-10 h-10 text-primary" />
                    </div>
                    <h4 className="text-lg font-bold mb-2">Déposez vos fichiers ici</h4>
                    <p className="text-sm text-accent-beige/80 mb-6">Formats acceptés : JPG, PNG, PDF (Max 10MB)</p>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        fileInputRef.current?.click();
                      }}
                      className="border border-primary text-primary px-6 py-2 text-xs uppercase tracking-widest font-bold hover:bg-primary hover:text-white transition-all"
                    >
                      Parcourir mes dossiers
                    </Button>
                  </>
                )}
              </div>

              {imagePreviews.length > 0 && imagePreviews.length < 5 && (
                <p className="text-xs text-muted-foreground mt-4 text-center">
                  Cliquez pour ajouter d'autres fichiers ({imagePreviews.length}/5)
                </p>
              )}
            </div>

            <div className="mt-12 p-8 border border-accent-beige/10 bg-paper dark:bg-secondary-dark/30 rounded-sm">
              <div className="flex items-center gap-4 mb-4">
                <img
                  alt="Artisan"
                  className="w-12 h-12 rounded-full object-cover border-2 border-primary/20"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBPWlW1V_WB8y-vOvxcgRMAegm0uaK5rCfOEXZxeM1sbC0b3WM4QohiZrFS_tVTAVuMKGz3KFGVP5H93yoocVbIzJUd0qImXuLlXwJQlUMungiFff5pLPk-Cy-om2EQSEalkdfxn1r9xXZFQ_cnkCbzIMj04DwnVYdDDvSuBX7GUdrkE2kdsoycZg8CnDeMJqMsRyiHKVgFgNDkY9VbOoFehCt_Xq_5xCLsMbit3W3NMX8Ng1WsLHFTVPEUWjL1nu54xZuKGUHJ-6Qk"
                />
                <div>
                  <p className="text-sm font-bold uppercase tracking-wide">Conseil d'expert</p>
                  <p className="text-xs text-accent-beige italic">Nezha, Maître Joaillière</p>
                </div>
              </div>
              <p className="text-sm italic text-secondary-dark/70 dark:text-white/70">
                "Pour les pièces Beldi, n'hésitez pas à mentionner si vous souhaitez une finition martelée ou lisse."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-16 md:py-24 bg-bg-paper-pattern">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="flex flex-col items-center mb-16 text-center">
            <h3 className="font-script text-6xl text-primary mb-2">Processus</h3>
            <p className="text-accent-beige uppercase tracking-widest text-sm">Votre bijou sur-mesure en 3 étapes</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { n: 1, title: 'Envoyez votre idée', desc: 'Image ou description de votre bijou' },
              { n: 2, title: 'Devis personnalisé', desc: 'Nous vous contactons sous 48h' },
              { n: 3, title: 'Fabrication', desc: 'Création artisanale de votre bijou' },
            ].map((item) => (
              <div key={item.n} className="group bg-paper dark:bg-[#2a2515] p-8 border border-accent-beige/20 shadow-sm hover:shadow-lg transition-all text-center">
                <div className="w-20 h-20 bg-primary text-white rounded-full flex items-center justify-center text-3xl font-bold mb-6 mx-auto">
                  {item.n}
                </div>
                <h4 className="font-display text-lg font-bold text-secondary-dark dark:text-white mb-3">{item.title}</h4>
                <p className="text-accent-beige text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default SurMesure;
