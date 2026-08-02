import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowRight } from 'lucide-react';
import { categoriesApi } from '@/services/api/categories';
import { heroCategoryDisplaySrc } from '@/components/home/heroCategoryImage';
import { orderHeroCategoriesForDisplay } from '@/components/home/heroCategoryOrder';
import { Button } from '@/components/ui/button';
import type { CategoryHeroDTO } from '@/types/api';
import { useLocale } from '@/contexts/LocaleContext';

const FALLBACK_ROOT_SLUGS = [
  'sachets-pochettes',
  'carton-boites',
  'protections',
  'decorations',
  'materiels',
];

const categoriesQueryOptions = {
  staleTime: 2 * 60 * 1000,
  gcTime: 15 * 60 * 1000,
  refetchOnWindowFocus: true,
} as const;

/**
 * Section « Nos catégories » — alimentée par les catégories activées
 * dans Admin → Accueil (catégories) : affichage, ordre et image.
 */
const CategoriesSection = () => {
  const { t } = useLocale();
  const { data: heroList = [], isLoading: loadingHero } = useQuery({
    queryKey: ['heroCategories'],
    queryFn: () => categoriesApi.getHeroCategories(),
    ...categoriesQueryOptions,
  });

  const { data: navCategories = [], isLoading: loadingNav } = useQuery({
    queryKey: ['categories', 'nav'],
    queryFn: () => categoriesApi.getNavCategories(),
    ...categoriesQueryOptions,
    enabled: heroList.length === 0 || heroList.every((c) => !(c.heroImageUrl ?? '').trim()),
  });

  const visible = useMemo(() => {
    const withImg = heroList.filter((c) => (c.heroImageUrl ?? '').trim().length > 0);
    if (withImg.length > 0) return orderHeroCategoriesForDisplay(withImg);

    // Fallback si rien n’est encore configuré en admin
    return FALLBACK_ROOT_SLUGS.map((slug) => {
      const n = navCategories.find((c) => c.slug === slug);
      return n
        ? ({ id: n.id, name: n.name, slug: n.slug, heroImageUrl: null, heroSortOrder: null } satisfies CategoryHeroDTO)
        : null;
    }).filter(Boolean) as CategoryHeroDTO[];
  }, [heroList, navCategories]);

  if (loadingHero || loadingNav || visible.length === 0) return null;

  return (
    <section className="bg-background py-16 sm:py-20">
      <div className="container mx-auto px-4">
        <div className="mb-10 text-center sm:mb-12">
          <h2 className="mb-3 font-display text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
            {t('ourCategories')}
          </h2>
          <p className="mx-auto max-w-xl font-body text-muted-foreground">
            {t('categoriesIntro')}
          </p>
        </div>

        <ul className="grid grid-cols-2 gap-6 sm:grid-cols-3 sm:gap-8 lg:grid-cols-6">
          {visible.map((cat) => {
            const src = heroCategoryDisplaySrc(cat.heroImageUrl ?? undefined);
            return (
              <li key={cat.id}>
                <Link
                  to={`/boutique?category=${encodeURIComponent(cat.slug)}`}
                  className="group flex flex-col items-center gap-3 text-center"
                >
                  <span className="relative block size-28 overflow-hidden rounded-2xl bg-muted shadow-soft ring-1 ring-border transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-elegant group-hover:ring-primary/30 sm:size-32 sm:rounded-3xl">
                    <img
                      src={src || '/placeholder-modern-fixed.svg'}
                      alt=""
                      className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  </span>
                  <span className="font-display text-sm font-medium text-foreground transition-colors group-hover:text-primary sm:text-base">
                    {cat.name}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="mt-10 flex justify-center sm:mt-12">
          <Button asChild variant="outline" size="lg" className="rounded-2xl px-6">
            <Link to="/boutique" className="inline-flex items-center gap-2">
              {t('seeAllCategories')}
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;
