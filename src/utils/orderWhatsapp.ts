import { buildWhatsAppMessageUrl } from '@/utils/whatsappOrder';
import { whatsappDigits } from '@/utils/phone';

/**
 * Confirmation d'une commande (paiement à la livraison) par WhatsApp : le commerçant ouvre une conversation avec le
 * message déjà rédigé et l'envoie lui-même. Aucun compte WhatsApp Business n'est nécessaire, donc tous les plans.
 */

/** Numéro marocain en format international sans « + » (06 12 34 56 78 → 212612345678). `null` si inutilisable. */
export function customerWhatsAppNumber(phone?: string | null): string | null {
  return whatsappDigits(phone);
}

type Lang = 'fr' | 'en' | 'ar' | 'darija' | 'darija-ar';

export function normalizeMessageLang(locale?: string | null): Lang {
  const l = (locale ?? '').toLowerCase().slice(0, 2);
  return l === 'ar' || l === 'en' ? l : 'fr';
}

export type OrderMessageInput = {
  lang: Lang;
  storeName: string;
  customerName?: string | null;
  items: { name: string; quantity: number; variant?: string }[];
  total: string;
  city?: string | null;
};

/** Message de confirmation : récapitulatif de la commande et demande de réponse « oui » pour la valider. */
export function buildOrderConfirmationMessage(i: OrderMessageInput): string {
  const lines = i.items.filter((x) => x.name).map((x) => `• ${x.name}${x.variant ? ` (${x.variant})` : ''} × ${x.quantity}`);
  const name = i.customerName?.trim() ?? '';
  const where = i.city?.trim() ?? '';
  const text = {
    fr: [
      `Bonjour${name ? ` ${name}` : ''}, c’est ${i.storeName}.`,
      'Nous avons bien reçu votre commande :',
      ...lines,
      `Total à payer à la livraison : ${i.total}${where ? ` — livraison à ${where}` : ''}.`,
      'Pouvez-vous nous confirmer en répondant « OUI » ? Merci !',
    ],
    en: [
      `Hello${name ? ` ${name}` : ''}, this is ${i.storeName}.`,
      'We received your order:',
      ...lines,
      `Total to pay on delivery: ${i.total}${where ? ` — delivery to ${where}` : ''}.`,
      'Could you confirm by replying “YES”? Thank you!',
    ],
    ar: [
      `مرحبًا${name ? ` ${name}` : ''}، معكم ${i.storeName}.`,
      'توصّلنا بطلبكم:',
      ...lines,
      `المبلغ المطلوب عند الاستلام: ${i.total}${where ? ` — التوصيل إلى ${where}` : ''}.`,
      'هل يمكنكم تأكيد الطلب بالرد بكلمة «نعم»؟ شكرًا لكم!',
    ],
    darija: [
      `Salam${name ? ` ${name}` : ''}, m3akom ${i.storeName}.`,
      'Wesletna commande dyalek:',
      ...lines,
      `Total tkhalles f livraison: ${i.total}${where ? ` — l ${where}` : ''}.`,
      'Wach t2ekked lina b « OUI »? Chokran!',
    ],
    'darija-ar': [
      `السلام${name ? ` ${name}` : ''}، معكم ${i.storeName}.`,
      'وصلاتنا الطلبية ديالكم:',
      ...lines,
      `المجموع غادي تخلصوه فالليڤريزون: ${i.total}${where ? ` — ل${where}` : ''}.`,
      'واش تأكدوا لينا بالرد «نعم»؟ شكراً!',
    ],
  }[i.lang];
  return text.join('\n');
}

/** Lien `wa.me` prêt à ouvrir, ou `null` si le numéro du client est inutilisable. */
export function orderConfirmationUrl(phone: string | null | undefined, message: string): string | null {
  const digits = customerWhatsAppNumber(phone);
  return digits ? buildWhatsAppMessageUrl(digits, message) : null;
}
