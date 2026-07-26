import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Layout from '@/components/layout/Layout';
import { storeBlogApi } from '@/services/api/storeBlog';
import { useStoreLang } from '@/hooks/useStoreLang';
import { useStorefrontPath } from '@/hooks/useStorefrontPath';
import { useStoreBrand } from '@/hooks/useStoreBrand';
import { getImageUrl } from '@/services/api/upload';
import { staticCatalogQueryOptions } from '@/config/queryOptions';

const BlogList = () => {
  const { lang } = useStoreLang();
  const { to } = useStorefrontPath();
  const { siteName } = useStoreBrand();

  const { data: posts = [], isLoading } = useQuery({
    queryKey: ['store-blog', 'public', lang],
    queryFn: () => storeBlogApi.listPublic(lang),
    ...staticCatalogQueryOptions,
  });

  return (
    <Layout>
      <title>{`Blog — ${siteName}`}</title>
      <main className="page-section-y animate-fade-in">
        <div className="mx-auto max-w-4xl page-padding">
          <div className="mb-12 text-center sm:mb-14">
            <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">Blog</h1>
            <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground sm:text-base">
              Actualités et conseils de {siteName}.
            </p>
          </div>

          {isLoading ? (
            <p className="text-center text-muted-foreground">Chargement…</p>
          ) : posts.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-border p-12 text-center text-muted-foreground">
              Aucun article pour le moment.
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
                          ? new Date(post.createdAt).toLocaleDateString('fr-MA', {
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
                        Lire la suite
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
