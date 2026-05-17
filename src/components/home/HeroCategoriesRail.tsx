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

const HeroCategoriesRail = ({ className }: { className?: string }) => {
  const { data: heroList = [], isLoading } = useQuery({
    queryKey: ['heroCategories'],
    queryFn: () => categoriesApi.getHeroCategories(),
    ...heroQueryOptions,
  });

  const visible = useMemo(() => {
    const withImg = heroList.filter((c) => (c.heroImageUrl ?? '').trim().length > 0);
    return orderHeroCategoriesForDisplay(withImg);
  }, [heroList]);

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
                <span className="relative block size-[4.75rem] overflow-hidden rounded-full bg-background-light ring-1 ring-accent-beige/30 shadow-md transition-transform duration-300 group-hover:scale-[1.03] group-active:scale-[0.98] sm:size-20 md:size-24">
                  <img
                    src={src}
                    alt=""
                    className="size-full object-cover"
                    loading="eager"
                    decoding="async"
                  />
                </span>
                <span className="max-w-[5.5rem] text-center font-display text-[11px] leading-tight text-foreground sm:max-w-[6rem] sm:text-xs md:max-w-none md:text-sm">
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
