import PageLoader from '@/components/layout/PageLoader';
import { useTenant } from '@/contexts/TenantContext';
import Index from '@/pages/Index';
import MatjaronaHome from '@/pages/MatjaronaHome';

/**
 * `/` : boutique locataire si un store est résolu, sinon landing Matjarona.
 */
const HomeRoute = () => {
  const { store, isLoading, slug, storeUnavailableMessage, isPlatformHost } = useTenant();

  if (isLoading) {
    return <PageLoader />;
  }

  if (store && slug) {
    return <Index />;
  }

  if (!isPlatformHost && (slug || storeUnavailableMessage)) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-6 text-center">
        <p className="font-display text-2xl font-bold text-foreground">Boutique indisponible</p>
        <p className="max-w-md text-muted-foreground">
          {storeUnavailableMessage ||
            'Cette boutique est en attente d’activation ou temporairement suspendue.'}
        </p>
      </div>
    );
  }

  return <MatjaronaHome />;
};

export default HomeRoute;
