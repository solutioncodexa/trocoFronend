import { useState, useRef, useMemo } from 'react';
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
import { useStoreAppearance } from '@/hooks/useStoreAppearance';
import { appearanceButtonClass, formsPanelClass } from '@/config/storeAppearance';
import { cn } from '@/lib/utils';
import { useLocale } from '@/contexts/LocaleContext';
import type { MessageKey } from '@/i18n/messages';

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
  typePrefix: string;
};

type TFn = (key: MessageKey, vars?: Record<string, string | number>) => string;

function buildConfig(variant: PackagingRequestVariant, t: TFn): VariantConfig {
  if (variant === 'sur-mesure') {
    return {
      title: t('smTitle'),
      eyebrow: t('smEyebrow'),
      subtitle: t('smSubtitle'),
      needTypes: [
        { value: 'personnalisation-logo', label: t('smNeedLogo') },
        { value: 'produit-unique', label: t('smNeedUnique') },
        { value: 'dimensions-specifiques', label: t('smNeedDims') },
        { value: 'autre-sur-mesure', label: t('smNeedOther') },
      ],
      needLabel: t('smNeedLabel'),
      descriptionPlaceholder: t('smDescPh'),
      uploadTitle: t('smUploadTitle'),
      uploadHint: t('smUploadHint'),
      tip: t('smTip'),
      submitLabel: t('smSubmit'),
      successMessage: t('smSuccess'),
      processEyebrow: t('smProcessEyebrow'),
      processSteps: [
        { n: 1, title: t('smStep1Title'), desc: t('smStep1Desc') },
        { n: 2, title: t('smStep2Title'), desc: t('smStep2Desc') },
        { n: 3, title: t('smStep3Title'), desc: t('smStep3Desc') },
      ],
      altLink: { to: '/devis', label: t('smAltLink') },
      defaultDescription: t('smDefaultDesc'),
      typePrefix: 'sur-mesure',
    };
  }
  return {
    title: t('dvTitle'),
    eyebrow: t('dvEyebrow'),
    subtitle: t('dvSubtitle'),
    needTypes: [
      { value: 'commande-gros', label: t('dvNeedBulk') },
      { value: 'renouvellement-stock', label: t('dvNeedRestock') },
      { value: 'devis-multi-produits', label: t('dvNeedMulti') },
      { value: 'autre-devis', label: t('dvNeedOther') },
    ],
    needLabel: t('dvNeedLabel'),
    descriptionPlaceholder: t('dvDescPh'),
    uploadTitle: t('dvUploadTitle'),
    uploadHint: t('dvUploadHint'),
    tip: t('dvTip'),
    submitLabel: t('dvSubmit'),
    successMessage: t('dvSuccess'),
    processEyebrow: t('dvProcessEyebrow'),
    processSteps: [
      { n: 1, title: t('dvStep1Title'), desc: t('dvStep1Desc') },
      { n: 2, title: t('dvStep2Title'), desc: t('dvStep2Desc') },
      { n: 3, title: t('dvStep3Title'), desc: t('dvStep3Desc') },
    ],
    altLink: { to: '/sur-mesure', label: t('dvAltLink') },
    defaultDescription: t('dvDefaultDesc'),
    typePrefix: 'devis',
  };
}

interface PackagingRequestFormProps {
  variant: PackagingRequestVariant;
  /** Sans Layout (aperçu Apparence admin). */
  embed?: boolean;
}

export default function PackagingRequestForm({ variant, embed = false }: PackagingRequestFormProps) {
  const { t } = useLocale();
  const cfg = useMemo(() => buildConfig(variant, t), [variant, t]);
  const appearance = useStoreAppearance();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoriesApi.getNavCategories(),
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
        toast.error(t('fileTooBig', { file: file.name }));
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
      toast.success(t('requestSent'));
    },
    onError: (err: Error) => toastError(err, t('sendFailed')),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.fullName?.trim()) {
      toast.error(t('fieldRequired', { field: t('fullName') }));
      return;
    }
    if (!formData.phone?.trim()) {
      toast.error(t('fieldRequired', { field: t('phone') }));
      return;
    }
    if (!formData.address?.trim()) {
      toast.error(t('fieldRequired', { field: t('address') }));
      return;
    }
    if (!formData.city?.trim()) {
      toast.error(t('fieldRequired', { field: t('city') }));
      return;
    }
    if (!formData.type) {
      toast.error(t('fieldRequired', { field: t('needTypeRequired') }));
      return;
    }
    if (!formData.style) {
      toast.error(t('fieldRequired', { field: t('category') }));
      return;
    }

    const dimLine = formData.dimensions.trim()
      ? `${t('dimensionsFormat')} : ${formData.dimensions.trim()}. `
      : '';
    const qtyLine = formData.quantity.trim()
      ? `${t('estimatedQty')} : ${formData.quantity.trim()}. `
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
    const successBody = (
        <section className="py-24 bg-paper-pattern">
          <div className="max-w-lg mx-auto px-6 text-center">
            <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <Check className="w-10 h-10 text-primary" />
            </div>
            <h1 className="font-display text-4xl md:text-5xl text-foreground mb-4">{t('requestSent')}</h1>
            <p className="text-muted-foreground mb-8">
              {t('thanksContact', { name: formData.fullName, detail: cfg.successMessage })}
            </p>
            <Button onClick={resetForm} variant="outline" className="font-body">
              {t('newRequest')}
            </Button>
          </div>
        </section>
    );
    if (embed) return successBody;
    return <Layout>{successBody}</Layout>;
  }

  const body = (
    <>
      {appearance.formsShowHero ? (
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
      ) : null}

      <section className="py-20 bg-background border-y border-border">
        <div
          className={cn(
            'max-w-[1280px] mx-auto px-6 gap-20',
            appearance.formsLayout === 'split'
              ? 'grid grid-cols-1 lg:grid-cols-2'
              : 'flex flex-col',
            appearance.formsLayout === 'centered' && 'max-w-2xl',
          )}
        >
          <div
            className={cn(
              appearance.formsLayout === 'split' && 'order-2 lg:order-1',
              appearance.formsLayout === 'stacked' && 'order-2',
              formsPanelClass(appearance.formsStyle),
              appearance.formsStyle !== 'flat' && 'rounded-2xl p-6 sm:p-8',
            )}
          >
            <h2 className="font-display text-3xl mb-8">{t('projectDetails')}</h2>
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
                      <SelectValue placeholder={t('select')} />
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
                    {t('category')} *
                  </Label>
                  <Select
                    value={formData.style || undefined}
                    onValueChange={(value) => handleInputChange('style', value)}
                  >
                    <SelectTrigger className="h-10 w-full rounded-xl">
                      <SelectValue placeholder={t('select')} />
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
                    {t('dimensionsFormat')}
                  </Label>
                  <Input
                    placeholder={t('phDimensions')}
                    value={formData.dimensions}
                    onChange={(e) => handleInputChange('dimensions', e.target.value)}
                  />
                </div>
                <div>
                  <Label className="block text-xs uppercase tracking-widest text-muted-foreground mb-3 font-semibold">
                    {t('estimatedQty')}
                  </Label>
                  <Input
                    type="number"
                    min={1}
                    placeholder={t('phQuantity')}
                    value={formData.quantity}
                    onChange={(e) => handleInputChange('quantity', e.target.value)}
                  />
                </div>
              </div>

              <div>
                <Label className="block text-xs uppercase tracking-widest text-muted-foreground mb-3 font-semibold">
                  {t('description')}
                </Label>
                <Textarea
                  placeholder={cfg.descriptionPlaceholder}
                  rows={5}
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                />
              </div>

              <div className="space-y-6 border-t border-border pt-8">
                <h3 className="font-display text-xl text-foreground">{t('yourDetails')} *</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2 font-semibold">
                      {t('fullName')} *
                    </Label>
                    <Input
                      value={formData.fullName}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                      placeholder={t('phFullNameForm')}
                      required
                    />
                  </div>
                  <div>
                    <Label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2 font-semibold">
                      {t('phone')} *
                    </Label>
                    <Input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder={t('phPhone')}
                      required
                    />
                  </div>
                  <div>
                    <Label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2 font-semibold">
                      {t('address')} *
                    </Label>
                    <Input
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      placeholder={t('phAddress')}
                      required
                    />
                  </div>
                  <div>
                    <Label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2 font-semibold">
                      {t('city')} *
                    </Label>
                    <Input
                      value={formData.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      placeholder={t('phCity')}
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2 font-semibold">
                      {t('emailAddress')}
                    </Label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder={t('phBusinessEmail')}
                    />
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                disabled={createMutation.isPending}
                size="lg"
                className={cn(
                  appearanceButtonClass(
                    appearance.buttonStyle,
                    'w-full h-12 uppercase tracking-widest font-semibold',
                  ),
                )}
              >
                {createMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {t('sending')}
                  </>
                ) : (
                  appearance.formsCtaLabel || cfg.submitLabel
                )}
              </Button>
            </form>
          </div>

          <div
            className={cn(
              appearance.formsLayout === 'split' && 'order-1 lg:order-2',
              appearance.formsLayout === 'stacked' && 'order-1',
              appearance.formsLayout === 'centered' && 'mt-10',
              formsPanelClass(appearance.formsStyle),
              appearance.formsStyle !== 'flat' && 'rounded-2xl p-6 sm:p-8',
            )}
          >
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
                      <span className="text-xs">{t('add')}</span>
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
                    {t('browse')}
                  </Button>
                </div>
              )}
            </div>

            {appearance.formsShowSidebar ? (
            <div className="mt-12 p-8 border border-border bg-card rounded-2xl shadow-soft">
              <p className="text-sm font-semibold uppercase tracking-wide mb-2 text-foreground">{t('tipTitle')}</p>
              <p className="text-sm italic text-muted-foreground">{cfg.tip}</p>
            </div>
            ) : null}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-paper-pattern">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="flex flex-col items-center mb-16 text-center">
            <h3 className="font-display text-4xl md:text-5xl text-foreground mb-2">{t('processTitle')}</h3>
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
    </>
  );

  if (embed) return body;
  return <Layout>{body}</Layout>;
}
