import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import Layout from '@/components/layout/Layout';
import { ThemeHome } from '@/components/themes/ThemeHome';
import { PageRenderer } from '@/components/storefront/PageRenderer';
import { PageSeo } from '@/components/storefront/PageSeo';
import { useTenant } from '@/contexts/TenantContext';
import { useStoreBrand } from '@/hooks/useStoreBrand';
import { normalizeThemeKey } from '@/config/storeThemes';
import { productsApi, categoriesApi } from '@/services/api';
import { homeHeroApi } from '@/services/api/homeHero';
import { storePagesApi } from '@/services/api/storePages';
import { mapProductListItemListToProducts } from '@/utils/productMapper';
import { getImageUrl } from '@/services/api/upload';
import { staticCatalogQueryOptions } from '@/config/queryOptions';
import { useStoreLang } from '@/hooks/useStoreLang';
import { usePreloadImage } from '@/hooks/usePreloadImage';
import { resolveStickyHomeAbVariant } from '@/utils/homeAbVariant';
import type { DemoCategory } from '@/demo/mockCatalog';

const FALLBACK_HERO =
  'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=2000&h=1400&fit=crop&q=85';

const Index = () => {
  const { store } = useTenant();
  const { siteName, tagline, aboutText } = useStoreBrand();
  const { lang, isAr } = useStoreLang();
  const theme = normalizeThemeKey(store?.themeKey);

  const { data: publicHomes } = useQuery({
    queryKey: ['store-pages', 'public-homes', store?.slug, lang],
    queryFn: () => storePagesApi.publicHomes(lang),
    ...staticCatalogQueryOptions,
  });

  const homeAbVariant = useMemo(
    () => resolveStickyHomeAbVariant(store?.slug, publicHomes),
    [store?.slug, publicHomes],
  );

  const { data: customHome, isLoading: loadingHome } = useQuery({
    queryKey: ['store-pages', 'public-home', store?.slug, lang, homeAbVariant ?? 'default'],
    queryFn: () => storePagesApi.publicHome(lang, homeAbVariant),
    ...staticCatalogQueryOptions,
  });

  const { data: homeHero } = useQuery({
    queryKey: ['homeHero', store?.slug],
    queryFn: () => homeHeroApi.getPublic(),
    ...staticCatalogQueryOptions,
    enabled: !customHome,
  });

  const { data: categoriesDto = [] } = useQuery({
    queryKey: ['categories', 'cards', 'home', store?.slug],
    queryFn: () => categoriesApi.getCardCategories(),
    ...staticCatalogQueryOptions,
    enabled: !customHome,
  });

  const { data: productsPage } = useQuery({
    queryKey: ['products', 'home-theme', store?.slug],
    queryFn: () => productsApi.getAllProducts({ page: 0, size: 12 }),
    ...staticCatalogQueryOptions,
    enabled: !customHome,
  });

  if (loadingHome) {
    return (
      <Layout>
        <div className="p-16 text-center text-muted-foreground">Chargement…</div>
      </Layout>
    );
  }

  if (customHome?.blocks?.length) {
    return (
      <Layout>
        <div dir={isAr ? 'rtl' : 'ltr'}>
          <PageSeo page={customHome} />
          <PageRenderer page={customHome} />
        </div>
      </Layout>
    );
  }

  const products = mapProductListItemListToProducts(productsPage?.content ?? []);

  const categories: DemoCategory[] = categoriesDto
    .filter((c) => !c.parentId)
    .slice(0, 5)
    .map((c) => ({
      id: String(c.id),
      name: c.name,
      slug: c.slug,
      image: c.heroImageUrl ? getImageUrl(c.heroImageUrl) : FALLBACK_HERO,
      count: 0,
    }));

  const heroImage =
    (homeHero?.imageUrls?.[0] && getImageUrl(homeHero.imageUrls[0])) ||
    (homeHero?.imageUrl && getImageUrl(homeHero.imageUrl)) ||
    FALLBACK_HERO;

  usePreloadImage(!customHome ? heroImage : null);

  return (
    <Layout>
      <ThemeHome
        themeKey={theme}
        siteName={siteName}
        tagline={tagline || 'Bienvenue dans notre boutique'}
        aboutText={aboutText || 'Découvrez nos produits.'}
        heroImage={heroImage}
        products={products}
        categories={
          categories.length > 0
            ? categories
            : [
                {
                  id: 'all',
                  name: 'Boutique',
                  slug: '',
                  image: heroImage,
                  count: products.length,
                },
              ]
        }
      />
    </Layout>
  );
};

export default Index;
