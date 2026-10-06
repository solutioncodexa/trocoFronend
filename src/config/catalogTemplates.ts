/**
 * Catalogue guidé par l'assistant : modèles de catégories par activité (fr / en / ar) et logique pure
 * de planification / validation. Les créations réelles passent par l'API existante (categoriesApi, productsApi).
 */
import { nameKey, slugify as baseSlugify } from '@/utils/slug';

export type Lang = 'fr' | 'en' | 'ar';
export type ActivityId = 'fashion' | 'beauty' | 'home' | 'tech' | 'food' | 'crafts';

export type CatNode = { id: string; names: Record<Lang, string>; children?: CatNode[] };

const n = (id: string, fr: string, en: string, ar: string, children?: CatNode[]): CatNode => ({
  id,
  names: { fr, en, ar },
  children,
});

export const ACTIVITIES: readonly ActivityId[] = ['fashion', 'beauty', 'home', 'tech', 'food', 'crafts'];

export const ACTIVITY_TREES: Record<ActivityId, CatNode[]> = {
  fashion: [
    n('femme', 'Femme', 'Women', 'نساء', [
      n('femme-robes', 'Robes', 'Dresses', 'فساتين'),
      n('femme-caftans', 'Caftans', 'Kaftans', 'قفاطين'),
      n('femme-sacs', 'Sacs', 'Bags', 'حقائب'),
      n('femme-djellabas', 'Djellabas', 'Djellabas', 'جلابيب'),
      n('femme-takchitas', 'Takchitas', 'Takchitas', 'تكشيطات'),
      n('femme-foulards', 'Foulards & hijabs', 'Scarves & hijabs', 'حجاب وأوشحة'),
    ]),
    n('homme', 'Homme', 'Men', 'رجال', [
      n('homme-chemises', 'Chemises', 'Shirts', 'قمصان'),
      n('homme-pantalons', 'Pantalons', 'Trousers', 'سراويل'),
      n('homme-chaussures', 'Chaussures', 'Shoes', 'أحذية'),
      n('homme-djellabas', 'Djellabas & jabadors', 'Djellabas & jabadors', 'جلابيب وجبادورات'),
      n('homme-babouches', 'Babouches', 'Babouches', 'بلغة'),
    ]),
    n('enfant', 'Enfant', 'Kids', 'أطفال', [
      n('enfant-garcons', 'Garçons', 'Boys', 'أولاد'),
      n('enfant-filles', 'Filles', 'Girls', 'بنات'),
    ]),
    n('accessoires', 'Accessoires', 'Accessories', 'إكسسوارات', [
      n('accessoires-bijoux', 'Bijoux', 'Jewelry', 'مجوهرات'),
      n('accessoires-montres', 'Montres', 'Watches', 'ساعات'),
    ]),
  ],
  beauty: [
    n('visage', 'Soins du visage', 'Face care', 'العناية بالبشرة', [
      n('visage-nettoyants', 'Nettoyants', 'Cleansers', 'منظفات'),
      n('visage-hydratants', 'Crèmes hydratantes', 'Moisturizers', 'مرطبات'),
      n('visage-serums', 'Sérums', 'Serums', 'سيروم'),
    ]),
    n('cheveux', 'Cheveux', 'Hair', 'الشعر', [
      n('cheveux-shampoings', 'Shampoings', 'Shampoos', 'شامبو'),
      n('cheveux-huiles', 'Huiles', 'Oils', 'زيوت'),
      n('cheveux-masques', 'Masques', 'Masks', 'أقنعة'),
    ]),
    n('maquillage', 'Maquillage', 'Makeup', 'مكياج', [
      n('maquillage-teint', 'Teint', 'Complexion', 'البشرة'),
      n('maquillage-yeux', 'Yeux', 'Eyes', 'العيون'),
      n('maquillage-levres', 'Lèvres', 'Lips', 'الشفاه'),
    ]),
    n('parfums', 'Parfums', 'Perfumes', 'عطور', [
      n('parfums-femme', 'Parfums femme', 'Women’s perfumes', 'عطور نسائية'),
      n('parfums-homme', 'Parfums homme', 'Men’s perfumes', 'عطور رجالية'),
      n('parfums-oud', 'Oud & musc', 'Oud & musk', 'عود ومسك'),
    ]),
    n('naturel', 'Cosmétiques naturels', 'Natural cosmetics', 'مستحضرات طبيعية', [
      n('naturel-argan', 'Huile d’argan', 'Argan oil', 'زيت الأركان'),
      n('naturel-savon-ghassoul', 'Savon beldi & ghassoul', 'Beldi soap & ghassoul', 'صابون بلدي وغاسول'),
      n('naturel-hammam', 'Hammam & gommage', 'Hammam & scrubs', 'حمام وتقشير'),
      n('naturel-henne', 'Henné & khôl', 'Henna & kohl', 'حناء وكحل'),
    ]),
  ],
  home: [
    n('salon', 'Salon', 'Living room', 'غرفة الجلوس', [
      n('salon-canapes', 'Canapés', 'Sofas', 'أرائك'),
      n('salon-tapis', 'Tapis', 'Rugs', 'زرابي'),
      n('salon-coussins', 'Coussins', 'Cushions', 'وسائد'),
      n('salon-marocains', 'Salons marocains', 'Moroccan sofas', 'صالونات مغربية'),
    ]),
    n('cuisine', 'Cuisine', 'Kitchen', 'المطبخ', [
      n('cuisine-vaisselle', 'Vaisselle', 'Tableware', 'أواني'),
      n('cuisine-ustensiles', 'Ustensiles', 'Utensils', 'أدوات'),
      n('cuisine-service-the', 'Théières & service à thé', 'Teapots & tea sets', 'براريد وخدمة الشاي'),
    ]),
    n('decoration', 'Décoration', 'Decor', 'ديكور', [
      n('decoration-luminaires', 'Luminaires', 'Lighting', 'إضاءة'),
      n('decoration-miroirs', 'Miroirs', 'Mirrors', 'مرايا'),
      n('decoration-vases', 'Vases', 'Vases', 'مزهريات'),
      n('decoration-zellige', 'Zellige & mosaïque', 'Zellige & mosaic', 'زليج وفسيفساء'),
    ]),
    n('chambre', 'Chambre', 'Bedroom', 'غرفة النوم', [
      n('chambre-linge', 'Linge de lit', 'Bedding', 'أغطية السرير'),
      n('chambre-matelas', 'Matelas', 'Mattresses', 'مراتب'),
    ]),
  ],
  tech: [
    n('telephones', 'Téléphones', 'Phones', 'الهواتف', [
      n('telephones-smartphones', 'Smartphones', 'Smartphones', 'هواتف ذكية'),
      n('telephones-coques', 'Coques et protections', 'Cases', 'أغطية وحماية'),
      n('telephones-chargeurs', 'Chargeurs', 'Chargers', 'شواحن'),
    ]),
    n('informatique', 'Informatique', 'Computers', 'الحواسيب', [
      n('informatique-portables', 'Ordinateurs portables', 'Laptops', 'حواسيب محمولة'),
      n('informatique-accessoires', 'Accessoires', 'Accessories', 'ملحقات'),
    ]),
    n('audio', 'Audio et TV', 'Audio and TV', 'الصوتيات والتلفاز', [
      n('audio-ecouteurs', 'Écouteurs', 'Headphones', 'سماعات'),
      n('audio-enceintes', 'Enceintes', 'Speakers', 'مكبرات الصوت'),
      n('audio-televisions', 'Télévisions', 'TVs', 'تلفزيونات'),
    ]),
    n('gaming', 'Gaming', 'Gaming', 'الألعاب', [
      n('gaming-consoles', 'Consoles', 'Consoles', 'منصات الألعاب'),
      n('gaming-manettes', 'Manettes', 'Controllers', 'أذرع التحكم'),
    ]),
  ],
  food: [
    n('epicerie', 'Épicerie', 'Grocery', 'البقالة', [
      n('epicerie-huiles', 'Huiles', 'Oils', 'زيوت'),
      n('epicerie-epices', 'Épices', 'Spices', 'توابل'),
      n('epicerie-conserves', 'Conserves', 'Canned goods', 'معلبات'),
      n('epicerie-amlou', 'Amlou & pâtes à tartiner', 'Amlou & spreads', 'أملو ومعجون الأركان'),
      n('epicerie-olives', 'Olives & cornichons', 'Olives & pickles', 'زيتون ومخللات'),
    ]),
    n('douceurs', 'Douceurs', 'Sweets', 'حلويات', [
      n('douceurs-patisseries', 'Pâtisseries', 'Pastries', 'معجنات'),
      n('douceurs-miel', 'Miel', 'Honey', 'عسل'),
      n('douceurs-chocolat', 'Chocolat', 'Chocolate', 'شوكولاتة'),
      n('douceurs-gateaux-marocains', 'Gâteaux marocains', 'Moroccan cookies', 'حلويات مغربية'),
      n('douceurs-dattes', 'Dattes & fruits secs', 'Dates & dried fruits', 'تمور وفواكه جافة'),
    ]),
    n('boissons', 'Boissons', 'Drinks', 'مشروبات', [
      n('boissons-the', 'Thé', 'Tea', 'شاي'),
      n('boissons-cafe', 'Café', 'Coffee', 'قهوة'),
      n('boissons-jus', 'Jus', 'Juices', 'عصائر'),
      n('boissons-eaux-florales', 'Eaux florales', 'Floral waters', 'مياه الزهر والورد'),
    ]),
  ],
  crafts: [
    n('poterie', 'Poterie', 'Pottery', 'الفخار', [
      n('poterie-tajines', 'Tajines', 'Tagines', 'طواجن'),
      n('poterie-assiettes', 'Assiettes', 'Plates', 'صحون'),
      n('poterie-zellige', 'Zellige', 'Zellige', 'زليج'),
    ]),
    n('textile', 'Textile', 'Textiles', 'النسيج', [
      n('textile-tapis', 'Tapis', 'Rugs', 'زرابي'),
      n('textile-poufs', 'Poufs', 'Poufs', 'بوفات'),
      n('textile-plaids', 'Plaids', 'Throws', 'أغطية'),
      n('textile-hanbels', 'Hanbels & couvertures', 'Hanbels & blankets', 'هنابل وأغطية'),
    ]),
    n('cuir', 'Cuir', 'Leather', 'الجلد', [
      n('cuir-babouches', 'Babouches', 'Babouches', 'بلغة'),
      n('cuir-sacs', 'Sacs en cuir', 'Leather bags', 'حقائب جلدية'),
      n('cuir-poufs', 'Poufs en cuir', 'Leather poufs', 'بوفات جلدية'),
    ]),
    n('cuivre', 'Cuivre & laiton', 'Copper & brass', 'النحاس والصفر', [
      n('cuivre-plateaux', 'Plateaux à thé', 'Tea trays', 'صواني الشاي'),
      n('cuivre-theieres', 'Théières', 'Teapots', 'براريد'),
      n('cuivre-lanternes', 'Lanternes ajourées', 'Pierced lanterns', 'فوانيس منقوشة'),
    ]),
    n('art', 'Art et décoration', 'Art and decor', 'فن وديكور', [
      n('art-lanternes', 'Lanternes', 'Lanterns', 'فوانيس'),
      n('art-tableaux', 'Tableaux', 'Paintings', 'لوحات'),
      n('art-thuya', 'Bois de thuya', 'Thuya wood', 'خشب العرعار'),
    ]),
  ],
};

export type LocalizedNode = { key: string; name: string; children: { key: string; name: string }[] };

export function localizeTree(activity: ActivityId, lang: Lang): LocalizedNode[] {
  return ACTIVITY_TREES[activity].map((p) => ({
    key: p.id,
    name: p.names[lang],
    children: (p.children ?? []).map((c) => ({ key: c.id, name: c.names[lang] })),
  }));
}

/** Slug latin (les noms arabes sont translittérés, jamais vides). */
export const slugify = (name: string) => baseSlugify(name);

export const uniqueSlug = (base: string, used: Set<string>) => {
  const slug = base || 'categorie';
  if (!used.has(slug)) return slug;
  let i = 2;
  while (used.has(`${slug}-${i}`)) i += 1;
  return `${slug}-${i}`;
};

export type SelectedCat = { key: string; name: string; parentKey: string | null };
export type ExistingCat = { id: number; slug: string; parentId?: number | null; name?: string; active?: boolean };
export type PlannedCat = { key: string; name: string; slug: string; parentKey: string | null };

/**
 * Plan de création sans doublon : une catégorie dont le slug existe déjà est réutilisée (même si
 * l'assistant est relancé), les autres reçoivent un slug unique. Les parents passent avant les enfants,
 * et un enfant coché garde toujours son parent.
 */
export function planCategoryCreation(
  selected: SelectedCat[],
  existing: ExistingCat[],
): { toCreate: PlannedCat[]; reuse: Record<string, number> } {
  const used = new Set(existing.map((e) => e.slug));
  const bySlug = new Map(existing.map((e) => [e.slug, e.id]));

  const keys = new Set(selected.map((s) => s.key));
  const missingParents = selected
    .filter((s) => s.parentKey && !keys.has(s.parentKey))
    .map((s) => s.parentKey as string);
  if (missingParents.length) {
    // Un enfant sans parent sélectionné : on le rattache à la racine plutôt que de perdre la catégorie.
    selected = selected.map((s) => (s.parentKey && missingParents.includes(s.parentKey) ? { ...s, parentKey: null } : s));
  }

  const ordered = [...selected].sort((a, b) => Number(a.parentKey !== null) - Number(b.parentKey !== null));
  const toCreate: PlannedCat[] = [];
  const reuse: Record<string, number> = {};
  const slugOfKey = new Map<string, string>();

  for (const s of ordered) {
    // Modèles : la clé est déjà un slug. Catégories saisies à la main (clé « custom:… ») : slug tiré du nom.
    const base = (s.key.startsWith('custom:') ? slugify(s.name) : slugify(s.key)) || slugify(s.name) || 'categorie';
    const existingId = bySlug.get(base);
    if (existingId !== undefined) {
      reuse[s.key] = existingId;
      slugOfKey.set(s.key, base);
      continue;
    }
    const slug = uniqueSlug(base, used);
    used.add(slug);
    slugOfKey.set(s.key, slug);
    toCreate.push({ key: s.key, name: s.name.trim(), slug, parentKey: s.parentKey });
  }
  return { toCreate, reuse };
}

/** Catégories activées, parents suivis de leurs enfants, avec un libellé « Parent › Enfant ». */
export function categoryOptions(cats: ExistingCat[]): { slug: string; label: string }[] {
  const active = cats.filter((c) => c.active !== false);
  const byId = new Map(active.map((c) => [c.id, c]));
  const name = (c: ExistingCat) => c.name ?? c.slug;
  const parents = active.filter((c) => !c.parentId || !byId.has(c.parentId)).sort((a, b) => name(a).localeCompare(name(b)));
  const out: { slug: string; label: string }[] = [];
  for (const p of parents) {
    out.push({ slug: p.slug, label: name(p) });
    active
      .filter((c) => c.parentId === p.id)
      .sort((a, b) => name(a).localeCompare(name(b)))
      .forEach((c) => out.push({ slug: c.slug, label: `${name(p)} › ${name(c)}` }));
  }
  return out;
}

export const validProductName = (v: string) => v.trim().length >= 3 && v.trim().length <= 200;
export const validDescription = (v: string) => v.trim().length >= 1 && v.trim().length <= 10000;

/** Stock : entier positif ou nul. */
export function parseStock(v: string): number | null {
  const t = v.trim();
  if (!/^\d{1,6}$/.test(t)) return null;
  return Number(t);
}

export const MAX_PHOTOS = 8;
export const MAX_PHOTO_BYTES = 10 * 1024 * 1024;

/** Photos acceptées : images uniquement, 10 Mo max chacune (limite du serveur), 8 au plus. */
export function checkPhotos(files: { type: string; size: number }[]): boolean {
  return (
    files.length > 0 &&
    files.length <= MAX_PHOTOS &&
    files.every((f) => f.type.startsWith('image/') && f.size <= MAX_PHOTO_BYTES)
  );
}

/**
 * Sous-catégories suggérées pour une catégorie parente, d’après les modèles (fr / en / ar).
 * Le nom de la catégorie est comparé sans tenir compte de la casse, des accents ni de la langue ;
 * les suggestions reviennent dans la langue dans laquelle le parent a été reconnu.
 */
export function suggestSubcategories(parentName: string): string[] {
  const key = nameKey(parentName);
  if (key.length < 2) return [];
  const langs: Lang[] = ['fr', 'en', 'ar'];
  const collect = (match: (rootKey: string) => boolean) => {
    const seen = new Set<string>();
    const out: string[] = [];
    for (const a of ACTIVITIES) {
      for (const root of ACTIVITY_TREES[a]) {
        for (const lang of langs) {
          if (!match(nameKey(root.names[lang]))) continue;
          for (const c of root.children ?? []) {
            const label = c.names[lang];
            const k = nameKey(label);
            if (seen.has(k)) continue;
            seen.add(k);
            out.push(label);
          }
        }
      }
    }
    return out;
  };
  const exact = collect((rootKey) => rootKey === key);
  if (exact.length > 0) return exact;
  // « Caftans femme » ↔ « Femme » : correspondance partielle, seulement pour des noms assez longs.
  return key.length >= 4 ? collect((rootKey) => rootKey.length >= 4 && (key.includes(rootKey) || rootKey.includes(key))) : [];
}
