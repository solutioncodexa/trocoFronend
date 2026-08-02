import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Layout from '@/components/layout/Layout';
import { storeBlogApi } from '@/services/api/storeBlog';
import { useStorefrontPath } from '@/hooks/useStorefrontPath';
import { useStoreBrand } from '@/hooks/useStoreBrand';
import { getImageUrl } from '@/services/api/upload';
import { staticCatalogQueryOptions } from '@/config/queryOptions';
import { useLocale } from '@/contexts/LocaleContext';

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const { to } = useStorefrontPath();
  const { siteName } = useStoreBrand();
  const { t, locale } = useLocale();
  const dateLocale = locale === 'ar' ? 'ar-MA' : locale === 'en' ? 'en-GB' : 'fr-MA';

  const { data: post, isLoading, error } = useQuery({
    queryKey: ['store-blog', 'public', slug],
    queryFn: () => storeBlogApi.getPublicBySlug(slug || ''),
    enabled: !!slug,
    ...staticCatalogQueryOptions,
  });

  const pageTitle = post?.seoTitle?.trim() || post?.title || t('article');
  const metaDescription = post?.seoDescription?.trim() || post?.excerpt || '';

  return (
    <Layout>
      <title>{`${pageTitle} — ${siteName}`}</title>
      {metaDescription ? <meta name="description" content={metaDescription} /> : null}
      <main className="page-section-y animate-fade-in">
        <div className="mx-auto max-w-3xl page-padding">
          {isLoading ? (
            <p className="text-center text-muted-foreground">{t('loading')}</p>
          ) : error || !post ? (
            <div className="text-center">
              <p className="text-destructive">{t('articleNotFound')}</p>
              <Link className="mt-4 inline-block text-primary hover:underline" to={to('/blog')}>
                {t('backToBlog')}
              </Link>
            </div>
          ) : (
            <>
              <Link className="text-sm text-primary hover:underline" to={to('/blog')}>
                ← {t('blogTitle')}
              </Link>
              {post.coverUrl ? (
                <img
                  src={getImageUrl(post.coverUrl)}
                  alt=""
                  className="mt-6 aspect-[21/9] w-full rounded-2xl object-cover"
                />
              ) : null}
              <header className="mt-8">
                <time className="text-xs uppercase tracking-wider text-muted-foreground">
                  {post.createdAt
                    ? new Date(post.createdAt).toLocaleDateString(dateLocale, {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })
                    : null}
                </time>
                <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
                  {post.title}
                </h1>
                {post.excerpt ? (
                  <p className="mt-4 text-lg text-muted-foreground">{post.excerpt}</p>
                ) : null}
              </header>
              <div className="prose prose-neutral mt-10 max-w-none whitespace-pre-wrap leading-relaxed text-foreground dark:prose-invert">
                {post.content}
              </div>
            </>
          )}
        </div>
      </main>
    </Layout>
  );
};

export default BlogPost;
