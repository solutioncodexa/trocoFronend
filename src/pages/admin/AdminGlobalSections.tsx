import { useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Loader2, Plus, Save, Trash2 } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { storeGlobalSectionsApi } from '@/services/api/storeGlobalSections';
import type {
  AppBarConfig,
  FooterLinksColumn,
  FooterLinksConfig,
  GlobalSectionKey,
  MegaMenuConfig,
  MegaMenuItem,
  StickyCtaConfig,
} from '@/types/store-global-sections';
import { DEFAULT_APP_BAR, parseAppBarConfig } from '@/types/store-global-sections';
import AppBarStylePanel from '@/components/admin/page-builder/AppBarStylePanel';
import { toast } from 'sonner';
import { toastError } from '@/utils/toastMessages';

const SECTION_LABELS: Record<GlobalSectionKey, string> = {
  mega_menu: 'Mega menu',
  footer_links: 'Liens pied de page',
  sticky_cta: 'Bandeau CTA fixe',
  app_bar: 'App bar (en-tête)',
};

const emptyMegaMenu = (): MegaMenuConfig => ({
  items: [{ label: 'Boutique', href: '/boutique', children: [] }],
});

const emptyFooter = (): FooterLinksConfig => ({
  columns: [{ title: 'Navigation', links: [{ label: 'Accueil', href: '/' }] }],
});

const emptySticky = (): StickyCtaConfig => ({
  text: 'Une question ?',
  ctaLabel: 'Contact',
  ctaHref: '/contact',
  dismissible: true,
});

function sectionFromList(list: { sectionKey: string; enabled: boolean; config: Record<string, unknown> }[], key: GlobalSectionKey) {
  return list.find((s) => s.sectionKey === key);
}

const TAB_HINTS: Record<GlobalSectionKey, string> = {
  mega_menu: 'Remplace la navigation principale quand activé. Ajoutez des sous-liens pour un vrai mega-menu.',
  footer_links: 'Colonnes de liens en bas de page (boutique, aide, légal…).',
  sticky_cta: 'Bandeau fixe en bas d’écran — idéal pour une promo ou un contact rapide.',
  app_bar: 'Couleurs, bandeau promo, icônes et logo de l’en-tête boutique. Aussi éditable depuis le constructeur de pages.',
};

const AdminGlobalSections = () => {
  const queryClient = useQueryClient();
  const [tab, setTab] = useState<GlobalSectionKey>('mega_menu');
  const [megaMenu, setMegaMenu] = useState<MegaMenuConfig>(emptyMegaMenu());
  const [footerLinks, setFooterLinks] = useState<FooterLinksConfig>(emptyFooter());
  const [stickyCta, setStickyCta] = useState<StickyCtaConfig>(emptySticky());
  const [appBar, setAppBar] = useState<AppBarConfig>(DEFAULT_APP_BAR);
  const [enabled, setEnabled] = useState<Record<GlobalSectionKey, boolean>>({
    mega_menu: false,
    footer_links: false,
    sticky_cta: false,
    app_bar: false,
  });

  const { data: sections = [], isLoading, error } = useQuery({
    queryKey: ['store-global-sections', 'admin'],
    queryFn: () => storeGlobalSectionsApi.listAdmin(),
  });

  useEffect(() => {
    if (!sections.length) return;
    const mega = sectionFromList(sections, 'mega_menu');
    const footer = sectionFromList(sections, 'footer_links');
    const sticky = sectionFromList(sections, 'sticky_cta');
    const bar = sectionFromList(sections, 'app_bar');

    setEnabled({
      mega_menu: mega?.enabled ?? false,
      footer_links: footer?.enabled ?? false,
      sticky_cta: sticky?.enabled ?? false,
      app_bar: bar?.enabled ?? false,
    });

    if (mega?.config) {
      const items = Array.isArray(mega.config.items) ? (mega.config.items as MegaMenuItem[]) : [];
      setMegaMenu({ items: items.length ? items : emptyMegaMenu().items });
    }
    if (footer?.config) {
      const columns = Array.isArray(footer.config.columns)
        ? (footer.config.columns as FooterLinksColumn[])
        : [];
      setFooterLinks({ columns: columns.length ? columns : emptyFooter().columns });
    }
    if (sticky?.config) {
      setStickyCta({
        text: String(sticky.config.text ?? emptySticky().text),
        ctaLabel: String(sticky.config.ctaLabel ?? emptySticky().ctaLabel),
        ctaHref: String(sticky.config.ctaHref ?? emptySticky().ctaHref),
        dismissible: sticky.config.dismissible !== false,
      });
    }
    if (bar?.config) {
      setAppBar(parseAppBarConfig(bar.config));
    }
  }, [sections]);

  const saveMutation = useMutation({
    mutationFn: (payload: { sectionKey: GlobalSectionKey; enabled: boolean; config: Record<string, unknown> }) =>
      storeGlobalSectionsApi.upsert(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['store-global-sections'] });
      toast.success('Section enregistrée');
    },
    onError: (err: unknown) => toastError(err, 'Erreur lors de l’enregistrement'),
  });

  const currentEnabled = enabled[tab];

  const configPayload = useMemo((): Record<string, unknown> => {
    if (tab === 'mega_menu') {
      return {
        items: megaMenu.items.map((item) => ({
          label: item.label,
          href: item.href,
          children: (item.children ?? []).map((c) => ({ label: c.label, href: c.href })),
        })),
      };
    }
    if (tab === 'footer_links') {
      return {
        columns: footerLinks.columns.map((col) => ({
          title: col.title,
          links: col.links.map((l) => ({ label: l.label, href: l.href })),
        })),
      };
    }
    if (tab === 'app_bar') {
      return { ...appBar };
    }
    return {
      text: stickyCta.text,
      ctaLabel: stickyCta.ctaLabel,
      ctaHref: stickyCta.ctaHref,
      dismissible: stickyCta.dismissible !== false,
    };
  }, [tab, megaMenu, footerLinks, stickyCta, appBar]);

  const save = () => {
    saveMutation.mutate({
      sectionKey: tab,
      enabled: currentEnabled,
      config: configPayload,
    });
  };

  const updateMegaItem = (index: number, patch: Partial<MegaMenuItem>) => {
    setMegaMenu((prev) => {
      const items = [...prev.items];
      items[index] = { ...items[index], ...patch };
      return { items };
    });
  };

  const addMegaItem = () => {
    setMegaMenu((prev) => ({
      items: [...prev.items, { label: 'Nouveau lien', href: '/', children: [] }],
    }));
  };

  const removeMegaItem = (index: number) => {
    setMegaMenu((prev) => ({ items: prev.items.filter((_, i) => i !== index) }));
  };

  const updateMegaChild = (itemIndex: number, childIndex: number, patch: { label?: string; href?: string }) => {
    setMegaMenu((prev) => {
      const items = prev.items.map((item, i) => {
        if (i !== itemIndex) return item;
        const children = [...(item.children ?? [])];
        children[childIndex] = { ...children[childIndex], ...patch };
        return { ...item, children };
      });
      return { items };
    });
  };

  const addMegaChild = (itemIndex: number) => {
    setMegaMenu((prev) => {
      const items = prev.items.map((item, i) => {
        if (i !== itemIndex) return item;
        return {
          ...item,
          children: [...(item.children ?? []), { label: 'Sous-lien', href: '/' }],
        };
      });
      return { items };
    });
  };

  const removeMegaChild = (itemIndex: number, childIndex: number) => {
    setMegaMenu((prev) => {
      const items = prev.items.map((item, i) => {
        if (i !== itemIndex) return item;
        return {
          ...item,
          children: (item.children ?? []).filter((_, ci) => ci !== childIndex),
        };
      });
      return { items };
    });
  };

  const updateFooterColumn = (index: number, patch: Partial<FooterLinksColumn>) => {
    setFooterLinks((prev) => {
      const columns = [...prev.columns];
      columns[index] = { ...columns[index], ...patch };
      return { columns };
    });
  };

  const addFooterColumn = () => {
    setFooterLinks((prev) => ({
      columns: [...prev.columns, { title: 'Colonne', links: [{ label: 'Lien', href: '/' }] }],
    }));
  };

  const removeFooterColumn = (index: number) => {
    setFooterLinks((prev) => ({ columns: prev.columns.filter((_, i) => i !== index) }));
  };

  const updateFooterLink = (
    colIndex: number,
    linkIndex: number,
    patch: { label?: string; href?: string },
  ) => {
    setFooterLinks((prev) => {
      const columns = prev.columns.map((col, ci) => {
        if (ci !== colIndex) return col;
        const links = col.links.map((l, li) => (li === linkIndex ? { ...l, ...patch } : l));
        return { ...col, links };
      });
      return { columns };
    });
  };

  const addFooterLink = (colIndex: number) => {
    setFooterLinks((prev) => {
      const columns = prev.columns.map((col, ci) => {
        if (ci !== colIndex) return col;
        return { ...col, links: [...col.links, { label: 'Lien', href: '/' }] };
      });
      return { columns };
    });
  };

  const removeFooterLink = (colIndex: number, linkIndex: number) => {
    setFooterLinks((prev) => {
      const columns = prev.columns.map((col, ci) => {
        if (ci !== colIndex) return col;
        return { ...col, links: col.links.filter((_, li) => li !== linkIndex) };
      });
      return { columns };
    });
  };

  if (isLoading) {
    return (
      <AdminLayout title="Sections globales" breadcrumbs={[{ label: 'Sections globales' }]}>
        <div className="flex justify-center p-12 text-muted-foreground">Chargement…</div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout title="Sections globales" breadcrumbs={[{ label: 'Sections globales' }]}>
        <p className="p-6 text-destructive">Impossible de charger les sections.</p>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout
      title="Sections globales"
      description="Mega menu, liens du pied de page et bandeau CTA sur toute la vitrine."
      breadcrumbs={[{ label: 'Sections globales' }]}
      actions={
        <Button size="sm" className="gap-1.5" onClick={save} disabled={saveMutation.isPending}>
          {saveMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Enregistrer
        </Button>
      }
    >
      <Tabs value={tab} onValueChange={(v) => setTab(v as GlobalSectionKey)} className="space-y-6">
        <TabsList className="flex h-auto flex-wrap gap-1">
          {(Object.keys(SECTION_LABELS) as GlobalSectionKey[]).map((key) => (
            <TabsTrigger key={key} value={key} className="text-sm">
              {SECTION_LABELS[key]}
            </TabsTrigger>
          ))}
        </TabsList>

        <div className="flex items-center justify-between gap-4 rounded-xl border border-border bg-card px-4 py-3">
          <div className="min-w-0">
            <p className="font-medium">{SECTION_LABELS[tab]}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">{TAB_HINTS[tab]}</p>
            <p className="mt-1 text-[11px] text-muted-foreground">
              {currentEnabled ? 'État : visible sur la vitrine' : 'État : désactivée'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Label htmlFor="section-enabled" className="text-sm">
              Activer
            </Label>
            <Switch
              id="section-enabled"
              checked={currentEnabled}
              onCheckedChange={(checked) =>
                setEnabled((prev) => ({ ...prev, [tab]: checked }))
              }
            />
          </div>
        </div>

        <TabsContent value="mega_menu" className="space-y-4 mt-0">
          {megaMenu.items.map((item, index) => (
            <div key={index} className="rounded-xl border border-border bg-card p-4 space-y-3">
              <div className="flex flex-wrap items-end gap-3">
                <div className="min-w-[140px] flex-1">
                  <Label>Libellé</Label>
                  <Input
                    className="mt-1"
                    value={item.label}
                    onChange={(e) => updateMegaItem(index, { label: e.target.value })}
                  />
                </div>
                <div className="min-w-[140px] flex-1">
                  <Label>Lien (href)</Label>
                  <Input
                    className="mt-1 font-mono text-sm"
                    value={item.href}
                    onChange={(e) => updateMegaItem(index, { href: e.target.value })}
                    placeholder="/boutique"
                  />
                </div>
                <Button type="button" variant="ghost" size="icon" onClick={() => removeMegaItem(index)}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
              <div className="space-y-2 border-t border-border pt-3">
                <p className="text-xs font-semibold uppercase text-muted-foreground">Sous-liens (desktop)</p>
                {(item.children ?? []).map((child, ci) => (
                  <div key={ci} className="flex flex-wrap gap-2">
                    <Input
                      className="flex-1"
                      value={child.label}
                      onChange={(e) => updateMegaChild(index, ci, { label: e.target.value })}
                      placeholder="Libellé"
                    />
                    <Input
                      className="flex-1 font-mono text-sm"
                      value={child.href}
                      onChange={(e) => updateMegaChild(index, ci, { href: e.target.value })}
                      placeholder="/page"
                    />
                    <Button type="button" variant="ghost" size="icon" onClick={() => removeMegaChild(index, ci)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button type="button" variant="outline" size="sm" onClick={() => addMegaChild(index)}>
                  <Plus className="mr-1 h-3 w-3" />
                  Sous-lien
                </Button>
              </div>
            </div>
          ))}
          <Button type="button" variant="outline" onClick={addMegaItem}>
            <Plus className="mr-2 h-4 w-4" />
            Entrée de menu
          </Button>
        </TabsContent>

        <TabsContent value="footer_links" className="space-y-4 mt-0">
          {footerLinks.columns.map((col, colIndex) => (
            <div key={colIndex} className="rounded-xl border border-border bg-card p-4 space-y-3">
              <div className="flex gap-2">
                <div className="flex-1">
                  <Label>Titre de colonne</Label>
                  <Input
                    className="mt-1"
                    value={col.title}
                    onChange={(e) => updateFooterColumn(colIndex, { title: e.target.value })}
                  />
                </div>
                <Button type="button" variant="ghost" size="icon" className="mt-6" onClick={() => removeFooterColumn(colIndex)}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
              {col.links.map((link, linkIndex) => (
                <div key={linkIndex} className="flex flex-wrap gap-2">
                  <Input
                    className="flex-1"
                    value={link.label}
                    onChange={(e) => updateFooterLink(colIndex, linkIndex, { label: e.target.value })}
                  />
                  <Input
                    className="flex-1 font-mono text-sm"
                    value={link.href}
                    onChange={(e) => updateFooterLink(colIndex, linkIndex, { href: e.target.value })}
                  />
                  <Button type="button" variant="ghost" size="icon" onClick={() => removeFooterLink(colIndex, linkIndex)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button type="button" variant="outline" size="sm" onClick={() => addFooterLink(colIndex)}>
                <Plus className="mr-1 h-3 w-3" />
                Lien
              </Button>
            </div>
          ))}
          <Button type="button" variant="outline" onClick={addFooterColumn}>
            <Plus className="mr-2 h-4 w-4" />
            Colonne
          </Button>
        </TabsContent>

        <TabsContent value="sticky_cta" className="space-y-4 mt-0 max-w-xl">
          <div>
            <Label>Texte</Label>
            <Input
              className="mt-1"
              value={stickyCta.text}
              onChange={(e) => setStickyCta((s) => ({ ...s, text: e.target.value }))}
            />
          </div>
          <div>
            <Label>Libellé du bouton</Label>
            <Input
              className="mt-1"
              value={stickyCta.ctaLabel}
              onChange={(e) => setStickyCta((s) => ({ ...s, ctaLabel: e.target.value }))}
            />
          </div>
          <div>
            <Label>Lien du bouton</Label>
            <Input
              className="mt-1 font-mono text-sm"
              value={stickyCta.ctaHref}
              onChange={(e) => setStickyCta((s) => ({ ...s, ctaHref: e.target.value }))}
            />
          </div>
          <div className="flex items-center gap-2">
            <Switch
              id="sticky-dismiss"
              checked={stickyCta.dismissible !== false}
              onCheckedChange={(checked) => setStickyCta((s) => ({ ...s, dismissible: checked }))}
            />
            <Label htmlFor="sticky-dismiss">Le visiteur peut masquer (session)</Label>
          </div>
        </TabsContent>

        <TabsContent value="app_bar" className="mt-0 max-w-md">
          <AppBarStylePanel
            value={appBar}
            onChange={(patch) => setAppBar((prev) => ({ ...prev, ...patch }))}
            onSave={save}
            saving={saveMutation.isPending}
          />
        </TabsContent>
      </Tabs>
    </AdminLayout>
  );
};

export default AdminGlobalSections;
