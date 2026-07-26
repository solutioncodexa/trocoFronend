import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Layout from '@/components/layout/Layout';
import { PageRenderer } from '@/components/storefront/PageRenderer';
import { PageSeo } from '@/components/storefront/PageSeo';
import { storePagesApi } from '@/services/api/storePages';
import { Button } from '@/components/ui/button';
import { useStoreLang } from '@/hooks/useStoreLang';
import { Eye } from 'lucide-react';

const PagePreview = () => {
  const { token } = useParams<{ token: string }>();
  const { lang, isAr } = useStoreLang();

  const { data, isLoading, error } = useQuery({
    queryKey: ['store-pages', 'preview', token, lang],
    queryFn: () => storePagesApi.publicPreview(token || '', lang),
    enabled: !!token,
  });

  if (isLoading) {
    return (
      <Layout>
        <div className="p-16 text-center text-muted-foreground">Chargement de l’aperçu…</div>
      </Layout>
    );
  }

  if (error || !data) {
    return (
      <Layout>
        <div className="mx-auto max-w-lg px-4 py-20 text-center">
          <h1 className="font-display text-2xl font-bold">Aperçu indisponible</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Ce lien est invalide ou a expiré.
          </p>
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
        <div
          className="border-b border-amber-500/40 bg-amber-500/10 px-4 py-2.5 text-center text-sm font-medium text-amber-950 dark:text-amber-100"
          role="status"
        >
          <span className="inline-flex items-center justify-center gap-2">
            <Eye className="h-4 w-4 shrink-0" aria-hidden />
            Aperçu brouillon — cette page n’est pas visible publiquement
          </span>
        </div>
        <PageSeo page={data} />
        <PageRenderer page={data} />
      </div>
    </Layout>
  );
};

export default PagePreview;
