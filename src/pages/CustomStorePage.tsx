import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Layout from '@/components/layout/Layout';
import { PageRenderer } from '@/components/storefront/PageRenderer';
import { PageSeo } from '@/components/storefront/PageSeo';
import { storePagesApi } from '@/services/api/storePages';
import { Button } from '@/components/ui/button';
import { useStoreLang } from '@/hooks/useStoreLang';

const CustomStorePage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { lang, isAr } = useStoreLang();

  const { data, isLoading, error } = useQuery({
    queryKey: ['store-pages', 'public', slug, lang],
    queryFn: () => storePagesApi.publicBySlug(slug || '', lang),
    enabled: !!slug,
  });

  if (isLoading) {
    return (
      <Layout>
        <div className="p-16 text-center text-muted-foreground">Chargement…</div>
      </Layout>
    );
  }

  if (error || !data) {
    return (
      <Layout>
        <div className="mx-auto max-w-lg px-4 py-20 text-center">
          <h1 className="font-display text-2xl font-bold">Page introuvable</h1>
          <Button className="mt-6" asChild>
            <Link to="/">Retour à l’accueil</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div dir={isAr ? 'rtl' : 'ltr'}>
        <PageSeo page={data} />
        <PageRenderer page={data} />
      </div>
    </Layout>
  );
};

export default CustomStorePage;
