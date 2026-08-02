import NeutralBootLoader from '@/components/layout/NeutralBootLoader';
import { useTenant } from '@/contexts/TenantContext';
import Index from '@/pages/Index';
import MatjaronaHome from '@/pages/MatjaronaHome';

/**
 * `/` : boutique locataire si un store est résolu, sinon landing Matjarona.
 */
const HomeRoute = () => {
  const { store, isLoading, slug, storeUnavailableMessage, isPlatformHost } = useTenant();

  // Attente bootstrap : loader neutre (pas les couleurs Matjarona).
  // Si un cache thème existe, `store` est déjà hydraté → on affiche Index tout de suite.
  if (isLoading && !store) {
    return <NeutralBootLoader />;
  }

  if (store && slug) {
    return <Index />;
  }

  if (!isPlatformHost && (slug || storeUnavailableMessage)) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-neutral-50 px-6 text-center">
        <p className="font-display text-2xl font-bold text-neutral-900">Boutique indisponible</p>
        <p className="max-w-md text-neutral-600">
          {storeUnavailableMessage ||
            'Cette boutique est en attente d’activation ou temporairement suspendue.'}
        </p>
      </div>
    );
  }

  return <MatjaronaHome />;
};

export default HomeRoute;
