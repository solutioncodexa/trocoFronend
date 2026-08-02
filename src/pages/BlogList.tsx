import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Layout from '@/components/layout/Layout';
import { storeBlogApi } from '@/services/api/storeBlog';
import { useStoreLang } from '@/hooks/useStoreLang';
import { useStorefrontPath } from '@/hooks/useStorefrontPath';
import { useStoreBrand } from '@/hooks/useStoreBrand';
import { getImageUrl } from '@/services/api/upload';
import { staticCatalogQueryOptions } from '@/config/queryOptions';
import { useLocale } from '@/contexts/LocaleContext';

const BlogList = () => {
  const { lang } = useStoreLang();
  const { to } = useStorefrontPath();
  const { siteName } = useStoreBrand();
  const { t, locale } = useLocale();
  const dateLocale = locale === 'ar' ? 'ar-MA' : locale === 'en' ? 'en-GB' : 'fr-MA';

  const { data: posts = [], isLoading } = useQuery({
    queryKey: ['store-blog', 'public', lang],
    queryFn: () => storeBlogApi.listPublic(lang),
    ...staticCatalogQueryOptions,
  });

  return (
    <Layout>
      <title>{`${t('blogTitle')} — ${siteName}`}</title>
      <main className="page-section-y animate-fade-in">
        <div className="mx-auto max-w-4xl page-padding">
          <div className="mb-12 text-center sm:mb-14">
            <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">{t('blogTitle')}</h1>
            <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground sm:text-base">
              {t('blogIntro', { name: siteName })}
            </p>
          </div>

          {isLoading ? (
            <p className="text-center text-muted-foreground">{t('loading')}</p>
          ) : posts.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-border p-12 text-center text-muted-foreground">
              {t('noArticles')}
            </p>
          ) : (
            <ul className="space-y-8">
              {posts.map((post) => (
                <li key={post.id}>
                  <article className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
                    {post.coverUrl ? (
                      <img
                        src={getImageUrl(post.coverUrl)}
                        alt=""
                        loading="lazy"
                        decoding="async"
                        className="aspect-[21/9] w-full object-cover"
                      />
                    ) : null}
                    <div className="p-6 sm:p-8">
                      <time className="text-xs uppercase tracking-wider text-muted-foreground">
                        {post.createdAt
                          ? new Date(post.createdAt).toLocaleDateString(dateLocale, {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric',
                            })
                          : null}
                      </time>
                      <h2 className="mt-2 font-display text-2xl font-semibold">
                        <Link className="hover:text-primary" to={to(`/blog/${post.slug}`)}>
                          {post.title}
                        </Link>
                      </h2>
                      {post.excerpt ? (
                        <p className="mt-3 text-muted-foreground">{post.excerpt}</p>
                      ) : null}
                      <Link
                        className="mt-4 inline-block text-sm font-medium text-primary hover:underline"
                        to={to(`/blog/${post.slug}`)}
                      >
                        {t('readMore')}
                      </Link>
                    </div>
                  </article>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </Layout>
  );
};

export default BlogList;
