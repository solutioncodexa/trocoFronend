import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Package, Plus, Pencil, Trash2, Search, Upload, X, ArrowLeft, ArrowRight, Star } from 'lucide-react';
import { createEmptyVariantRow, type ProductVariantFormRow } from '@/types/product-variant';
import { ProductVariantEditor } from '@/components/admin/ProductVariantEditor';
import AdminLayout from '@/components/admin/AdminLayout';
import AdminPagination from '@/components/admin/AdminPagination';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { Product } from '@/types/product';
import { categoriesApi } from '@/services/api/categories';
import { attributeTemplatesApi } from '@/services/api/attributeTemplates';
import { getImageUrl } from '@/services/api';
import { ProductFormData } from '@/services/api/products';
import { productsApi } from '@/services/api/products';
import { mapProductListItemListToProducts, mapProductDetailToProduct } from '@/utils/productMapper';
import { formatPrice } from '@/utils/formatPrice';
import { toast } from 'sonner';
import { toastError } from '@/utils/toastMessages';
import { staticCatalogQueryOptions } from '@/config/queryOptions';
import { cn } from '@/lib/utils';
import { compressImageWithReport } from '@/utils/compressImage';
import { notifyCompressionReports } from '@/utils/notifyCompression';
import { useAdmin } from '@/contexts/AdminContext';
import { PERMISSIONS } from '@/config/permissions';
import { EmptyState } from '@/components/ui/EmptyState';
import {
  ONBOARDING_PUBLICATION_PATH,
  ONBOARDING_PRODUCTS_PATH,
  ONBOARDING_RETURN_QUERY,
  writeOnboardingDraft,
  readOnboardingDraft,
} from '@/utils/onboardingSession';

type AdminFormData = {
  name: string;
  shortDescription: string;
  description: string;
  price: string;
  originalPrice: string;
  category: string;
  sku: string;
  stockQuantity: string;
  badges: string[];
  customizable: boolean;
};

const PLACEHOLDER_IMAGE = '/placeholder-modern-fixed.svg';

const AdminProducts = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const fromOnboarding = searchParams.get(ONBOARDING_RETURN_QUERY) === '1';
  const { hasPermission } = useAdmin();
  const canCreate = hasPermission(PERMISSIONS.PRODUCTS_CREATE);
  const canUpdate = hasPermission(PERMISSIONS.PRODUCTS_UPDATE);
  const canDelete = hasPermission(PERMISSIONS.PRODUCTS_DELETE);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(12);
  const [debouncedSearch, setDebouncedSearch] = useState('');

  const handlePageSizeChange = useCallback((size: number) => {
    setPageSize(size);
    setPage(0);
  }, []);

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoriesApi.getAllCategories(),
    ...staticCatalogQueryOptions,
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(0);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleFilterCategoryChange = useCallback((cat: string) => {
    setFilterCategory(cat);
    setPage(0);
  }, []);

  const { data: productsPage, isLoading, isFetching } = useQuery({
    queryKey: ['products', 'admin', page, pageSize, filterCategory, debouncedSearch],
    queryFn: () => productsApi.getAllProducts({
      page,
      size: pageSize,
      sortBy: 'createdAt',
      sortDir: 'DESC',
      category: filterCategory !== 'all' ? filterCategory : undefined,
      keyword: debouncedSearch || undefined,
    }),
    placeholderData: keepPreviousData,
  });
  const products = mapProductListItemListToProducts(productsPage?.content) ?? [];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoadingProduct, setIsLoadingProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<AdminFormData>({
    name: '',
    shortDescription: '',
    description: '',
    price: '',
    originalPrice: '',
    category: '',
    sku: '',
    stockQuantity: '100',
    badges: [],
    customizable: false,
  });
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [existingImageUrls, setExistingImageUrls] = useState<string[]>([]);
  const [variantRows, setVariantRows] = useState<ProductVariantFormRow[]>([createEmptyVariantRow(true)]);
  const [hasVariants, setHasVariants] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const newImagePreviewUrls = useMemo(
    () => imageFiles.map((file) => URL.createObjectURL(file)),
    [imageFiles],
  );

  useEffect(() => {
    return () => {
      newImagePreviewUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [newImagePreviewUrls]);

  const isPromo = formData.badges.includes('promo');

  const selectedCategoryId = useMemo(
    () => categories.find((c) => c.slug === formData.category)?.id ?? null,
    [categories, formData.category],
  );

  // Modèle d'attributs résolu (catégorie → fallback boutique) : pilote les axes de variantes.
  const { data: resolvedTemplate } = useQuery({
    queryKey: ['attribute-template', 'resolve', selectedCategoryId],
    queryFn: () => attributeTemplatesApi.resolve(selectedCategoryId),
    enabled: isModalOpen && hasVariants,
    ...staticCatalogQueryOptions,
  });
  const templateAxes = resolvedTemplate?.axes ?? [];

  useEffect(() => {
    if (!hasVariants) return;
    const defaultRow = variantRows.find((r) => r.isDefault) ?? variantRows[0];
    if (!defaultRow) return;
    setFormData((prev) => ({
      ...prev,
      price: defaultRow.price,
    }));
  }, [variantRows, hasVariants]);

  const getCategoryLabel = (slug: string) => {
    const cat = categories.find((c) => c.slug === slug);
    return cat?.name ?? slug;
  };

  const populateFormFromProduct = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      shortDescription: product.shortDescription ?? '',
      description: product.description,
      price: product.price.toString(),
      originalPrice: (product.originalPrice ?? '').toString(),
      category: product.category,
      sku: product.sku ?? '',
      stockQuantity: String(product.stockQuantity ?? 0),
      badges: product.badges,
      customizable: product.customizable === true,
    });

    // Une variante « réelle » porte un attribut (Woo mono/multi-axes). La variante
    // « Standard » synthétique (attributeValue vide) = produit simple.
    const realVariants = (product.variants ?? []).filter(
      (v) => (v.attributeValue && v.attributeValue.trim()) || (v.attributes && v.attributes.length > 0),
    );
    const productHasVariants = realVariants.length > 0;
    setHasVariants(productHasVariants);

    const rows: ProductVariantFormRow[] = (productHasVariants ? realVariants : []).map((v) => ({
      id: v.id,
      attributeName: v.attributeName ?? '',
      attributeValue: v.attributeValue ?? v.label ?? '',
      attrValues: (() => {
        const map: Record<string, string> = {};
        if (v.attributes && v.attributes.length > 0) {
          for (const a of v.attributes) {
            if (a?.name) map[a.name] = a.value;
          }
        } else if (v.attributeName && v.attributeValue) {
          map[v.attributeName] = v.attributeValue;
        }
        return map;
      })(),
      label: v.label ?? v.attributeValue ?? '',
      price: String(v.price),
      originalPrice: v.originalPrice != null ? String(v.originalPrice) : '',
      stock: v.stock != null ? String(v.stock) : String(product.stockQuantity ?? 0),
      safetyStock: v.safetyStock != null ? String(v.safetyStock) : '',
      sku: v.sku ?? '',
      isDefault: Boolean(v.isDefault),
    }));

    if (rows.length > 0) {
      setVariantRows(rows);
    } else {
      // Produit simple : on pré-remplit une ligne (utile si l'admin active les variantes ensuite).
      setVariantRows([
        {
          ...createEmptyVariantRow(true),
          price: String(product.price),
          originalPrice: product.originalPrice != null ? String(product.originalPrice) : '',
          stock: String(product.stockQuantity ?? 0),
          sku: product.sku ?? '',
        },
      ]);
    }

    setExistingImageUrls(product.images || []);
    setImageFiles([]);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      shortDescription: '',
      description: '',
      price: '',
      originalPrice: '',
      category: categories[0]?.slug ?? '',
      sku: '',
      stockQuantity: '100',
      badges: [],
      customizable: false,
    });
    setVariantRows([createEmptyVariantRow(true)]);
    setHasVariants(false);
    setExistingImageUrls([]);
    setImageFiles([]);
  };

  const handleOpenModal = async (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setIsModalOpen(true);
      setIsLoadingProduct(true);
      try {
        const fullProduct = mapProductDetailToProduct(await productsApi.getProductById(product.id));
        populateFormFromProduct(fullProduct);
      } catch (err) {
        toastError(err, 'Impossible de charger le produit');
        setIsModalOpen(false);
        setEditingProduct(null);
      } finally {
        setIsLoadingProduct(false);
      }
      return;
    }

    setEditingProduct(null);
    resetForm();
    setIsModalOpen(true);
  };

  useEffect(() => {
    if (searchParams.get('action') !== 'new') return;
    if (canCreate) {
      void handleOpenModal();
    }
    const next = new URLSearchParams(searchParams);
    next.delete('action');
    // conserver fromOnboarding pour le retour après création
    setSearchParams(next, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const returnToOnboardingPublication = () => {
    const draft = readOnboardingDraft();
    writeOnboardingDraft({
      ...(draft ?? { step: 4 }),
      step: 4,
    });
    navigate(ONBOARDING_PUBLICATION_PATH, { replace: true });
  };

  const returnToOnboardingProducts = () => {
    const draft = readOnboardingDraft();
    writeOnboardingDraft({
      ...(draft ?? { step: 3 }),
      step: 3,
    });
    navigate(ONBOARDING_PRODUCTS_PATH, { replace: true });
  };

  const hasActiveFilters = Boolean(debouncedSearch.trim()) || filterCategory !== 'all';

  const clearProductFilters = () => {
    setSearchTerm('');
    setDebouncedSearch('');
    setFilterCategory('all');
    setPage(0);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
    setIsLoadingProduct(false);
    setImageFiles([]);
    setExistingImageUrls([]);
  };

  const createMutation = useMutation({
    mutationFn: ({ product, images }: { product: ProductFormData; images: File[] }) =>
      productsApi.createProduct(product, images),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Produit ajouté avec succès');
      handleCloseModal();
      if (fromOnboarding) {
        toast.message('Retour à l’assistant — étape Publication');
        returnToOnboardingPublication();
      }
    },
    onError: (err: Error) => toastError(err, 'Erreur lors de l\'ajout du produit'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, product, images }: { id: string; product: ProductFormData; images?: File[] }) =>
      productsApi.updateProduct(id, product, images),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Produit modifié avec succès');
      handleCloseModal();
    },
    onError: (err: Error) => toastError(err, 'Erreur lors de la modification'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => productsApi.deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Produit supprimé');
    },
    onError: (err: Error) => toastError(err, 'Erreur lors de la suppression'),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (imageFiles.length === 0 && existingImageUrls.length === 0) {
      toast.error('Veuillez ajouter au moins une image');
      return;
    }

    if (!formData.category) {
      toast.error('Veuillez sélectionner une catégorie');
      return;
    }

    const originalPriceNum = formData.originalPrice ? parseFloat(formData.originalPrice) : undefined;
    const parsedStock = parseInt(formData.stockQuantity, 10);
    const stockQuantity = Number.isNaN(parsedStock) ? 0 : parsedStock;

    let productPayload: ProductFormData;

    if (!hasVariants) {
      // Produit simple : un seul prix / stock. Le backend crée une variante « Standard ».
      const priceNum = parseFloat(formData.price);
      if (Number.isNaN(priceNum) || priceNum <= 0) {
        toast.error('Indiquez un prix valide');
        return;
      }
      productPayload = {
        name: formData.name,
        description: formData.description,
        shortDescription: formData.shortDescription.trim() || undefined,
        price: priceNum,
        originalPrice:
          isPromo && originalPriceNum && originalPriceNum > priceNum ? originalPriceNum : undefined,
        category: formData.category,
        sku: formData.sku.trim() || undefined,
        stockQuantity,
        badges: formData.badges,
        variants: [],
        customizable: formData.customizable,
      };
    } else {
      const parsedVariants = variantRows
        .map((row, index) => {
          const price = parseFloat(row.price);
          const originalPrice = row.originalPrice ? parseFloat(row.originalPrice) : undefined;
          const stock = row.stock ? parseInt(row.stock, 10) : undefined;
          const safetyStock = row.safetyStock.trim() !== '' ? parseInt(row.safetyStock, 10) : undefined;

          let attributes: { name: string; value: string }[] | undefined;
          let attributeName: string | undefined;
          let attributeValue: string;

          if (templateAxes.length > 0) {
            // Mode multi-axes : une valeur par axe du modèle.
            const pairs = templateAxes
              .map((ax) => ({ name: ax.name, value: (row.attrValues?.[ax.name] ?? '').trim() }))
              .filter((p) => p.value);
            attributes = pairs.length > 0 ? pairs : undefined;
            attributeName = pairs[0]?.name;
            attributeValue = pairs.map((p) => p.value).join(' · ');
          } else {
            attributeName = row.attributeName.trim() || undefined;
            attributeValue = row.attributeValue.trim();
          }

          return {
            id: row.id,
            attributeName,
            attributeValue,
            attributes,
            label: row.label.trim() || attributeValue || undefined,
            price,
            originalPrice: isPromo && originalPrice && originalPrice > price ? originalPrice : undefined,
            stock: Number.isNaN(stock) ? undefined : stock,
            safetyStock: safetyStock != null && !Number.isNaN(safetyStock) ? safetyStock : undefined,
            sku: row.sku.trim() || undefined,
            isDefault: row.isDefault,
            displayOrder: index,
          };
        })
        .filter((v) => v.attributeValue && !Number.isNaN(v.price) && v.price > 0);

      if (parsedVariants.length === 0) {
        toast.error('Ajoutez au moins une variante avec une valeur et un prix valides');
        return;
      }

      // Axes obligatoires du modèle : chaque variante doit les renseigner.
      const requiredAxes = templateAxes.filter((a) => a.required).map((a) => a.name);
      if (requiredAxes.length > 0) {
        const hasMissing = parsedVariants.some((v) => {
          const names = new Set((v.attributes ?? []).map((a) => a.name));
          return requiredAxes.some((r) => !names.has(r));
        });
        if (hasMissing) {
          toast.error('Renseignez tous les axes obligatoires sur chaque variante');
          return;
        }
      }

      const defaultVariant = parsedVariants.find((v) => v.isDefault) ?? parsedVariants[0];

      productPayload = {
        name: formData.name,
        description: formData.description,
        shortDescription: formData.shortDescription.trim() || undefined,
        price: defaultVariant.price,
        originalPrice:
          isPromo && originalPriceNum && originalPriceNum > defaultVariant.price
            ? originalPriceNum
            : defaultVariant.originalPrice,
        category: formData.category,
        sku: formData.sku.trim() || undefined,
        stockQuantity,
        badges: formData.badges,
        variants: parsedVariants,
        customizable: formData.customizable,
      };
    }

    if (editingProduct) {
      updateMutation.mutate({
        id: editingProduct.id,
        product: productPayload,
        images: imageFiles.length > 0 ? imageFiles : undefined,
      });
    } else {
      createMutation.mutate({ product: productPayload, images: imageFiles });
    }
  };

  const handleDelete = (productId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      deleteMutation.mutate(productId);
    }
  };

  const toggleBadge = (badge: string) => {
    setFormData((prev) => {
      const isAdding = !prev.badges.includes(badge);
      const newBadges = isAdding ? [...prev.badges, badge] : prev.badges.filter((b) => b !== badge);
      if (badge === 'promo' && isAdding && !prev.originalPrice) {
        return { ...prev, badges: newBadges, originalPrice: prev.price };
      }
      if (badge === 'promo' && !isAdding) {
        return { ...prev, badges: newBadges, originalPrice: '' };
      }
      return { ...prev, badges: newBadges };
    });
  };

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;
    const rawFiles = Array.from(files);
    e.target.value = '';

    const toastId = toast.loading(
      rawFiles.length === 1 ? 'Optimisation de l\'image…' : `Optimisation de ${rawFiles.length} images…`,
    );

    try {
      const results = await Promise.all(rawFiles.map((f) => compressImageWithReport(f)));
      const optimized = results.map((r) => r.file);
      setImageFiles((prev) => [...prev, ...optimized]);
      notifyCompressionReports(results.map((r) => r.report));
    } catch {
      toast.error('Erreur lors de l\'optimisation des images');
    } finally {
      toast.dismiss(toastId);
    }
  };

  const removeImageFile = (index: number) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (index: number) => {
    setExistingImageUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const moveExistingImage = (from: number, to: number) => {
    setExistingImageUrls((prev) => {
      const arr = [...prev];
      const [item] = arr.splice(from, 1);
      arr.splice(to, 0, item);
      return arr;
    });
  };

  const moveNewImage = (from: number, to: number) => {
    setImageFiles((prev) => {
      const arr = [...prev];
      const [item] = arr.splice(from, 1);
      arr.splice(to, 0, item);
      return arr;
    });
  };

  const setAsPrimary = (type: 'existing' | 'new', index: number) => {
    if (type === 'existing') {
      setExistingImageUrls((prev) => {
        const arr = [...prev];
        const [item] = arr.splice(index, 1);
        arr.unshift(item);
        return arr;
      });
    } else {
      if (existingImageUrls.length > 0) {
        toast.info('Les images existantes sont affichées en premier. Supprimez-les ou réordonnez-les.');
        return;
      }
      setImageFiles((prev) => {
        const arr = [...prev];
        const [item] = arr.splice(index, 1);
        arr.unshift(item);
        return arr;
      });
    }
  };

  if (isLoading && !productsPage) {
    return (
      <AdminLayout title="Gestion des Produits" breadcrumbs={[{ label: 'Produits' }]}>
        <div className="p-8 text-center text-muted-foreground">Chargement...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Gestion des Produits" breadcrumbs={[{ label: 'Produits' }]}>
      {fromOnboarding ? (
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-primary/30 bg-primary/5 px-4 py-3">
          <p className="text-sm text-foreground">
            Assistant de configuration — ajoutez un produit, puis vous reviendrez à l’étape{' '}
            <strong>Publication</strong>.
          </p>
          <Button type="button" variant="outline" size="sm" onClick={returnToOnboardingProducts}>
            Retour à l’assistant
          </Button>
        </div>
      ) : null}
      <p className="text-xs sm:text-sm text-muted-foreground mb-3 flex flex-wrap items-center gap-x-1.5 gap-y-1">
        <span className="font-medium text-foreground">{productsPage?.totalElements ?? 0}</span>
        produit{(productsPage?.totalElements ?? 0) > 1 ? 's' : ''}
        {filterCategory !== 'all' && (
          <>· filtre <Badge variant="secondary" className="text-[10px] px-1.5 py-0">{getCategoryLabel(filterCategory)}</Badge></>
        )}
        {debouncedSearch && (
          <>· &quot;{debouncedSearch}&quot;</>
        )}
        {isFetching && <span className="text-[10px]">(mise à jour…)</span>}
      </p>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Rechercher un produit..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={filterCategory} onValueChange={handleFilterCategoryChange}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Catégorie" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes les catégories</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.slug}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {canCreate && (
          <Button onClick={() => handleOpenModal()} className="font-body">
            <Plus className="w-4 h-4 mr-2" />
            Ajouter
          </Button>
        )}
      </div>

      <div className="block lg:hidden space-y-3">
        {products.map((product) => (
          <div key={product.id} className="bg-card rounded-lg border border-border p-3 sm:p-4">
            <div className="flex items-start gap-3">
              <img
                src={product.images?.[0] ? getImageUrl(product.images[0]) : PLACEHOLDER_IMAGE}
                alt={product.name}
                className="w-14 h-14 rounded-lg object-cover shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p className="font-body font-medium text-sm truncate">{product.name}</p>
                <p className="font-body text-xs text-muted-foreground">
                  {getCategoryLabel(product.category)}
                  {product.sku ? ` · ${product.sku}` : ''}
                </p>
                <div className="flex flex-wrap items-center gap-1 mt-1">
                  {!product.inStock ? (
                    <Badge variant="destructive" className="text-[10px]">Rupture</Badge>
                  ) : (
                    <Badge variant="outline" className="text-[10px] text-green-600 border-green-600">
                      Stock {product.stockQuantity}
                    </Badge>
                  )}
                  {product.badges.map((badge) => (
                    <Badge key={badge} variant={badge === 'promo' ? 'destructive' : 'outline'} className="text-[10px]">
                      {badge === 'new' ? 'Nouveau' : badge === 'bestseller' ? 'Best-seller' : 'Promo'}
                    </Badge>
                  ))}
                  {product.customizable && (
                    <Badge variant="outline" className="text-[10px] border-primary/40 text-primary">
                      Logo
                    </Badge>
                  )}
                </div>
              </div>
              <div className="text-right shrink-0">
                <span className={cn('font-body text-sm', product.originalPrice && product.originalPrice > product.price ? 'text-green-600 font-medium' : '')}>
                  {formatPrice(product.price)}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <div className="text-[10px] text-muted-foreground line-through">
                    {formatPrice(product.originalPrice)}
                  </div>
                )}
              </div>
            </div>
            <div className="flex gap-2 mt-3">
              {canUpdate && (
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 h-8 text-xs"
                  onClick={() => handleOpenModal(product)}
                >
                  <Pencil className="w-3.5 h-3.5 mr-1" />
                  Modifier
                </Button>
              )}
              {canDelete && (
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 p-0 text-destructive hover:bg-destructive hover:text-destructive-foreground"
                  onClick={() => handleDelete(product.id)}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              )}
            </div>
          </div>
        ))}
        {products.length === 0 && (
          <EmptyState
            icon={Package}
            title={hasActiveFilters ? 'Aucun produit ne correspond' : 'Aucun produit pour le moment'}
            description={
              hasActiveFilters
                ? 'Modifiez la recherche ou la catégorie.'
                : 'Ajoutez votre premier produit pour démarrer la boutique.'
            }
            actionLabel={
              hasActiveFilters ? 'Réinitialiser les filtres' : canCreate ? 'Ajouter un produit' : undefined
            }
            onAction={
              hasActiveFilters
                ? clearProductFilters
                : canCreate
                  ? () => void handleOpenModal()
                  : undefined
            }
            className="my-4 border border-border bg-card"
          />
        )}
      </div>

      <div className="hidden lg:block bg-card rounded-lg border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-left font-body text-sm font-medium text-muted-foreground">Produit</th>
                <th className="px-4 py-3 text-left font-body text-sm font-medium text-muted-foreground">Catégorie</th>
                <th className="px-4 py-3 text-left font-body text-sm font-medium text-muted-foreground">Stock</th>
                <th className="px-4 py-3 text-left font-body text-sm font-medium text-muted-foreground">Prix</th>
                <th className="px-4 py-3 text-left font-body text-sm font-medium text-muted-foreground">Badges</th>
                <th className="px-4 py-3 text-right font-body text-sm font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-muted/30">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={product.images?.[0] ? getImageUrl(product.images[0]) : PLACEHOLDER_IMAGE}
                        alt={product.name}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div>
                        <p className="font-body font-medium">{product.name}</p>
                        {product.sku && (
                          <p className="font-body text-xs text-muted-foreground">SKU {product.sku}</p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant="secondary">{getCategoryLabel(product.category)}</Badge>
                  </td>
                  <td className="px-4 py-3">
                    {product.inStock ? (
                      <Badge variant="outline" className="text-green-600 border-green-600 text-xs">
                        En stock ({product.stockQuantity})
                      </Badge>
                    ) : (
                      <Badge variant="destructive" className="text-xs">Rupture</Badge>
                    )}
                  </td>
                  <td className="px-4 py-3 font-body">
                    <div>
                      <span className={product.originalPrice && product.originalPrice > product.price ? 'text-green-600 font-medium' : ''}>
                        {formatPrice(product.price)}
                      </span>
                      {product.originalPrice && product.originalPrice > product.price && (
                        <div className="text-xs text-muted-foreground line-through">
                          {formatPrice(product.originalPrice)}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {product.badges.map((badge) => (
                        <Badge key={badge} variant={badge === 'promo' ? 'destructive' : 'outline'} className="text-xs">
                          {badge === 'new' ? 'Nouveau' : badge === 'bestseller' ? 'Best-seller' : 'Promo'}
                        </Badge>
                      ))}
                      {product.customizable && (
                        <Badge variant="outline" className="text-xs border-primary/40 text-primary">
                          Logo
                        </Badge>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      {canUpdate && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleOpenModal(product)}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                      )}
                      {canDelete && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                          onClick={() => handleDelete(product.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {products.length === 0 && (
          <EmptyState
            icon={Package}
            title={hasActiveFilters ? 'Aucun produit ne correspond' : 'Catalogue vide'}
            description={
              hasActiveFilters
                ? 'Modifiez la recherche ou la catégorie.'
                : 'Créez un produit pour le voir apparaître ici et sur votre boutique.'
            }
            actionLabel={
              hasActiveFilters ? 'Réinitialiser les filtres' : canCreate ? 'Ajouter un produit' : undefined
            }
            onAction={
              hasActiveFilters
                ? clearProductFilters
                : canCreate
                  ? () => void handleOpenModal()
                  : undefined
            }
            className="my-6 border-0"
          />
        )}
      </div>

      {productsPage && productsPage.totalElements > 0 && (
        <AdminPagination
          page={page}
          totalPages={productsPage.totalPages}
          totalElements={productsPage.totalElements}
          size={pageSize}
          onPageChange={setPage}
          onSizeChange={handlePageSizeChange}
          pageSizeOptions={[12, 20, 50]}
        />
      )}

      <Dialog
        open={isModalOpen}
        onOpenChange={(open) => {
          if (!open) handleCloseModal();
        }}
      >
        <DialogContent
          className="!flex h-[min(92vh,880px)] w-[calc(100%-1.5rem)] max-w-3xl flex-col gap-0 overflow-hidden bg-card p-0 text-foreground sm:rounded-2xl"
          onPointerDownOutside={(e) => e.preventDefault()}
          onInteractOutside={(e) => e.preventDefault()}
          onFocusOutside={(e) => e.preventDefault()}
        >
          <DialogHeader className="shrink-0 space-y-1 border-b border-border bg-card px-5 py-4 text-left sm:px-6">
            <DialogTitle className="font-display text-xl text-foreground">
              {editingProduct ? 'Modifier le produit' : 'Nouveau produit'}
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              Renseignez les infos, les variantes de prix, puis les images. Activez la personnalisation
              pour permettre l&apos;upload de logo sur la boutique.
            </DialogDescription>
          </DialogHeader>

          {isLoadingProduct ? (
            <div className="flex-1 px-6 py-12 text-center text-muted-foreground">
              Chargement du produit…
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col bg-card">
              <div className="min-h-0 flex-1 space-y-6 overflow-y-auto overscroll-contain px-5 py-5 sm:px-6">
                <section className="space-y-4">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Informations
                  </h3>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="sm:col-span-2 md:col-span-1">
                      <Label htmlFor="name">Nom du produit *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                        required
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="sku">SKU</Label>
                      <Input
                        id="sku"
                        value={formData.sku}
                        onChange={(e) => setFormData((prev) => ({ ...prev, sku: e.target.value }))}
                        className="mt-1"
                        placeholder="Référence produit"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <Label htmlFor="shortDescription">Description courte</Label>
                      <Input
                        id="shortDescription"
                        value={formData.shortDescription}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, shortDescription: e.target.value }))
                        }
                        className="mt-1"
                        placeholder="Résumé affiché sur les cartes produit"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <Label htmlFor="description">Description *</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, description: e.target.value }))
                        }
                        required
                        rows={3}
                        className="mt-1"
                      />
                    </div>
                  </div>
                </section>

                <section>
                  <div
                    className={cn(
                      'flex items-start justify-between gap-4 rounded-2xl border p-4 transition-colors',
                      formData.customizable
                        ? 'border-primary/40 bg-primary/5'
                        : 'border-border bg-muted/20',
                    )}
                  >
                    <div className="min-w-0 space-y-1">
                      <Label htmlFor="customizable" className="text-sm font-semibold cursor-pointer">
                        Produit personnalisable (logo client)
                      </Label>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Si activé, la fiche boutique affiche un champ pour téléverser un logo (comme
                        sur les emballages personnalisés). Le logo est joint au panier et à la
                        commande.
                      </p>
                    </div>
                    <Switch
                      id="customizable"
                      checked={formData.customizable}
                      onCheckedChange={(checked) =>
                        setFormData((prev) => ({ ...prev, customizable: checked }))
                      }
                      className="mt-0.5 shrink-0"
                    />
                  </div>
                </section>

                <section className="space-y-3">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Prix &amp; variantes
                  </h3>

                  <div
                    className={cn(
                      'flex items-start justify-between gap-4 rounded-2xl border p-4 transition-colors',
                      hasVariants ? 'border-primary/40 bg-primary/5' : 'border-border bg-muted/20',
                    )}
                  >
                    <div className="min-w-0 space-y-1">
                      <Label htmlFor="hasVariants" className="text-sm font-semibold cursor-pointer">
                        Ce produit a des variantes
                      </Label>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Activez si le produit se décline en plusieurs options (taille, matière,
                        capacité…). Sinon, un seul prix et un stock suffisent.
                      </p>
                    </div>
                    <Switch
                      id="hasVariants"
                      checked={hasVariants}
                      onCheckedChange={(checked) => {
                        setHasVariants(checked);
                        if (checked) {
                          // Passage aux variantes : injecter le prix simple dans la 1ère ligne.
                          setVariantRows((rows) => {
                            const base = rows.length ? rows : [createEmptyVariantRow(true)];
                            return base.map((r, i) =>
                              i === 0 ? { ...r, price: r.price || formData.price } : r,
                            );
                          });
                        } else {
                          // Retour au produit simple : récupérer le prix de la variante par défaut.
                          const def = variantRows.find((r) => r.isDefault) ?? variantRows[0];
                          if (def) {
                            setFormData((prev) => ({
                              ...prev,
                              price: def.price || prev.price,
                              originalPrice: def.originalPrice || prev.originalPrice,
                            }));
                          }
                        }
                      }}
                      className="mt-0.5 shrink-0"
                    />
                  </div>

                  {hasVariants ? (
                    <ProductVariantEditor
                      rows={variantRows}
                      onChange={setVariantRows}
                      isPromo={isPromo}
                      axes={templateAxes}
                    />
                  ) : (
                    <div className="grid gap-3 rounded-2xl border border-border bg-muted/20 p-4 sm:grid-cols-2 sm:p-5">
                      <div>
                        <Label htmlFor="simplePrice" className="text-xs">
                          {isPromo ? 'Prix promo (DH) *' : 'Prix (DH) *'}
                        </Label>
                        <Input
                          id="simplePrice"
                          type="number"
                          min={0.01}
                          step={0.01}
                          value={formData.price}
                          onChange={(e) =>
                            setFormData((prev) => ({ ...prev, price: e.target.value }))
                          }
                          className="mt-1"
                          required
                        />
                      </div>
                      {isPromo && (
                        <div>
                          <Label htmlFor="simpleOriginalPrice" className="text-xs">
                            Prix barré (DH)
                          </Label>
                          <Input
                            id="simpleOriginalPrice"
                            type="number"
                            min={0}
                            step={0.01}
                            value={formData.originalPrice}
                            onChange={(e) =>
                              setFormData((prev) => ({ ...prev, originalPrice: e.target.value }))
                            }
                            className="mt-1"
                          />
                        </div>
                      )}
                    </div>
                  )}
                </section>

                <section className="space-y-4">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Catalogue
                  </h3>
                  <div className="grid items-start gap-4 sm:grid-cols-2">
                    <div>
                      <Label>Catégorie *</Label>
                      <Select
                        value={formData.category || undefined}
                        onValueChange={(value: string) =>
                          setFormData((prev) => ({ ...prev, category: value }))
                        }
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Choisir une catégorie" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.length === 0 ? (
                            <SelectItem value="__none" disabled>
                              Aucune catégorie — créez-en une
                            </SelectItem>
                          ) : (
                            categories.map((cat) => (
                              <SelectItem key={cat.id} value={cat.slug}>
                                {cat.name}
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                      <Link
                        to="/admin/categories?action=new"
                        className="mt-1.5 inline-block text-xs text-primary hover:underline"
                      >
                        + Créer une catégorie
                      </Link>
                    </div>
                    <div>
                      <Label htmlFor="stockQuantity">
                        {hasVariants ? 'Stock global (fallback)' : 'Stock'}
                      </Label>
                      <Input
                        id="stockQuantity"
                        type="number"
                        min={0}
                        step={1}
                        value={formData.stockQuantity}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, stockQuantity: e.target.value }))
                        }
                        className="mt-1"
                        placeholder={
                          hasVariants ? 'Utilisé si une variante n’a pas de stock' : 'Quantité en stock'
                        }
                      />
                      {parseInt(formData.stockQuantity, 10) === 0 && (
                        <p className="mt-1 text-xs text-destructive">
                          Ce produit pourra s&apos;afficher en rupture de stock
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label>Badges</Label>
                    <p className="mb-2 mt-1 text-xs text-muted-foreground">
                      Affichés sur la fiche produit
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        type="button"
                        variant={formData.badges.includes('new') ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => toggleBadge('new')}
                      >
                        Nouveau
                      </Button>
                      <Button
                        type="button"
                        variant={formData.badges.includes('bestseller') ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => toggleBadge('bestseller')}
                      >
                        Best-seller
                      </Button>
                      <Button
                        type="button"
                        variant={formData.badges.includes('promo') ? 'destructive' : 'outline'}
                        size="sm"
                        onClick={() => toggleBadge('promo')}
                      >
                        Promo
                      </Button>
                    </div>
                  </div>
                </section>

                <section className="space-y-3">
                  <div>
                    <Label>Images du produit *</Label>
                    <p className="mt-1 text-xs text-muted-foreground">
                      La première image est l&apos;image principale. Survolez pour réordonner ou
                      définir la principale.
                    </p>
                  </div>
                  <div className="space-y-3">
                    {existingImageUrls.length > 0 && (
                      <div>
                        <p className="mb-1.5 text-xs font-medium text-muted-foreground">
                          Images actuelles
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {existingImageUrls.map((url, index) => (
                            <div
                              key={`existing-${index}`}
                              className={cn(
                                'group relative overflow-hidden rounded-xl',
                                index === 0 && imageFiles.length === 0 && 'ring-2 ring-primary',
                              )}
                            >
                              <img
                                src={getImageUrl(url)}
                                alt={`Image ${index + 1}`}
                                className="h-20 w-20 object-cover"
                              />
                              {index === 0 && imageFiles.length === 0 && (
                                <div className="absolute left-0.5 top-0.5 rounded bg-primary px-1 py-0.5 text-[8px] font-bold text-white">
                                  1ère
                                </div>
                              )}
                              <div className="absolute inset-0 flex items-center justify-center gap-1 bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                                {index > 0 && (
                                  <button
                                    type="button"
                                    onClick={() => moveExistingImage(index, index - 1)}
                                    className="flex h-5 w-5 items-center justify-center rounded bg-white/90"
                                  >
                                    <ArrowLeft className="h-3 w-3 text-black" />
                                  </button>
                                )}
                                {index > 0 && (
                                  <button
                                    type="button"
                                    onClick={() => setAsPrimary('existing', index)}
                                    className="flex h-5 w-5 items-center justify-center rounded bg-primary"
                                    title="Définir comme principale"
                                  >
                                    <Star className="h-3 w-3 text-white" />
                                  </button>
                                )}
                                {index < existingImageUrls.length - 1 && (
                                  <button
                                    type="button"
                                    onClick={() => moveExistingImage(index, index + 1)}
                                    className="flex h-5 w-5 items-center justify-center rounded bg-white/90"
                                  >
                                    <ArrowRight className="h-3 w-3 text-black" />
                                  </button>
                                )}
                                <button
                                  type="button"
                                  onClick={() => removeExistingImage(index)}
                                  className="flex h-5 w-5 items-center justify-center rounded bg-destructive"
                                >
                                  <X className="h-3 w-3 text-white" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {imageFiles.length > 0 && (
                      <div>
                        <p className="mb-1.5 text-xs font-medium text-muted-foreground">
                          Nouvelles images à envoyer
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {imageFiles.map((file, index) => (
                            <div
                              key={`${file.name}-${file.size}-${file.lastModified}-${index}`}
                              className={cn(
                                'group relative overflow-hidden rounded-xl border-2 border-primary/40',
                                index === 0 &&
                                  existingImageUrls.length === 0 &&
                                  'ring-2 ring-primary',
                              )}
                            >
                              <img
                                src={newImagePreviewUrls[index]}
                                alt={`Nouvelle ${index + 1}`}
                                className="h-20 w-20 object-cover"
                              />
                              {index === 0 && existingImageUrls.length === 0 && (
                                <div className="absolute left-0.5 top-0.5 rounded bg-primary px-1 py-0.5 text-[8px] font-bold text-white">
                                  1ère
                                </div>
                              )}
                              <div className="absolute inset-0 flex items-center justify-center gap-1 bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                                {index > 0 && (
                                  <button
                                    type="button"
                                    onClick={() => moveNewImage(index, index - 1)}
                                    className="flex h-5 w-5 items-center justify-center rounded bg-white/90"
                                  >
                                    <ArrowLeft className="h-3 w-3 text-black" />
                                  </button>
                                )}
                                {index > 0 && existingImageUrls.length === 0 && (
                                  <button
                                    type="button"
                                    onClick={() => setAsPrimary('new', index)}
                                    className="flex h-5 w-5 items-center justify-center rounded bg-primary"
                                    title="Définir comme principale"
                                  >
                                    <Star className="h-3 w-3 text-white" />
                                  </button>
                                )}
                                {index < imageFiles.length - 1 && (
                                  <button
                                    type="button"
                                    onClick={() => moveNewImage(index, index + 1)}
                                    className="flex h-5 w-5 items-center justify-center rounded bg-white/90"
                                  >
                                    <ArrowRight className="h-3 w-3 text-black" />
                                  </button>
                                )}
                                <button
                                  type="button"
                                  onClick={() => removeImageFile(index)}
                                  className="flex h-5 w-5 items-center justify-center rounded bg-destructive"
                                >
                                  <X className="h-3 w-3 text-white" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <input
                      ref={imageInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/gif,image/webp"
                      multiple
                      className="sr-only"
                      onChange={handleImageSelect}
                    />
                    <button
                      type="button"
                      onClick={() => imageInputRef.current?.click()}
                      className="inline-flex h-20 w-20 cursor-pointer items-center justify-center rounded-xl border-2 border-dashed border-border transition-colors hover:border-primary"
                      aria-label="Ajouter des images"
                    >
                      <Upload className="h-6 w-6 text-muted-foreground" />
                    </button>
                  </div>
                </section>
              </div>

              <DialogFooter className="shrink-0 gap-2 border-t border-border bg-card px-5 py-4 sm:px-6">
                <Button type="button" variant="outline" onClick={handleCloseModal}>
                  Annuler
                </Button>
                <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                  {editingProduct ? 'Enregistrer' : 'Créer'}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminProducts;
