import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  FileText,
  LayoutPanelLeft,
  MessageSquare,
  Palette,
  Paintbrush,
  Sparkles,
  Star,
  Wand2,
} from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import { useAdminLocale } from '@/contexts/AdminLocaleContext';
import { BoutiqueWorkspaceLinks } from '@/components/admin/BoutiqueWorkspaceLinks';
import { Button } from '@/components/ui/button';
import { buildStorefrontUrl } from '@/utils/storefrontUrl';
import { useStoreBrand } from '@/hooks/useStoreBrand';
import { storeGlobalSectionsApi } from '@/services/api/storeGlobalSections';
import { storePagesApi } from '@/services/api/storePages';
import { topBarMessagesApi } from '@/services/api/topBarMessages';

const AdminOnlineStore = () => {
  const { t } = useAdminLocale();
  const { slug, siteName, store } = useStoreBrand();
  const storefrontUrl = buildStorefrontUrl(slug || store?.slug);

  const { data: globalSections = [] } = useQuery({
    queryKey: ['store-global-sections', 'admin'],
    queryFn: () => storeGlobalSectionsApi.listAdmin(),
  });
  const { data: storePages = [] } = useQuery({
    queryKey: ['store-pages', 'hub'],
    queryFn: () => storePagesApi.list(),
  });
  const { data: topBarMessages = [] } = useQuery({
    queryKey: ['top-bar-messages', 'hub'],
    queryFn: () => topBarMessagesApi.getAllMessages(),
  });

  const megaMenuOn = globalSections.some((s) => s.sectionKey === 'mega_menu' && s.enabled);
  const appBarOn = globalSections.some((s) => s.sectionKey === 'app_bar' && s.enabled);
  const stickyOn = globalSections.some((s) => s.sectionKey === 'sticky_cta' && s.enabled);
  const activeBandeau = (topBarMessages || []).filter((m) => m.isActive);
  const homePage = storePages.find((p) => p.isHome && p.published);

  const headerSource = megaMenuOn
    ? t('onlineStore.headerMega')
    : t('onlineStore.headerSimple');
  const bandeauSource =
    activeBandeau.length > 0
      ? t('onlineStore.bannerRotating', { count: activeBandeau.length })
      : appBarOn
        ? t('onlineStore.bannerAppBar')
        : t('onlineStore.bannerNone');

  const tiles = [
    {
      href: '/admin/parametres',
      title: t('onlineStore.tileAppearanceTitle'),
      description: t('onlineStore.tileAppearanceDesc'),
      icon: Palette,
    },
    {
      href: '/admin/pages',
      title: t('onlineStore.tilePagesTitle'),
      description: t('onlineStore.tilePagesDesc'),
      icon: FileText,
    },
    {
      href: '/admin/sections',
      title: t('onlineStore.tileNavTitle'),
      description: t('onlineStore.tileNavDesc'),
      icon: LayoutPanelLeft,
    },
    {
      href: '/admin/top-bar-messages',
      title: t('onlineStore.tileTopBarTitle'),
      description: t('onlineStore.tileTopBarDesc'),
      icon: MessageSquare,
    },
  ];

  const homeClassicLinks = [
    { href: '/admin/accueil-categories', label: t('onlineStore.heroCategories'), icon: Sparkles },
    { href: '/admin/produits-selectionnes', label: t('onlineStore.featuredProducts'), icon: Star },
  ];

  return (
    <AdminLayout
      title={t('onlineStore.title')}
      description={t('onlineStore.description')}
      breadcrumbs={[
        { label: t('dashboard.title'), href: '/admin/dashboard' },
        { label: t('onlineStore.title') },
      ]}
      actions={
        <div className="flex flex-wrap gap-2">
          {homePage?.id ? (
            <Button size="sm" asChild>
              <Link to={`/admin/pages/${homePage.id}`}>
                <Paintbrush className="mr-1.5 h-4 w-4" />
                {t('onlineStore.customize')}
              </Link>
            </Button>
          ) : (
            <Button size="sm" asChild>
              <Link to="/admin/parametres">
                <Paintbrush className="mr-1.5 h-4 w-4" />
                {t('onlineStore.customize')}
              </Link>
            </Button>
          )}
          <Button variant="outline" size="sm" asChild>
            <a href={storefrontUrl} target="_blank" rel="noopener noreferrer">
              {t('onlineStore.viewNamed', {
                name: siteName || t('onlineStore.viewFallback'),
              })}
            </a>
          </Button>
        </div>
      }
    >
      <BoutiqueWorkspaceLinks current="/admin/boutique-en-ligne" className="mb-6" />

      <section className="mb-6 rounded-2xl border border-border bg-card p-5 sm:p-6">
        <h2 className="font-display text-lg font-semibold">{t('onlineStore.statusTitle')}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{t('onlineStore.statusDesc')}</p>
        <ul className="mt-4 space-y-2 text-sm">
          <li>
            <span className="text-muted-foreground">{t('onlineStore.navLabel')} </span>
            <span className="font-medium text-foreground">{headerSource}</span>
          </li>
          <li>
            <span className="text-muted-foreground">{t('onlineStore.bannerLabel')} </span>
            <span className="font-medium text-foreground">{bandeauSource}</span>
          </li>
          <li>
            <span className="text-muted-foreground">{t('onlineStore.homeLabel')} </span>
            <span className="font-medium text-foreground">
              {homePage
                ? t('onlineStore.homeBuilder', { title: homePage.title })
                : t('onlineStore.homeClassic')}
            </span>
          </li>
          {stickyOn ? (
            <li>
              <span className="text-muted-foreground">{t('onlineStore.stickyLabel')} </span>
              <span className="font-medium text-foreground">{t('common.enabled')}</span>
            </li>
          ) : null}
        </ul>
      </section>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {tiles.map((tile) => (
          <Link
            key={tile.href}
            to={tile.href}
            className="group rounded-2xl border border-border bg-card p-5 transition hover:border-primary/40 hover:shadow-soft"
          >
            <tile.icon className="mb-3 h-8 w-8 text-primary" />
            <h2 className="font-display text-lg font-semibold group-hover:text-primary">{tile.title}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{tile.description}</p>
          </Link>
        ))}
      </div>

      {homePage ? (
        <section className="mt-8 rounded-2xl border border-border bg-muted/20 p-5 sm:p-6">
          <h2 className="font-display text-lg font-semibold">{t('onlineStore.builderHomeTitle')}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{t('onlineStore.builderHomeDesc')}</p>
          <Button className="mt-4" asChild>
            <Link to={`/admin/pages/${homePage.id}`}>
              {t('onlineStore.editNamed', { title: homePage.title })}
            </Link>
          </Button>
        </section>
      ) : (
        <section className="mt-8 rounded-2xl border border-border bg-card p-6">
          <h2 className="font-display text-lg font-semibold">{t('onlineStore.classicHomeTitle')}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{t('onlineStore.classicHomeDesc')}</p>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {homeClassicLinks.map((link) => (
              <li key={link.href}>
                <Link
                  to={link.href}
                  className="flex items-center gap-2 rounded-xl border border-border px-4 py-3 text-sm hover:border-primary/40"
                >
                  <link.icon className="h-4 w-4 text-primary" />
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <Button variant="outline" className="mt-4" asChild>
            <Link to="/admin/pages">{t('onlineStore.createHomePage')}</Link>
          </Button>
        </section>
      )}

      <section className="mt-6 rounded-2xl border border-dashed border-border bg-muted/30 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="font-display text-lg font-semibold">{t('onlineStore.assistantTitle')}</h2>
            <p className="text-sm text-muted-foreground">{t('onlineStore.assistantDesc')}</p>
          </div>
          <Button asChild>
            <Link to="/admin/onboarding">
              <Wand2 className="mr-2 h-4 w-4" />
              {t('onlineStore.assistantCta')}
            </Link>
          </Button>
        </div>
      </section>
    </AdminLayout>
  );
};

export default AdminOnlineStore;
