import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { customOrdersApi, categoriesApi } from '@/services/api';
import { CustomOrderDTO } from '@/types/api';
import { toast } from 'sonner';
import { toastError } from '@/utils/toastMessages';
import { staticCatalogQueryOptions } from '@/config/queryOptions';
import { CloudUpload, X, Loader2, Check } from 'lucide-react';

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ACCEPTED_TYPES = 'image/jpeg,image/png,image/webp,.pdf';

export type PackagingRequestVariant = 'sur-mesure' | 'devis';

type NeedOption = { value: string; label: string };

type VariantConfig = {
  title: string;
  eyebrow: string;
  subtitle: string;
  needTypes: NeedOption[];
  needLabel: string;
  descriptionPlaceholder: string;
  uploadTitle: string;
  uploadHint: string;
  tip: string;
  submitLabel: string;
  successMessage: string;
  processEyebrow: string;
  processSteps: { n: number; title: string; desc: string }[];
  altLink: { to: string; label: string };
  defaultDescription: string;
  /** Préfixe type API pour distinguer en admin */
  typePrefix: string;
};

const CONFIG: Record<PackagingRequestVariant, VariantConfig> = {
  'sur-mesure': {
    title: 'Sur mesure',
    eyebrow: 'Création & personnalisation',
    subtitle: 'Logo, formats uniques et finitions adaptées à votre marque.',
    needTypes: [
      { value: 'personnalisation-logo', label: 'Personnalisation logo' },
      { value: 'produit-unique', label: 'Produit / format unique' },
      { value: 'dimensions-specifiques', label: 'Dimensions spécifiques' },
      { value: 'autre-sur-mesure', label: 'Autre projet sur mesure' },
    ],
    needLabel: 'Type de création *',
    descriptionPlaceholder: 'Logo, couleurs, finitions, contraintes de production…',
    uploadTitle: 'Logo ou maquette',
    uploadHint: 'JPG, PNG, PDF — max 10 Mo (5 fichiers)',
    tip: 'Joignez votre logo en haute définition (PDF ou PNG) pour un rendu fidèle.',
    submitLabel: 'Envoyer ma demande sur mesure',
    successMessage: 'notre équipe étudie votre projet sur mesure et vous contacte sous 48h.',
    processEyebrow: 'Votre projet sur mesure en 3 étapes',
    processSteps: [
      { n: 1, title: 'Brief & maquette', desc: 'Décrivez le produit et envoyez votre logo' },
      { n: 2, title: 'Proposition', desc: 'Validation technique et devis associé' },
      { n: 3, title: 'Production', desc: 'Fabrication personnalisée puis livraison' },
    ],
    altLink: { to: '/devis', label: 'Besoin d’un devis volume ? Demandez un devis →' },
    defaultDescription: 'Demande sur mesure emballage',
    typePrefix: 'sur-mesure',
  },
  devis: {
    title: 'Demande de devis',
    eyebrow: 'Tarifs & volumes professionnels',
    subtitle: 'Chiffrage pour commandes en gros, multi-produits et renouvellement de stock.',
    needTypes: [
      { value: 'commande-gros', label: 'Commande en gros' },
      { value: 'renouvellement-stock', label: 'Renouvellement de stock' },
      { value: 'devis-multi-produits', label: 'Devis multi-produits' },
      { value: 'autre-devis', label: 'Autre demande de devis' },
    ],
    needLabel: 'Type de devis *',
    descriptionPlaceholder: 'Volumes, fréquence, délais, budget approximatif, livraison…',
    uploadTitle: 'Fichiers utiles (optionnel)',
    uploadHint: 'Liste de besoins, cahier des charges — JPG, PNG, PDF',
    tip: 'Indiquez le volume mensuel et le délai souhaité pour un chiffrage précis.',
    submitLabel: 'Envoyer ma demande de devis',
    successMessage: 'notre équipe prépare votre devis et vous contacte sous 48h.',
    processEyebrow: 'Votre devis en 3 étapes',
    processSteps: [
      { n: 1, title: 'Besoins & volumes', desc: 'Catégories, quantités, délais' },
      { n: 2, title: 'Devis détaillé', desc: 'Réponse sous 48h (WhatsApp / email)' },
      { n: 3, title: 'Commande', desc: 'Validation puis préparation / livraison' },
    ],
    altLink: { to: '/sur-mesure', label: 'Projet personnalisé avec logo ? Sur mesure →' },
    defaultDescription: 'Demande de devis emballage',
    typePrefix: 'devis',
  },
};

interface PackagingRequestFormProps {
  variant: PackagingRequestVariant;
}

export default function PackagingRequestForm({ variant }: PackagingRequestFormProps) {
  const cfg = CONFIG[variant];
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    dimensions: '',
    quantity: '',
    description: '',
    fullName: '',
    phone: '',
    email: '',
    address: '',
    city: '',
  });

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
    if (validFiles.length === 0) return;

    setImageFiles((prev) => [...prev, ...validFiles].slice(0, 5));

    validFiles.forEach((file) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreviews((prev) => [...prev, reader.result as string].slice(0, 5));
        };
        reader.readAsDataURL(file);
      } else {
        setImagePreviews((prev) => [...prev, ''].slice(0, 5));
      }
    });

    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeImage = (index: number) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const createMutation = useMutation({
    mutationFn: async ({ order, images }: { order: Partial<CustomOrderDTO>; images: File[] }) => {
      if (images.length > 0) {
        return customOrdersApi.createCustomOrderWithImages(order, images);
      }
      return customOrdersApi.createCustomOrder(order);
    },
    onSuccess: () => {
      setIsSuccess(true);
      toast.success(
        variant === 'devis' ? 'Demande de devis envoyée !' : 'Demande sur mesure envoyée !'
      );
    },
    onError: (err: Error) => toastError(err, "Impossible d'envoyer la demande"),
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
      toast.error('Type de besoin requis');
      return;
    }
    if (!formData.style) {
      toast.error('Catégorie requise');
      return;
    }

    const dimLine = formData.dimensions.trim()
      ? `Dimensions / format : ${formData.dimensions.trim()}. `
      : '';
    const qtyLine = formData.quantity.trim()
      ? `Quantité estimée : ${formData.quantity.trim()}. `
      : '';
    const channelLine = `[${cfg.typePrefix}] `;
    const fullDesc =
      (channelLine + dimLine + qtyLine + (formData.description || '')).trim() ||
      cfg.defaultDescription;

    const customOrder: Partial<CustomOrderDTO> = {
      type: `${cfg.typePrefix}:${formData.type}`,
      style: formData.style,
      size: formData.dimensions.trim() || undefined,
      weight: formData.quantity ? parseFloat(formData.quantity) : undefined,
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
      dimensions: '',
      quantity: '',
      description: '',
      fullName: '',
      phone: '',
      email: '',
      address: '',
      city: '',
    });
    setImageFiles([]);
    setImagePreviews([]);
  };

  if (isSuccess) {
    return (
      <Layout>
        <section className="py-24 bg-paper-pattern">
          <div className="max-w-lg mx-auto px-6 text-center">
            <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <Check className="w-10 h-10 text-primary" />
            </div>
            <h1 className="font-display text-4xl md:text-5xl text-foreground mb-4">Demande envoyée !</h1>
            <p className="text-muted-foreground mb-8">
              Merci {formData.fullName} — {cfg.successMessage}
            </p>
            <Button onClick={resetForm} variant="outline" className="font-body">
              Nouvelle demande
            </Button>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="relative overflow-hidden border-b border-border bg-gradient-to-br from-card via-card to-primary/5 animate-fade-in">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.12]"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1605745341112-859dfc6dd42e?w=1600&h=600&fit=crop&q=80')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
          aria-hidden
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-card via-card/90 to-primary/10" aria-hidden />
        <div className="relative z-10 mx-auto max-w-[1400px] px-4 py-6 sm:px-6 sm:py-8 md:py-9">
          <div className="flex flex-col items-start gap-2 sm:items-center sm:text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">{cfg.eyebrow}</p>
            <h1 className="font-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl md:text-4xl">
              {cfg.title}
            </h1>
            <p className="max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              {cfg.subtitle}
            </p>
            <Link
              to={cfg.altLink.to}
              className="pt-1 text-sm font-medium text-primary underline-offset-4 hover:underline"
            >
              {cfg.altLink.label}
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 bg-background border-y border-border">
        <div className="max-w-[1280px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-20">
          <div className="order-2 lg:order-1">
            <h2 className="font-display text-3xl mb-8">Détails du projet</h2>
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <Label className="mb-3 block text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                    {cfg.needLabel}
                  </Label>
                  <Select
                    value={formData.type || undefined}
                    onValueChange={(value) => handleInputChange('type', value)}
                  >
                    <SelectTrigger className="h-10 w-full rounded-xl">
                      <SelectValue placeholder="Sélectionnez" />
                    </SelectTrigger>
                    <SelectContent>
                      {cfg.needTypes.map((t) => (
                        <SelectItem key={t.value} value={t.value}>
                          {t.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="mb-3 block text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                    Catégorie *
                  </Label>
                  <Select
                    value={formData.style || undefined}
                    onValueChange={(value) => handleInputChange('style', value)}
                  >
                    <SelectTrigger className="h-10 w-full rounded-xl">
                      <SelectValue placeholder="Sélectionnez" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.slug}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <Label className="block text-xs uppercase tracking-widest text-muted-foreground mb-3 font-semibold">
                    Dimensions / format
                  </Label>
                  <Input
                    placeholder="Ex: 25×35 cm, pack 100"
                    value={formData.dimensions}
                    onChange={(e) => handleInputChange('dimensions', e.target.value)}
                  />
                </div>
                <div>
                  <Label className="block text-xs uppercase tracking-widest text-muted-foreground mb-3 font-semibold">
                    Quantité estimée
                  </Label>
                  <Input
                    type="number"
                    min={1}
                    placeholder="Ex: 500"
                    value={formData.quantity}
                    onChange={(e) => handleInputChange('quantity', e.target.value)}
                  />
                </div>
              </div>

              <div>
                <Label className="block text-xs uppercase tracking-widest text-muted-foreground mb-3 font-semibold">
                  Description
                </Label>
                <Textarea
                  placeholder={cfg.descriptionPlaceholder}
                  rows={5}
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                />
              </div>

              <div className="space-y-6 border-t border-border pt-8">
                <h3 className="font-display text-xl text-foreground">Vos coordonnées *</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2 font-semibold">
                      Nom complet *
                    </Label>
                    <Input
                      value={formData.fullName}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                      placeholder="Nom et prénom"
                      required
                    />
                  </div>
                  <div>
                    <Label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2 font-semibold">
                      Téléphone *
                    </Label>
                    <Input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="06 XX XX XX XX"
                      required
                    />
                  </div>
                  <div>
                    <Label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2 font-semibold">
                      Adresse *
                    </Label>
                    <Input
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      placeholder="Adresse complète"
                      required
                    />
                  </div>
                  <div>
                    <Label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2 font-semibold">
                      Ville *
                    </Label>
                    <Input
                      value={formData.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      placeholder="Casablanca, Rabat…"
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2 font-semibold">
                      Email
                    </Label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="vous@entreprise.ma"
                    />
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                disabled={createMutation.isPending}
                size="lg"
                className="w-full h-12 uppercase tracking-widest font-semibold"
              >
                {createMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Envoi…
                  </>
                ) : (
                  cfg.submitLabel
                )}
              </Button>
            </form>
          </div>

          <div className="order-1 lg:order-2">
            <h2 className="font-display text-3xl mb-8 text-foreground">{cfg.uploadTitle}</h2>
            <input
              ref={fileInputRef}
              type="file"
              accept={ACCEPTED_TYPES}
              multiple
              className="hidden"
              onChange={handleImageSelect}
            />
            <div
              role="button"
              tabIndex={0}
              onClick={() => fileInputRef.current?.click()}
              onKeyDown={(e) => e.key === 'Enter' && fileInputRef.current?.click()}
              className="border-2 border-dashed border-border rounded-2xl p-8 min-h-[280px] cursor-pointer hover:border-primary/50 transition-colors bg-card/50"
            >
              {imagePreviews.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {imageFiles.map((file, i) => {
                    const preview = imagePreviews[i];
                    return (
                      <div
                        key={`${file.name}-${i}`}
                        className="relative aspect-square rounded-xl overflow-hidden border border-border"
                      >
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
                    );
                  })}
                  {imagePreviews.length < 5 && (
                    <div className="aspect-square rounded-xl border-2 border-dashed border-border flex flex-col items-center justify-center text-muted-foreground">
                      <CloudUpload className="w-8 h-8 mb-2" />
                      <span className="text-xs">Ajouter</span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center text-center py-10">
                  <CloudUpload className="w-10 h-10 text-primary mb-4" />
                  <h4 className="font-display text-lg font-semibold text-foreground mb-2">{cfg.uploadTitle}</h4>
                  <p className="text-sm text-muted-foreground mb-6">{cfg.uploadHint}</p>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      fileInputRef.current?.click();
                    }}
                    className="text-xs uppercase tracking-widest font-semibold"
                  >
                    Parcourir
                  </Button>
                </div>
              )}
            </div>

            <div className="mt-12 p-8 border border-border bg-card rounded-2xl shadow-soft">
              <p className="text-sm font-semibold uppercase tracking-wide mb-2 text-foreground">Conseil Troco</p>
              <p className="text-sm italic text-muted-foreground">{cfg.tip}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-paper-pattern">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="flex flex-col items-center mb-16 text-center">
            <h3 className="font-display text-4xl md:text-5xl text-foreground mb-2">Processus</h3>
            <p className="text-primary uppercase tracking-widest text-sm">{cfg.processEyebrow}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {cfg.processSteps.map((item) => (
              <div
                key={item.n}
                className="group bg-card p-8 border border-border rounded-2xl shadow-soft hover:shadow-glow transition-all duration-300 text-center"
              >
                <div className="w-20 h-20 bg-primary text-primary-foreground rounded-2xl flex items-center justify-center text-3xl font-display font-semibold mb-6 mx-auto">
                  {item.n}
                </div>
                <h4 className="font-display text-lg font-semibold text-foreground mb-3">
                  {item.title}
                </h4>
                <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
