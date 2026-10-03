import { describe, expect, it } from 'vitest';
import { buildFlow, isHexColor, isPhone, parseAmount, widgetForStep } from './assistantFlow';

const empty = {
  logoUrl: null,
  tagline: null,
  contactPhone: null,
  contactWhatsapp: null,
  paymentCodEnabled: false,
  freeShippingThreshold: null,
};

describe('assistantFlow', () => {
  it('plan Basic : ne pose jamais la question WhatsApp Business', () => {
    expect(buildFlow(empty, 'basic')).not.toContain('whatsappBusiness');
    expect(buildFlow(empty, null)).not.toContain('whatsappBusiness');
  });

  it('plans Pro et Business : posent la question WhatsApp Business, en dernier', () => {
    for (const plan of ['pro', 'business']) {
      const steps = buildFlow(empty, plan);
      expect(steps[steps.length - 1]).toBe('whatsappBusiness');
    }
  });

  it('boutique vide : toutes les étapes de base dans l’ordre', () => {
    expect(buildFlow(empty, 'basic')).toEqual(['logo', 'colors', 'tagline', 'phone', 'whatsapp', 'cod', 'freeShipping']);
  });

  it('ne repose pas une question dont la réponse existe déjà', () => {
    const done = {
      logoUrl: '/uploads/logo.png',
      tagline: 'Le meilleur du Maroc',
      contactPhone: '+212600000000',
      contactWhatsapp: '+212600000000',
      paymentCodEnabled: true,
      freeShippingThreshold: 500,
    };
    // Les couleurs sont toujours proposées : le commerçant peut vouloir en changer.
    expect(buildFlow(done, 'basic')).toEqual(['colors']);
  });

  it('valide les couleurs hexadécimales', () => {
    expect(isHexColor('#2563EB')).toBe(true);
    expect(isHexColor(' #2563eb ')).toBe(true);
    expect(isHexColor('2563EB')).toBe(false);
    expect(isHexColor('#25F')).toBe(false);
    expect(isHexColor('red')).toBe(false);
  });

  it('valide les numéros de téléphone', () => {
    expect(isPhone('+212 6 12 34 56 78')).toBe(true);
    expect(isPhone('0612345678')).toBe(true);
    expect(isPhone('abc')).toBe(false);
    expect(isPhone('12')).toBe(false);
    expect(isPhone('<script>alert(1)</script>')).toBe(false);
  });

  it('parse le montant de livraison gratuite', () => {
    expect(parseAmount('500')).toBe(500);
    expect(parseAmount('299,90')).toBe(299.9);
    expect(parseAmount('0')).toBeNull();
    expect(parseAmount('-5')).toBeNull();
    expect(parseAmount('abc')).toBeNull();
    expect(parseAmount('')).toBeNull();
  });

  it('associe un widget adapté à chaque étape', () => {
    expect(widgetForStep('logo')).toEqual({ kind: 'yesno', stepId: 'logo' });
    expect(widgetForStep('colors')).toEqual({ kind: 'colors' });
    expect(widgetForStep('phone')).toEqual({ kind: 'text', stepId: 'phone' });
    expect(widgetForStep('cod')).toEqual({ kind: 'yesno', stepId: 'cod' });
  });
});
