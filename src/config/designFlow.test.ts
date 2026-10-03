import { describe, expect, it } from 'vitest';
import {
  ABOUT_PAGE_SLUG,
  LEGAL_SLUGS,
  buildDesignFlow,
  buildThemePayload,
  normalizeSocialUrl,
  patchAppearance,
  themeOptions,
  validPromoText,
} from './designFlow';

const empty = { instagramUrl: null, facebookUrl: null, tiktokUrl: null, appearance: null };

describe('designFlow', () => {
  it('boutique vierge : propose tout, dans l’ordre', () => {
    expect(buildDesignFlow(empty, [])).toEqual([
      'theme', 'layout', 'search', 'promo', 'home', 'about', 'legal', 'instagram', 'facebook', 'tiktok',
    ]);
  });

  it('n’écrase jamais une page d’accueil existante et ne repose pas ce qui existe', () => {
    const pages = [
      { slug: 'accueil', isHome: true },
      { slug: ABOUT_PAGE_SLUG },
      ...LEGAL_SLUGS.map((slug) => ({ slug })),
    ];
    const steps = buildDesignFlow(
      { instagramUrl: 'https://instagram.com/x', facebookUrl: 'https://facebook.com/x', tiktokUrl: 'https://tiktok.com/@x', appearance: { headerPromoEnabled: true } },
      pages,
    );
    expect(steps).toEqual(['theme', 'layout', 'search']);
  });

  it('ne propose les pages légales que si l’une d’elles manque', () => {
    const pages = LEGAL_SLUGS.slice(0, 3).map((slug) => ({ slug }));
    expect(buildDesignFlow(empty, pages)).toContain('legal');
  });

  it('plan Basic : thèmes Bold et Élégant verrouillés, Classique et Minimal libres', () => {
    const opts = Object.fromEntries(themeOptions('basic', 'classic').map((o) => [o.key, o]));
    expect(opts.classic.locked).toBe(false);
    expect(opts.minimal.locked).toBe(false);
    expect(opts.bold.locked).toBe(true);
    expect(opts.elegant.locked).toBe(true);
    expect(opts.classic.active).toBe(true);
    expect(opts.bold.active).toBe(false);
  });

  it('plans Pro et Business : aucun thème verrouillé', () => {
    for (const plan of ['pro', 'business']) {
      expect(themeOptions(plan, 'classic').every((o) => !o.locked)).toBe(true);
    }
  });

  it('un nouveau thème reçoit son look par défaut, un thème déjà utilisé est simplement restauré', () => {
    expect(buildThemePayload('bold', true)).toEqual({ themeKey: 'bold' });
    const fresh = buildThemePayload('bold', false);
    expect(fresh.themeKey).toBe('bold');
    expect(fresh.primaryColor).toBeTruthy();
    expect(fresh.fontPair).toBeTruthy();
    expect(fresh.appearance).toBeTruthy();
  });

  it('modifier l’en-tête conserve le reste de l’apparence', () => {
    const base = patchAppearance(null, { headerPromoEnabled: true, headerPromoText: 'Livraison offerte' });
    const next = patchAppearance(base, { headerLayout: 'centered' });
    expect(next.headerLayout).toBe('centered');
    expect(next.headerPromoEnabled).toBe(true);
    expect(next.headerPromoText).toBe('Livraison offerte');
  });

  it('valide les liens de réseaux sociaux', () => {
    expect(normalizeSocialUrl('instagram', 'instagram.com/ma.boutique')).toBe('https://instagram.com/ma.boutique');
    expect(normalizeSocialUrl('instagram', 'https://www.instagram.com/ma.boutique/')).toBe('https://www.instagram.com/ma.boutique');
    expect(normalizeSocialUrl('facebook', 'https://fb.com/maboutique')).toBe('https://fb.com/maboutique');
    expect(normalizeSocialUrl('tiktok', 'https://tiktok.com/@maboutique')).toBe('https://tiktok.com/@maboutique');
    expect(normalizeSocialUrl('instagram', 'https://facebook.com/x')).toBeNull();
    expect(normalizeSocialUrl('instagram', 'https://instagram.com.evil.com/x')).toBeNull();
    expect(normalizeSocialUrl('instagram', 'javascript:alert(1)')).toBeNull();
    expect(normalizeSocialUrl('instagram', 'ftp://instagram.com/x')).toBeNull();
    expect(normalizeSocialUrl('instagram', 'insta gram')).toBeNull();
    expect(normalizeSocialUrl('instagram', '')).toBeNull();
  });

  it('valide le message d’annonce', () => {
    expect(validPromoText('Livraison gratuite dès 500 MAD')).toBe(true);
    expect(validPromoText('ab')).toBe(false);
    expect(validPromoText('<script>alert(1)</script>')).toBe(false);
    expect(validPromoText('x'.repeat(101))).toBe(false);
  });
});
