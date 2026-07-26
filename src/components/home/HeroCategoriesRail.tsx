import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { categoriesApi } from '@/services/api/categories';
import { heroCategoryDisplaySrc } from '@/components/home/heroCategoryImage';
import { orderHeroCategoriesForDisplay } from '@/components/home/heroCategoryOrder';
import { cn } from '@/lib/utils';

const heroQueryOptions = {
  staleTime: 2 * 60 * 1000,
  gcTime: 15 * 60 * 1000,
  refetchOnWindowFocus: true,
} as const;

const HeroCategoriesRail = ({
  className,
  tone = 'light',
}: {
  className?: string;
  tone?: 'light' | 'dark';
}) => {
  const { data: heroList = [], isLoading } = useQuery({
    queryKey: ['heroCategories'],
    queryFn: () => categoriesApi.getHeroCategories(),
    ...heroQueryOptions,
  });

  const { data: navCategories = [] } = useQuery({
    queryKey: ['categories', 'nav'],
    queryFn: () => categoriesApi.getNavCategories(),
    ...heroQueryOptions,
    enabled: heroList.length === 0 || heroList.every((c) => !(c.heroImageUrl ?? '').trim()),
  });

  const visible = useMemo(() => {
    const withImg = heroList.filter((c) => (c.heroImageUrl ?? '').trim().length > 0);
    if (withImg.length > 0) return orderHeroCategoriesForDisplay(withImg);
    // Fallback: catégories principales (sans image hero admin)
    const roots = ['sachets-pochettes', 'carton-boites', 'protections', 'decorations', 'materiels'];
    return roots
      .map((slug) => {
        const n = navCategories.find((c) => c.slug === slug);
        return n
          ? { id: n.id, name: n.name, slug: n.slug, heroImageUrl: null, heroSortOrder: null }
          : null;
      })
      .filter(Boolean) as typeof heroList;
  }, [heroList, navCategories]);

  if (isLoading || visible.length === 0) return null;

  return (
    <div
      className={cn(
        'pointer-events-auto w-full max-md:snap-x max-md:snap-mandatory max-md:overflow-x-auto max-md:overscroll-x-contain max-md:[scrollbar-width:none] max-md:[&::-webkit-scrollbar]:hidden',
        className
      )}
    >
      <ul className="flex max-md:flex-nowrap max-md:gap-5 max-md:px-4 max-md:pb-1 max-md:pt-1 md:flex-wrap md:justify-center md:gap-8 md:px-6">
        {visible.map((cat) => {
          const src = heroCategoryDisplaySrc(cat.heroImageUrl ?? undefined);
          return (
            <li key={cat.id} className="max-md:shrink-0 max-md:snap-start md:min-w-0">
              <Link
                to={`/boutique?category=${encodeURIComponent(cat.slug)}`}
                className="group flex w-[4.75rem] flex-col items-center gap-2 sm:w-20 md:w-24"
              >
                <span
                  className={cn(
                    'relative block size-[4.75rem] overflow-hidden rounded-2xl transition-all duration-300 group-hover:scale-[1.03] group-active:scale-[0.98] sm:size-20 md:size-24',
                    tone === 'light'
                      ? 'bg-card shadow-soft ring-1 ring-border/80 group-hover:shadow-card group-hover:ring-primary/35'
                      : 'bg-card/90 shadow-soft ring-1 ring-white/25 group-hover:ring-primary/50',
                  )}
                >
                  <img
                    src={src}
                    alt=""
                    className="size-full object-cover"
                    loading="eager"
                    decoding="async"
                  />
                </span>
                <span
                  className={cn(
                    'max-w-[5.5rem] text-center font-display text-[11px] font-medium leading-tight sm:max-w-[6rem] sm:text-xs md:max-w-none md:text-sm',
                    tone === 'light' ? 'text-foreground/90' : 'text-white/95',
                  )}
                >
                  {cat.name}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default HeroCategoriesRail;
