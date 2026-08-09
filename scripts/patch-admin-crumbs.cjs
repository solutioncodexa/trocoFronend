const fs = require('fs');
const path = require('path');
const dir = path.join(__dirname, '..', 'src', 'pages', 'admin');

const replacements = [
  [
    "{ label: 'Boutique en ligne', href: '/admin/boutique-en-ligne' }",
    "{ label: t('appearance.onlineStoreCrumb'), href: '/admin/boutique-en-ligne' }",
  ],
  ["{ label: 'Catégories accueil' }", "{ label: t('heroCategories.title') }"],
  ["breadcrumbs={[{ label: 'Intégrations' }, { label: 'Webhooks' }]}", "breadcrumbs={[{ label: t('nav.integrations') }, { label: t('webhooks.title') }]}"],
  ["aria-label=\"Supprimer\"", "aria-label={t('common.delete')}"],
  ["aria-label=\"Supprimer l’axe\"", "aria-label={t('common.delete')}"],
  ["aria-label=\"Supprimer l'axe\"", "aria-label={t('common.delete')}"],
  ["aria-label=\"Monter\"", "aria-label={t('common.moveUp')}"],
  ["aria-label=\"Descendre\"", "aria-label={t('common.moveDown')}"],
];

let n = 0;
for (const file of fs.readdirSync(dir).filter((f) => f.endsWith('.tsx'))) {
  const p = path.join(dir, file);
  let src = fs.readFileSync(p, 'utf8');
  const before = src;
  for (const [a, b] of replacements) {
    if (src.includes(a)) src = src.split(a).join(b);
  }
  // AdminStock tabs
  if (file === 'AdminStock.tsx') {
    src = src.replace(
      " { id: 'settings', label: 'Réglages', icon: Settings2 },",
      " { id: 'settings', label: t('nav.settings'), icon: Settings2 },",
    );
    src = src.replace(
      " { id: 'alerts', label: 'Alertes', icon: AlertTriangle },",
      " { id: 'alerts', label: t('stock.tabAlerts'), icon: AlertTriangle },",
    );
    src = src.replace(
      " { id: 'list', label: 'Liste stock', icon: Warehouse },",
      " { id: 'list', label: t('stock.tabList'), icon: Warehouse },",
    );
    src = src.replace(
      " { id: 'movements', label: 'Historique', icon: History },",
      " { id: 'movements', label: t('stock.tabHistory'), icon: History },",
    );
  }
  if (src !== before) {
    fs.writeFileSync(p, src);
    n++;
    console.log(file);
  }
}
console.log('done', n);
