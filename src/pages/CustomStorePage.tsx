import { Link, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { EyeOff, Loader2, Pencil, Rocket } from 'lucide-react';
import { toast } from 'sonner';
import Layout from '@/components/layout/Layout';
import { PageRenderer } from '@/components/storefront/PageRenderer';
import { PageSeo } from '@/components/storefront/PageSeo';
import { storePagesApi } from '@/services/api/storePages';
import { Button } from '@/components/ui/button';
import { useStoreLang } from '@/hooks/useStoreLang';
import { useAdmin } from '@/contexts/AdminContext';
import { PERMISSIONS } from '@/config/permissions';
import { toastError } from '@/utils/toastMessages';

const CustomStorePage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { lang, isAr } = useStoreLang();
  const { isAuthenticated, isAdmin, hasPermission } = useAdmin();
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ['store-pages', 'public', slug, lang],
    queryFn: () => storePagesApi.publicBySlug(slug || '', lang),
    enabled: !!slug,
    retry: false,
  });

  const notFound = !isLoading && (!!error || !data);

  // Page existante mais non publiée : un admin connecté peut la publier d'ici.
  const { data: draftPage } = useQuery({
    queryKey: ['store-pages', 'draft-lookup', slug],
    queryFn: async () => {
      const all = await storePagesApi.list();
      return all.find((p) => p.slug?.toLowerCase() === (slug || '').toLowerCase()) ?? null;
    },
    enabled: notFound && isAuthenticated && !!slug,
    retry: false,
  });

  const canPublish = isAdmin || hasPermission(PERMISSIONS.PAGES_PUBLISH);

  const publishMutation = useMutation({
    mutationFn: () =>
      storePagesApi.update(draftPage!.id, { title: draftPage!.title, published: true }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['store-pages'] });
      toast.success('Page publiée');
    },
    onError: (err) => toastError(err, 'Publication impossible'),
  });

  if (isLoading) {
    return (
      <Layout>
        <div className="p-16 text-center text-muted-foreground">Chargement…</div>
      </Layout>
    );
  }

  if (notFound) {
    return (
      <Layout>
        <div className="mx-auto max-w-lg px-4 py-20 text-center">
          {draftPage ? (
            <>
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-amber-500/10 text-amber-600">
                <EyeOff className="h-7 w-7" />
              </div>
              <h1 className="font-display text-2xl font-bold">Cette page n’est pas encore publiée</h1>
              <p className="mt-3 text-sm text-muted-foreground">
                « {draftPage.title} » est un brouillon : seuls vous et votre équipe le savent. Vos clients
                voient « Page introuvable » tant qu’elle n’est pas publiée.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-2">
                {canPublish ? (
                  <Button
                    className="gap-1.5"
                    disabled={publishMutation.isPending}
                    onClick={() => publishMutation.mutate()}
                  >
                    {publishMutation.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Rocket className="h-4 w-4" />
                    )}
                    Publier maintenant
                  </Button>
                ) : null}
                <Button variant="outline" className="gap-1.5" asChild>
                  <Link to={`/admin/pages/${draftPage.id}`}>
                    <Pencil className="h-4 w-4" />
                    Modifier la page
                  </Link>
                </Button>
              </div>
            </>
          ) : (
            <>
              <h1 className="font-display text-2xl font-bold">Page introuvable</h1>
              <p className="mt-3 text-sm text-muted-foreground">
                Cette page n’existe pas ou n’est plus disponible.
              </p>
              <Button className="mt-6" asChild>
                <Link to="/">Retour à l’accueil</Link>
              </Button>
            </>
          )}
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div dir={isAr ? 'rtl' : 'ltr'}>
        <PageSeo page={data!} />
        <PageRenderer page={data!} />
      </div>
    </Layout>
  );
};

export default CustomStorePage;
