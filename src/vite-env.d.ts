/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL?: string;
  readonly VITE_PUBLIC_SITE_URL?: string;
  readonly VITE_PUBLIC_SITE_NAME?: string;
  readonly VITE_FACEBOOK_APP_ID?: string;
  /** Slug locataire par défaut (ex. troco) quand aucun ?tenant= / sous-domaine */
  readonly VITE_DEFAULT_TENANT_SLUG?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
