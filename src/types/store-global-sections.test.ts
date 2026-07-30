import { describe, it, expect } from 'vitest';
import { parseStickyCtaConfig, parseMegaMenuConfig } from './store-global-sections';

describe('parseStickyCtaConfig', () => {
  it('exige text, label et href', () => {
    expect(parseStickyCtaConfig({})).toBeNull();
    expect(parseStickyCtaConfig({ text: 'Promo', ctaLabel: 'Go' })).toBeNull();
    expect(
      parseStickyCtaConfig({
        text: 'Livraison offerte',
        ctaLabel: 'Boutique',
        ctaHref: '/boutique',
      }),
    ).toEqual({
      text: 'Livraison offerte',
      ctaLabel: 'Boutique',
      ctaHref: '/boutique',
      dismissible: true,
      style: 'bar',
      position: 'bottom',
    });
  });

  it('respecte dismissible=false', () => {
    const cfg = parseStickyCtaConfig({
      text: 'A',
      ctaLabel: 'B',
      ctaHref: '/c',
      dismissible: false,
    });
    expect(cfg?.dismissible).toBe(false);
  });

  it('parse style et position', () => {
    const cfg = parseStickyCtaConfig({
      text: 'Promo',
      ctaLabel: 'Go',
      ctaHref: '/boutique',
      style: 'pill',
      position: 'bottom-right',
    });
    expect(cfg?.style).toBe('pill');
    expect(cfg?.position).toBe('bottom-right');
  });
});

describe('parseMegaMenuConfig', () => {
  it('filtre les items incomplets', () => {
    const cfg = parseMegaMenuConfig({
      items: [
        { label: 'Boutique', href: '/boutique' },
        { label: 'Sans lien' },
        { label: 'Packs', href: '/packs', children: [{ label: 'Kraft', href: '/packs/kraft' }] },
      ],
    });
    expect(cfg.items).toHaveLength(2);
    expect(cfg.items[1].children).toHaveLength(1);
  });
});
