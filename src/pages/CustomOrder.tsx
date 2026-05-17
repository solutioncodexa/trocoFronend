import { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Upload, Send, Check } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { customOrdersApi, productTypesApi, categoriesApi } from '@/services/api';
import { CustomOrderDTO } from '@/types/api';
import { staticCatalogQueryOptions } from '@/config/queryOptions';

const CustomOrder = () => {
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    type: '',
    style: '',
    weight: '',
    description: ''
  });
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const {
      name,
      value
    } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('L\'image ne doit pas dépasser 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  // Mutation pour créer une commande personnalisée
  const createCustomOrderMutation = useMutation({
    mutationFn: async (customOrderData: Partial<CustomOrderDTO>) => {
      return await customOrdersApi.createCustomOrder(customOrderData);
    },
    onSuccess: () => {
      setIsSubmitting(false);
      setIsSuccess(true);
      toast.success('Demande de commande personnalisée envoyée avec succès!');
    },
    onError: (error: Error) => {
      setIsSubmitting(false);
      toast.error(error.message || 'Erreur lors de l\'envoi de la demande');
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.phone || !formData.address || !formData.city || !formData.type || !formData.style) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }
    setIsSubmitting(true);

    // Créer l'objet CustomOrderDTO
    const customOrderDTO: Partial<CustomOrderDTO> = {
      imageUrl: imagePreview || undefined,
      description: formData.description || `Commande personnalisée de type ${formData.type} en style ${formData.style}`,
      type: formData.type,
      weight: formData.weight ? parseFloat(formData.weight) : undefined,
      style: formData.style,
      customer: {
        fullName: formData.fullName,
        phone: formData.phone,
        email: formData.email || undefined,
      },
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    createCustomOrderMutation.mutate(customOrderDTO);
  };
  if (isSuccess) {
    return <Layout>
        <div className="container mx-auto px-4 py-20 text-center max-w-lg">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center">
            <Check className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="font-display text-3xl mb-4">Demande Envoyée!</h1>
          <p className="font-body text-muted-foreground mb-8">
            Merci pour votre demande de création sur mesure, {formData.fullName}!
            Notre équipe examinera votre projet et vous contactera sous 48h.
          </p>
          <Button onClick={() => {
          setIsSuccess(false);
          setFormData({
            fullName: '',
            phone: '',
            email: '',
            address: '',
            city: '',
            type: '',
            style: '',
            weight: '',
            description: ''
          });
          setImagePreview(null);
        }} variant="outline" className="font-body">
            Faire une nouvelle demande
          </Button>
        </div>
      </Layout>;
  }
  return <Layout>
      <section className="relative overflow-hidden border-b border-accent-beige/10 bg-paper bg-paper-pattern py-16 md:py-24">
        <div className="relative z-10 mx-auto max-w-[1400px] px-6">
          <div className="flex flex-col items-center text-center">
            <div className="mb-6 h-px w-12 bg-primary" />
            <h1 className="mb-4 font-script text-6xl text-primary md:text-8xl">Commande Personnalisée</h1>
            <p className="max-w-2xl text-sm font-light uppercase leading-relaxed tracking-[0.2em] text-accent-beige md:text-base">
              Vous avez une idée précise de bijou ? Envoyez-nous votre modèle et nos artisans créeront une pièce
              unique selon vos souhaits.
            </p>
            <div className="mt-6 h-px w-12 bg-primary" />
          </div>
        </div>
        <div className="pointer-events-none absolute inset-0 opacity-10">
          <div
            className="h-full w-full bg-cover bg-center"
            style={{
              backgroundImage:
                "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAPwS7jO8A1t0pR7RdBRWLxuk5M-uQ2Pr5sW8bsJJcNxvG1WjyJVuf3Pw62lMnrvRlnI0OSSnOOmqkHjofPmZwy84ILuzFh3Bf9LPjbHlxKpPFJ44lZUsEi3Z5RqcFfOdBR0weUDXezHrCdJj5e0v_2LgVafALx3D7vMyIqOlMTAsp2URper5YYhweiF-d3AaD4a4RiPWcQEE1wIiivezdK0m1vlJ4uekuDFJ4ueIfuJdbF8j_roqacvNCt57ff2oW2UHxk6dcx6Hla')",
            }}
          />
        </div>
      </section>

      <section className="py-12 bg-paper-pattern">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="bg-card rounded-lg p-6 md:p-8 shadow-card">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Image Upload */}
              <div>
                <Label className="font-body text-lg">Image du modèle souhaité</Label>
                <p className="font-body text-sm text-muted-foreground mb-4">
                  Téléchargez une photo du bijou que vous souhaitez faire fabriquer
                </p>
                
                <div className="relative">
                  <input type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                  
                  {imagePreview ? <div className="relative aspect-video rounded-lg overflow-hidden bg-cream">
                      <img src={imagePreview} alt="Aperçu" className="w-full h-full object-contain" />
                      <button type="button" onClick={() => setImagePreview(null)} className="absolute top-2 right-2 px-3 py-1 bg-destructive text-destructive-foreground rounded-lg font-body text-sm">
                        Supprimer
                      </button>
                    </div> : <div className="border-2 border-dashed border-border rounded-lg p-12 text-center hover:border-primary transition-colors">
                      <Upload className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                      <p className="font-body text-muted-foreground">
                        Cliquez ou glissez votre image ici
                      </p>
                      <p className="font-body text-xs text-muted-foreground mt-2">
                        JPG, PNG ou WEBP (max 5MB)
                      </p>
                    </div>}
                </div>
              </div>

              {/* Details */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="type" className="font-body">
                    Type de bijou *
                  </Label>
                  <Select value={formData.type} onValueChange={value => handleSelectChange('type', value)}>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Sélectionner le type" />
                    </SelectTrigger>
                    <SelectContent>
                      {productTypes.map((pt) => (
                        <SelectItem key={pt.id} value={pt.code.toLowerCase()}>
                          {pt.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="style" className="font-body">
                    Style *
                  </Label>
                  <Select value={formData.style} onValueChange={value => handleSelectChange('style', value)}>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Sélectionner le style" />
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

                <div>
                  <Label htmlFor="weight" className="font-body">
                    Poids souhaité (grammes)
                  </Label>
                  <Input id="weight" name="weight" type="number" value={formData.weight} onChange={handleInputChange} placeholder="Ex: 25" className="mt-2" />
                </div>
              </div>

              {/* Description */}
              <div>
                <Label htmlFor="description" className="font-body">
                  Description détaillée
                </Label>
                <Textarea id="description" name="description" value={formData.description} onChange={handleInputChange} placeholder="Décrivez votre bijou idéal: matériaux, pierres, finitions, dimensions..." rows={4} className="mt-2" />
              </div>

              {/* Contact Info */}
              <div className="border-t border-border pt-8">
                <h3 className="font-display text-xl mb-6">Vos coordonnées</h3>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="fullName" className="font-body">
                      Nom complet *
                    </Label>
                    <Input id="fullName" name="fullName" value={formData.fullName} onChange={handleInputChange} placeholder="Votre nom et prénom" className="mt-2" required />
                  </div>

                  <div>
                    <Label htmlFor="phone" className="font-body">
                      Téléphone *
                    </Label>
                    <Input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleInputChange} placeholder="06 XX XX XX XX" className="mt-2" required />
                  </div>

                  <div>
                    <Label htmlFor="address" className="font-body">
                      Adresse *
                    </Label>
                    <Input id="address" name="address" value={formData.address} onChange={handleInputChange} placeholder="Votre adresse complète" className="mt-2" required />
                  </div>

                  <div>
                    <Label htmlFor="city" className="font-body">
                      Ville *
                    </Label>
                    <Input id="city" name="city" value={formData.city} onChange={handleInputChange} placeholder="Ex: Casablanca" className="mt-2" required />
                  </div>

                  <div className="md:col-span-2">
                    <Label htmlFor="email" className="font-body">
                      Email
                    </Label>
                    <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} placeholder="votre@email.com" className="mt-2" />
                  </div>
                </div>
              </div>

              <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-body uppercase tracking-wider py-6" size="lg" disabled={isSubmitting}>
                {isSubmitting ? 'Envoi en cours...' : <>
                    <Send className="w-5 h-5 mr-2" />
                    Envoyer ma demande
                  </>}
              </Button>
            </form>
          </div>

          {/* Info cards */}
          <div className="grid md:grid-cols-3 gap-6 mt-12">
            {[{
            step: '1',
            title: 'Envoyez votre idée',
            desc: 'Image ou description de votre bijou'
          }, {
            step: '2',
            title: 'Devis personnalisé',
            desc: 'Nous vous contactons sous 48h'
          }, {
            step: '3',
            title: 'Fabrication',
            desc: 'Création artisanale de votre bijou'
          }].map(item => <div key={item.step} className="text-center p-6 bg-cream rounded-lg">
                <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground font-display text-lg flex items-center justify-center mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="font-display text-lg mb-2">{item.title}</h3>
                <p className="font-body text-sm text-muted-foreground">{item.desc}</p>
              </div>)}
          </div>
        </div>
      </section>
    </Layout>;
};
export default CustomOrder;