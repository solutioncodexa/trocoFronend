import { useMemo, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Check, Minus } from 'lucide-react';
import { platformApi } from '@/services/api/platform';
import type { PlanMarketingDTO } from '@/types/api';
import { useAdmin } from '@/contexts/AdminContext';
import { useAdminLocale } from '@/contexts/AdminLocaleContext';
import { useOpenStorefront } from '@/hooks/useOpenStorefront';
import { useLandingMotion } from '@/hooks/useLandingMotion';
import { TRIAL_DAYS } from '@/config/site';
import { slugify } from '@/utils/slug';
import { buildStorefrontUrl } from '@/utils/storefrontUrl';
import { landingCopy, type LandingCopy } from './matjaronaCopy';

const FALLBACK_PLANS: PlanMarketingDTO[] = [
  {
    id: 1,
    code: 'basic',
    name: 'Basic',
    priceMad: 79,
    description: '',
    maxProducts: 50,
    maxStaff: 1,
    maxOrdersPerMonth: 100,
    maxPixels: 1,
    storageMb: 1024,
    customDomain: false,
    features: { themes: 'basic', pageBuilder: 'simple', abTesting: false, abandonedCart: false, whatsappBusiness: false, webhooks: 'none', support: 'email' },
  },
  {
    id: 2,
    code: 'pro',
    name: 'Pro',
    priceMad: 199,
    description: '',
    maxProducts: 500,
    maxStaff: 3,
    maxOrdersPerMonth: 1000,
    maxPixels: 3,
    storageMb: 10240,
    customDomain: true,
    features: { themes: 'all', pageBuilder: 'full', abTesting: true, abandonedCart: true, whatsappBusiness: true, webhooks: 'order_created', support: 'email_chat' },
  },
  {
    id: 3,
    code: 'business',
    name: 'Business',
    priceMad: 399,
    description: '',
    maxProducts: null,
    maxStaff: 10,
    maxOrdersPerMonth: null,
    maxPixels: null,
    storageMb: 51200,
    customDomain: true,
    features: { themes: 'all_early', pageBuilder: 'full_versions', abTesting: true, abandonedCart: true, abandonedCartAdvanced: true, whatsappBusiness: true, whatsappMultiTemplates: true, webhooks: 'all', support: 'priority' },
  },
];

const LOCALES = [
  { code: 'fr', label: 'Français' },
  { code: 'ar', label: 'العربية' },
  { code: 'en', label: 'English' },
] as const;

function fmtLimit(n: number | null | undefined, c: LandingCopy): string {
  if (n == null) return c.unlimited;
  return n.toLocaleString('fr-MA');
}

function planHighlights(plan: PlanMarketingDTO, c: LandingCopy): string[] {
  const f = plan.features ?? {};
  return [
    `${c.rowProducts} : ${fmtLimit(plan.maxProducts, c)}`,
    `${c.rowOrders} : ${fmtLimit(plan.maxOrdersPerMonth, c)}`,
    plan.customDomain ? c.rowDomain : c.subdomainOnly,
    f.abandonedCart ? c.rowAbandoned : c.rowPromo,
    f.whatsappBusiness ? c.rowWhatsapp : c.noWhatsapp,
  ];
}

type Cell = string | boolean;

function comparisonRows(c: LandingCopy): { label: string; value: (p: PlanMarketingDTO) => Cell }[] {
  return [
    { label: c.rowProducts, value: (p) => fmtLimit(p.maxProducts, c) },
    { label: c.rowStaff, value: (p) => (p.maxStaff === 1 ? c.ownerOnly : fmtLimit(p.maxStaff, c)) },
    { label: c.rowOrders, value: (p) => fmtLimit(p.maxOrdersPerMonth, c) },
    { label: c.rowDomain, value: (p) => !!p.customDomain },
    { label: c.rowThemes, value: (p) => (p.features?.themes === 'basic' ? c.themesTwo : c.themesAll) },
    { label: c.rowBuilder, value: (p) => (p.features?.abTesting ? c.builderFull : c.builderSimple) },
    { label: c.rowAbandoned, value: (p) => !!p.features?.abandonedCart },
    { label: c.rowPixels, value: (p) => fmtLimit(p.maxPixels, c) },
    { label: c.rowWhatsapp, value: (p) => !!p.features?.whatsappBusiness },
    { label: c.rowWebhooks, value: (p) => (p.features?.webhooks === 'all' ? c.webhooksAll : p.features?.webhooks === 'order_created' ? 'order.created' : false) },
    { label: c.rowStorage, value: (p) => (p.storageMb != null ? `${Math.round(p.storageMb / 1024)} GB` : '—') },
  ];
}

/** Adresse affichée sur le ticket : l'hôte réel de la boutique, sinon l'identifiant seul (dev local). */
function ticketAddress(slug: string): string {
  if (!slug) return '';
  try {
    const host = new URL(buildStorefrontUrl(slug)).host;
    return host.includes(slug) ? host : slug;
  } catch {
    return slug;
  }
}

const MatjaronaHome = () => {
  const { isAuthenticated } = useAdmin();
  const { locale, setLocale, dir } = useAdminLocale();
  const { canViewPublic, openStorefront } = useOpenStorefront();
  const c = landingCopy[locale] ?? landingCopy.fr;
  const [shopName, setShopName] = useState('');
  const rootRef = useRef<HTMLDivElement>(null);
  useLandingMotion(rootRef);

  const { data: plans = [] } = useQuery({
    queryKey: ['platform', 'plans'],
    queryFn: () => platformApi.getPlans(),
    staleTime: 10 * 60 * 1000,
  });

  const sortedPlans = useMemo(
    () => [...(plans.length > 0 ? plans : FALLBACK_PLANS)].sort((a, b) => Number(a.priceMad ?? 0) - Number(b.priceMad ?? 0)),
    [plans],
  );
  const rows = useMemo(() => comparisonRows(c), [c]);

  const trimmedName = shopName.trim();
  const slug = slugify(trimmedName);
  const address = ticketAddress(slug);
  const createHref = trimmedName ? `/creer-boutique?nom=${encodeURIComponent(trimmedName)}` : '/creer-boutique';
  const total = c.orderLines.reduce((sum, l) => sum + l.qty * l.price, 0);

  const dashboardActions = (
    <div className="gs-actions">
      <Link to="/admin" className="gs-btn gs-btn-lemon">{c.dashboard}</Link>
      {canViewPublic ? (
        <button type="button" onClick={openStorefront} className="gs-btn gs-btn-ghost">{c.viewShop}</button>
      ) : (
        <Link to="/admin/onboarding" className="gs-btn gs-btn-ghost">{c.finishSetup}</Link>
      )}
    </div>
  );

  return (
    <div ref={rootRef} className="gs-root" dir={dir} lang={locale}>
      <style>{CSS}</style>

      <section className="gs-hero">
        <header className="gs-bar">
          <span className="gs-mark">Get STORE</span>
          <nav className="gs-bar-end" aria-label={c.navLabel}>
            <div className="gs-langs" role="group" aria-label={c.langLabel}>
              {LOCALES.map((l) => (
                <button
                  key={l.code}
                  type="button"
                  lang={l.code}
                  aria-pressed={locale === l.code}
                  onClick={() => setLocale(l.code)}
                  className="gs-lang"
                >
                  {l.label}
                </button>
              ))}
            </div>
            <Link to="/admin" className="gs-login">{isAuthenticated ? c.dashboard : c.login}</Link>
          </nav>
        </header>

        <div className="gs-hero-grid">
          <div className="gs-hero-copy">
            <h1 className="gs-h1">{c.heroTitle}</h1>
            <p className="gs-lede">{c.heroText}</p>

            {isAuthenticated ? (
              dashboardActions
            ) : (
              <form
                className="gs-start"
                onSubmit={(e) => {
                  e.preventDefault();
                  window.location.assign(createHref);
                }}
              >
                <label htmlFor="gs-shop-name" className="gs-start-label">{c.nameLabel}</label>
                <div className="gs-start-row">
                  <input
                    id="gs-shop-name"
                    value={shopName}
                    onChange={(e) => setShopName(e.target.value.slice(0, 40))}
                    placeholder={c.namePlaceholder}
                    autoComplete="off"
                    className="gs-input"
                  />
                  <Link to={createHref} className="gs-btn gs-btn-lemon">{c.createShop}</Link>
                </div>
                <p className="gs-note">{c.trialNote.replace('{days}', String(TRIAL_DAYS))}</p>
              </form>
            )}
          </div>

          <div className="gs-slip-wrap" aria-label={c.slipLabel} role="img">
            <div className="gs-slip" aria-hidden>
              <div className="gs-line" style={{ ['--i' as string]: 0 }}>
                <p className={`gs-slip-shop ${trimmedName ? '' : 'is-empty'}`}>{trimmedName || c.namePlaceholder}</p>
                <p className="gs-slip-addr">{address || c.addressPlaceholder}</p>
              </div>
              <div className="gs-line gs-slip-meta" style={{ ['--i' as string]: 1 }}>
                <span>{c.orderNo} 0412</span>
                <span>{c.orderChannel}</span>
              </div>
              <ul className="gs-slip-items">
                {c.orderLines.map((l, i) => (
                  <li key={l.name} className="gs-line" style={{ ['--i' as string]: i + 2 }}>
                    <span>{l.qty} × {l.name}</span>
                    <span className="gs-num">{l.qty * l.price} {c.currency}</span>
                  </li>
                ))}
              </ul>
              <div className="gs-line gs-slip-total" style={{ ['--i' as string]: c.orderLines.length + 2 }}>
                <span>{c.total}</span>
                <span className="gs-num">{total} {c.currency}</span>
              </div>
              <p className="gs-line gs-slip-pay" style={{ ['--i' as string]: c.orderLines.length + 3 }}>{c.payOnDelivery}</p>
              <span className="gs-stamp">{c.stamp}</span>
            </div>
          </div>
        </div>
      </section>

      <section className="gs-section" aria-labelledby="gs-features">
        <h2 id="gs-features" className="gs-h2">{c.featuresTitle}</h2>
        <ul className="gs-ledger">
          {c.features.map((f) => (
            <li key={f.title} className="gs-ledger-row">
              <h3 className="gs-ledger-title">{f.title}</h3>
              <p className="gs-ledger-text">{f.text}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="gs-section gs-steps-section" aria-labelledby="gs-steps">
        <h2 id="gs-steps" className="gs-h2">{c.stepsTitle}</h2>
        <ol className="gs-steps">
          {c.steps.map((s, i) => (
            <li key={s.title} className="gs-step">
              <span className="gs-step-n" aria-hidden>{(i + 1).toLocaleString(locale === 'ar' ? 'ar-MA' : 'fr-MA')}</span>
              <h3 className="gs-step-title">{s.title}</h3>
              <p className="gs-step-text">{s.text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section id="tarifs" className="gs-section" aria-labelledby="gs-pricing">
        <h2 id="gs-pricing" className="gs-h2">{c.pricingTitle}</h2>
        <p className="gs-section-lede">{c.pricingText.replace('{days}', String(TRIAL_DAYS))}</p>

        <div className="gs-plans">
          {sortedPlans.map((plan, index) => {
            const featured = index === 1;
            return (
              <article key={plan.code} className={`gs-plan ${featured ? 'is-featured' : ''}`}>
                <h3 className="gs-plan-name">{plan.name}</h3>
                <p className="gs-plan-price">
                  <span className="gs-num gs-plan-amount">{Number(plan.priceMad)}</span>
                  <span className="gs-plan-unit">{c.currency} {c.perMonth}</span>
                </p>
                <ul className="gs-plan-list">
                  {planHighlights(plan, c).map((line) => (
                    <li key={line}>
                      <Check className="gs-ico" aria-hidden />
                      <span>{line}</span>
                    </li>
                  ))}
                </ul>
                <Link to={`/creer-boutique?plan=${encodeURIComponent(plan.code)}`} className={`gs-btn ${featured ? 'gs-btn-night' : 'gs-btn-line'}`}>
                  {c.choosePlan.replace('{plan}', plan.name)}
                </Link>
              </article>
            );
          })}
        </div>

        <div className="gs-table-wrap">
          <table className="gs-table">
            <caption className="gs-sr">{c.compareCaption}</caption>
            <thead>
              <tr>
                <th scope="col">{c.compareFeature}</th>
                {sortedPlans.map((p) => (
                  <th key={p.code} scope="col">{p.name}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.label}>
                  <th scope="row">{row.label}</th>
                  {sortedPlans.map((p) => {
                    const v = row.value(p);
                    return (
                      <td key={p.code}>
                        {typeof v === 'boolean' ? (
                          v ? <Check className="gs-ico" aria-label={c.yes} /> : <Minus className="gs-ico gs-ico-off" aria-label={c.no} />
                        ) : (
                          v
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="gs-closing">
        <h2 className="gs-h2 gs-closing-title">{c.closingTitle}</h2>
        {isAuthenticated ? (
          dashboardActions
        ) : (
          <div className="gs-actions">
            <Link to="/creer-boutique" className="gs-btn gs-btn-lemon">{c.createShop}</Link>
            <Link to="/admin" className="gs-btn gs-btn-ghost">{c.login}</Link>
          </div>
        )}
      </section>

      <footer className="gs-footer">
        <span>© {new Date().getFullYear()} Get STORE</span>
        <span className="gs-footer-links">
          <Link to="/confidentialite">{c.privacy}</Link>
          <Link to="/conditions-utilisation">{c.terms}</Link>
        </span>
      </footer>
    </div>
  );
};

const CSS = `
.gs-root {
  --blue: #2336c4;
  --blue-soft: #3a4ed6;
  --night: #0e1650;
  --plaster: #f5f7fc;
  --rule: #d5daee;
  --pink: #e8386f;
  --lemon: #f2d54b;
  --body: 'Readex Pro', 'Figtree', ui-sans-serif, sans-serif;
  --display: 'Bricolage Grotesque', 'Readex Pro', ui-sans-serif, sans-serif;
  background: var(--plaster);
  color: var(--night);
  font-family: var(--body);
  font-weight: 400;
  line-height: 1.6;
  min-height: 100vh;
}
.gs-root[lang='ar'] { --display: 'Reem Kufi', 'Readex Pro', ui-sans-serif, sans-serif; line-height: 1.85; }
.gs-root *, .gs-root *::before, .gs-root *::after { box-sizing: border-box; }
.gs-root :where(h1, h2, h3, p, ul, ol) { margin: 0; padding: 0; }
.gs-root :where(ul, ol) { list-style: none; }
.gs-root a, .gs-root button { font: inherit; }
.gs-root :focus-visible { outline: 3px solid var(--lemon); outline-offset: 3px; }
.gs-section :focus-visible, .gs-table-wrap :focus-visible { outline-color: var(--blue); }
.gs-num { font-variant-numeric: tabular-nums; }
.gs-sr { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }

/* Hero */
.gs-hero { background: var(--blue); color: #fff; padding-bottom: clamp(4rem, 9vw, 7rem); overflow: hidden; }
.gs-bar { display: flex; align-items: center; justify-content: space-between; gap: 1rem; max-width: 72rem; margin: 0 auto; padding: 1.25rem clamp(1.25rem, 4vw, 2rem); }
.gs-mark { white-space: nowrap; font-family: 'Bricolage Grotesque', sans-serif; font-weight: 800; font-size: 1.4rem; letter-spacing: -0.02em; }
.gs-bar-end { display: flex; align-items: center; gap: 1.25rem; flex-wrap: wrap; justify-content: flex-end; }
.gs-langs { display: flex; gap: 0.25rem; }
.gs-lang { background: none; border: 0; color: rgba(255,255,255,.72); padding: 0.4rem 0.6rem; border-radius: 0.4rem; cursor: pointer; font-size: 0.875rem; }
.gs-lang:hover { color: #fff; }
.gs-lang[aria-pressed='true'] { color: var(--night); background: #fff; font-weight: 500; }
.gs-login { color: #fff; font-size: 0.875rem; text-decoration: underline; text-underline-offset: 4px; text-decoration-color: rgba(255,255,255,.5); }
.gs-login:hover { text-decoration-color: #fff; }

.gs-hero-grid { max-width: 72rem; margin: 0 auto; padding: clamp(2rem, 6vw, 4.5rem) clamp(1.25rem, 4vw, 2rem) 0; display: grid; gap: 3.5rem; align-items: center; }
@media (min-width: 62rem) { .gs-hero-grid { grid-template-columns: minmax(0, 1.15fr) minmax(0, 0.85fr); gap: 4rem; } }
.gs-h1 { font-family: var(--display); font-weight: 800; font-size: clamp(2.6rem, 6.6vw, 5rem); line-height: 1.02; letter-spacing: -0.03em; text-wrap: balance; }
.gs-root[lang='ar'] .gs-h1 { font-weight: 700; letter-spacing: 0; line-height: 1.3; }
.gs-lede { margin-top: 1.5rem; max-width: 34rem; font-size: 1.125rem; color: rgba(255,255,255,.88); }

.gs-start { margin-top: 2.25rem; max-width: 34rem; }
.gs-start-label { display: block; font-size: 0.9rem; font-weight: 500; margin-bottom: 0.5rem; }
.gs-start-row { display: flex; flex-wrap: wrap; gap: 0.75rem; }
.gs-input { flex: 1 1 14rem; min-width: 0; height: 3.25rem; border-radius: 0.6rem; border: 2px solid transparent; padding: 0 1rem; font-size: 1rem; background: #fff; color: var(--night); }
.gs-input::placeholder { color: #6b73a8; }
.gs-note { margin-top: 0.75rem; font-size: 0.875rem; color: rgba(255,255,255,.8); }

.gs-actions { display: flex; flex-wrap: wrap; gap: 0.75rem; margin-top: 2.25rem; }
.gs-btn { display: inline-flex; align-items: center; justify-content: center; height: 3.25rem; padding: 0 1.5rem; border-radius: 0.6rem; font-weight: 600; font-size: 1rem; text-decoration: none; cursor: pointer; border: 2px solid transparent; transition: background-color .15s, color .15s, border-color .15s; white-space: nowrap; }
.gs-btn-lemon { background: var(--lemon); color: var(--night); }
.gs-btn-lemon:hover { background: #f7e27a; }
.gs-btn-ghost { background: transparent; color: #fff; border-color: rgba(255,255,255,.55); }
.gs-btn-ghost:hover { border-color: #fff; background: rgba(255,255,255,.08); }
.gs-btn-night { background: var(--night); color: #fff; }
.gs-btn-night:hover { background: #1b2570; }
.gs-btn-line { background: transparent; color: var(--night); border-color: var(--night); }
.gs-btn-line:hover { background: var(--night); color: #fff; }

/* The slip */
.gs-slip-wrap { display: flex; justify-content: center; padding: 0.5rem 0 1.5rem; }
.gs-slip { position: relative; width: min(100%, 22rem); background: #fff; color: var(--night); padding: 1.75rem 1.5rem 2.75rem; transform: rotate(2.2deg); box-shadow: 0 1.5rem 3rem -1rem rgba(6,12,70,.55); font-size: 0.95rem; }
.gs-root[dir='rtl'] .gs-slip { transform: rotate(-2.2deg); }
.gs-slip::after { content: ''; position: absolute; inset-inline: 0; bottom: -1px; height: 12px; background: radial-gradient(circle at 9px 12px, var(--blue) 8px, transparent 8.5px) 0 0 / 18px 12px repeat-x; }
.gs-slip-shop { font-family: var(--display); font-weight: 800; font-size: 1.6rem; line-height: 1.15; letter-spacing: -0.02em; overflow-wrap: anywhere; }
.gs-slip-shop.is-empty { color: #9aa1cf; }
.gs-slip-addr { margin-top: 0.25rem; font-size: 0.85rem; color: #4a5390; overflow-wrap: anywhere; }
.gs-slip-meta { display: flex; justify-content: space-between; gap: 1rem; margin-top: 1.25rem; padding: 0.6rem 0; border-block: 2px dashed var(--rule); font-size: 0.85rem; color: #4a5390; }
.gs-slip-items { margin-top: 0.9rem; display: grid; gap: 0.5rem; }
.gs-slip-items li { display: flex; justify-content: space-between; gap: 1rem; }
.gs-slip-total { display: flex; justify-content: space-between; gap: 1rem; margin-top: 1rem; padding-top: 0.75rem; border-top: 2px solid var(--night); font-weight: 700; font-size: 1.15rem; }
.gs-slip-pay { margin-top: 0.75rem; font-size: 0.85rem; color: #4a5390; max-width: 12rem; }
.gs-stamp { position: absolute; inset-inline-end: 1rem; bottom: 2.2rem; background: var(--lemon); color: var(--night); font-family: var(--display); font-weight: 800; font-size: 1.05rem; line-height: 1.15; text-align: center; padding: 0.55rem 0.8rem; border: 3px solid var(--night); border-radius: 0.4rem; transform: rotate(-9deg); max-width: 8rem; }

@keyframes gs-print { from { clip-path: inset(0 0 100% 0); opacity: 0; transform: translateY(-6px); } to { clip-path: inset(0 0 0 0); opacity: 1; transform: none; } }
@keyframes gs-stamp { from { opacity: 0; transform: rotate(-9deg) scale(1.9); } to { opacity: 1; transform: rotate(-9deg) scale(1); } }
.gs-line { animation: gs-print .45s cubic-bezier(.2,.7,.2,1) both; animation-delay: calc(var(--i, 0) * 0.28s + 0.25s); }
.gs-stamp { animation: gs-stamp .3s cubic-bezier(.2,.9,.3,1.2) both; animation-delay: 2.3s; }
@media (prefers-reduced-motion: reduce) { .gs-line, .gs-stamp { animation: none; } }

/* Sections */
.gs-section { max-width: 72rem; margin: 0 auto; padding: clamp(4rem, 9vw, 7rem) clamp(1.25rem, 4vw, 2rem) 0; }
.gs-h2 { font-family: var(--display); font-weight: 800; font-size: clamp(1.9rem, 4vw, 3rem); line-height: 1.08; letter-spacing: -0.025em; max-width: 24ch; text-wrap: balance; }
.gs-root[lang='ar'] .gs-h2 { font-weight: 700; letter-spacing: 0; line-height: 1.35; }
.gs-section-lede { margin-top: 1rem; max-width: 36rem; color: #3b4580; }

.gs-ledger { margin-top: 2.5rem; border-top: 2px solid var(--night); }
.gs-ledger-row { display: grid; gap: 0.35rem 3rem; padding: 1.4rem 0; border-bottom: 1px solid var(--rule); }
@media (min-width: 48rem) { .gs-ledger-row { grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr); align-items: baseline; } }
.gs-ledger-title { font-family: var(--display); font-weight: 700; font-size: 1.35rem; line-height: 1.25; letter-spacing: -0.01em; }
.gs-ledger-text { color: #3b4580; max-width: 34rem; }

.gs-steps { margin-top: 2.5rem; display: grid; gap: 2.5rem; counter-reset: s; }
@media (min-width: 48rem) { .gs-steps { grid-template-columns: repeat(3, 1fr); gap: 2rem; } }
.gs-step { position: relative; padding-top: 1.5rem; border-top: 2px solid var(--night); }
.gs-step-n { display: inline-grid; place-items: center; width: 2.5rem; height: 2.5rem; border-radius: 50%; background: var(--lemon); color: var(--night); font-family: var(--display); font-weight: 800; font-size: 1.1rem; }
.gs-step-title { margin-top: 1rem; font-family: var(--display); font-weight: 700; font-size: 1.3rem; line-height: 1.25; }
.gs-step-text { margin-top: 0.5rem; color: #3b4580; max-width: 22rem; }

/* Pricing */
.gs-plans { margin-top: 2.75rem; display: grid; gap: 1rem; }
@media (min-width: 52rem) { .gs-plans { grid-template-columns: repeat(3, 1fr); gap: 0; } }
.gs-plan { display: flex; flex-direction: column; padding: 2rem 1.75rem; border: 1px solid var(--rule); background: #fff; }
@media (min-width: 52rem) { .gs-plan + .gs-plan { border-inline-start: 0; } .gs-plan.is-featured { margin-block: -1rem; padding-block: 3rem; } }
.gs-plan.is-featured { background: var(--pink); color: var(--night); border-color: var(--pink); }
.gs-plan-name { font-family: var(--display); font-weight: 700; font-size: 1.35rem; }
.gs-plan-price { margin-top: 0.75rem; display: flex; align-items: baseline; gap: 0.5rem; }
.gs-plan-amount { font-family: var(--display); font-weight: 800; font-size: 3.25rem; line-height: 1; letter-spacing: -0.03em; }
.gs-plan-unit { font-size: 0.95rem; }
.gs-plan-list { margin: 1.5rem 0 2rem; display: grid; gap: 0.65rem; flex: 1; font-size: 0.95rem; }
.gs-plan-list li { display: flex; gap: 0.6rem; align-items: flex-start; }
.gs-ico { width: 1.1rem; height: 1.1rem; flex-shrink: 0; margin-top: 0.3rem; color: var(--blue); }
.gs-plan.is-featured .gs-ico { color: var(--night); }
.gs-ico-off { color: #9aa1cf; }

.gs-table-wrap { margin-top: 4rem; overflow-x: auto; }
.gs-table { width: 100%; min-width: 38rem; border-collapse: collapse; font-size: 0.95rem; }
.gs-table th, .gs-table td { padding: 0.8rem 0.75rem; text-align: start; border-bottom: 1px solid var(--rule); vertical-align: middle; }
.gs-table thead th { border-bottom: 2px solid var(--night); font-family: var(--display); font-weight: 700; font-size: 1.05rem; }
.gs-table tbody th { font-weight: 400; color: #3b4580; }
.gs-table td .gs-ico { margin-top: 0; display: block; }

/* Closing */
.gs-closing { margin-top: clamp(4rem, 9vw, 7rem); background: var(--blue); color: #fff; padding: clamp(3.5rem, 8vw, 6rem) clamp(1.25rem, 4vw, 2rem); }
.gs-closing > * { max-width: 68rem; margin-inline: auto; }
.gs-closing > .gs-closing-title { max-width: 68rem; }
.gs-closing .gs-actions { display: flex; }
.gs-footer { background: var(--night); color: rgba(255,255,255,.75); display: flex; flex-wrap: wrap; justify-content: space-between; gap: 1rem; padding: 1.5rem clamp(1.25rem, 4vw, 2rem); font-size: 0.875rem; }
.gs-footer-links { display: flex; gap: 1.5rem; }
.gs-footer a { color: inherit; text-underline-offset: 3px; }
.gs-footer a:hover { color: #fff; }
`;

export default MatjaronaHome;
