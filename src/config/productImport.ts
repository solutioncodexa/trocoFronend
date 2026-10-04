/**
 * Import de produits depuis un fichier CSV (modèle Get STORE, export Shopify, WooCommerce, YouCan ou tableur).
 * Logique pure, sans réseau : lecture du CSV, reconnaissance des colonnes, validation ligne par ligne.
 * Les photos ne sont pas importées : elles s'ajoutent ensuite, le produit s'affiche avec une image par défaut.
 */

export const MAX_IMPORT_ROWS = 500;

// ───────────── Lecture du CSV ─────────────

/** Séparateur le plus probable d'après la première ligne (hors guillemets). */
export function detectDelimiter(text: string): ',' | ';' | '\t' {
  const firstLine = text.split(/\r?\n/, 1)[0] ?? '';
  let inQuotes = false;
  const counts = { ',': 0, ';': 0, '\t': 0 };
  for (const ch of firstLine) {
    if (ch === '"') inQuotes = !inQuotes;
    else if (!inQuotes && ch in counts) counts[ch as keyof typeof counts] += 1;
  }
  if (counts[';'] > counts[','] && counts[';'] >= counts['\t']) return ';';
  if (counts['\t'] > counts[','] && counts['\t'] > counts[';']) return '\t';
  return ',';
}

/** Lit un CSV (guillemets, guillemets doublés, retours à la ligne dans un champ, BOM). */
export function parseCsv(input: string): string[][] {
  const text = input.charCodeAt(0) === 0xfeff ? input.slice(1) : input; // BOM éventuel
  const delimiter = detectDelimiter(text);
  const rows: string[][] = [];
  let row: string[] = [];
  let field = '';
  let inQuotes = false;
  for (let i = 0; i < text.length; i += 1) {
    const ch = text[i];
    if (inQuotes) {
      if (ch === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i += 1;
        } else inQuotes = false;
      } else field += ch;
    } else if (ch === '"') inQuotes = true;
    else if (ch === delimiter) {
      row.push(field);
      field = '';
    } else if (ch === '\n' || ch === '\r') {
      if (ch === '\r' && text[i + 1] === '\n') i += 1;
      row.push(field);
      field = '';
      if (row.some((c) => c.trim() !== '')) rows.push(row);
      row = [];
    } else field += ch;
  }
  row.push(field);
  if (row.some((c) => c.trim() !== '')) rows.push(row);
  return rows;
}

// ───────────── Colonnes ─────────────

export type ImportField = 'name' | 'price' | 'compareAt' | 'category' | 'stock' | 'sku' | 'description' | 'shortDescription' | 'handle';

const fold = (s: string) =>
  s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();

/** Noms de colonnes reconnus (comparés sans accents ni majuscules). */
const ALIASES: Record<ImportField, string[]> = {
  name: ['name', 'nom', 'titre', 'title', 'produit', 'product', 'product name', 'nom du produit', 'designation'],
  price: ['price', 'prix', 'variant price', 'regular price', 'prix de vente', 'prix ttc', 'selling price', 'sale price'],
  compareAt: ['compare at price', 'variant compare at price', 'prix barre', 'ancien prix', 'original price', 'prix d origine'],
  category: ['category', 'categorie', 'categories', 'product category', 'type', 'product type', 'collection'],
  stock: ['stock', 'quantite', 'quantity', 'qty', 'variant inventory qty', 'inventory', 'stock quantity', 'quantite en stock'],
  sku: ['sku', 'variant sku', 'reference', 'ref', 'code article'],
  description: ['description', 'body html', 'body', 'content', 'long description', 'description longue'],
  shortDescription: ['short description', 'description courte', 'resume', 'summary'],
  handle: ['handle', 'slug', 'url handle'],
};

/** Colonne → champ, première correspondance gagnante ; « sale price » ne passe qu'en dernier recours pour le prix. */
export function mapHeaders(headers: string[]): { fields: Partial<Record<ImportField, number>>; ignored: string[] } {
  const fields: Partial<Record<ImportField, number>> = {};
  const used = new Set<number>();
  (Object.keys(ALIASES) as ImportField[]).forEach((field) => {
    // Pour le prix, on préfère « price » / « prix » à « sale price » : l'ordre de la liste fait foi.
    for (const alias of ALIASES[field]) {
      const idx = headers.findIndex((h, i) => !used.has(i) && fold(h) === alias);
      if (idx >= 0) {
        fields[field] = idx;
        used.add(idx);
        break;
      }
    }
  });
  const ignored = headers.filter((_, i) => !used.has(i) && headers[i].trim() !== '');
  return { fields, ignored };
}

// ───────────── Valeurs ─────────────

/** « 1 200,50 », « 199.00 MAD », « 1,200.50 » → nombre. `null` si illisible. */
export function parsePriceCell(raw: string): number | null {
  let v = raw.replace(/[^\d.,-]/g, '');
  if (!v || v === '-') return null;
  const lastComma = v.lastIndexOf(',');
  const lastDot = v.lastIndexOf('.');
  if (lastComma >= 0 && lastDot >= 0) {
    // Le dernier séparateur est la décimale, l'autre sépare les milliers.
    v = lastComma > lastDot ? v.replace(/\./g, '').replace(',', '.') : v.replace(/,/g, '');
  } else if (lastComma >= 0) {
    // « 1,200 » (3 chiffres après) = milliers ; « 12,50 » = décimale.
    v = /,\d{3}$/.test(v) && v.indexOf(',') === lastComma && v.length > 4 ? v.replace(',', '') : v.replace(',', '.');
  }
  const n = Number(v);
  return Number.isFinite(n) && n > 0 && n < 1_000_000 ? n : null;
}

export function parseStockCell(raw: string): number | null {
  const t = raw.trim();
  if (!t) return null;
  const n = Number(t.replace(/[^\d.-]/g, ''));
  return Number.isFinite(n) && n >= 0 && n <= 1_000_000 ? Math.floor(n) : null;
}

/** HTML d'une description Shopify / Woo → texte simple. */
export function htmlToText(html: string): string {
  return html
    .replace(/<\s*br\s*\/?>/gi, '\n')
    .replace(/<\/(p|div|li|h[1-6])\s*>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

/** Catégorie « A > B, C » (Woo) → dernier niveau de la première. */
export function pickCategory(raw: string): string {
  const first = raw.split(/[,|]/)[0] ?? '';
  const parts = first.split('>').map((p) => p.trim()).filter(Boolean);
  return parts[parts.length - 1] ?? '';
}

export const importSlug = (name: string) =>
  name
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);

// ───────────── Lignes ─────────────

export type ImportRowError = 'name' | 'price' | 'duplicate';

export type ImportRow = {
  line: number;
  name: string;
  price: number | null;
  originalPrice?: number;
  category: string;
  stock?: number;
  sku?: string;
  description: string;
  shortDescription?: string;
  errors: ImportRowError[];
};

export type ImportPlan = {
  rows: ImportRow[];
  ignoredColumns: string[];
  /** Colonnes obligatoires absentes : l'import ne peut pas continuer. */
  missing: ('name' | 'price')[];
  truncated: boolean;
};

/**
 * Transforme un tableau CSV en lignes validées. Pour les exports Shopify, les lignes suivantes d'un même produit
 * (variantes, images) n'ont pas de titre : elles sont ignorées, seule la première ligne compte.
 */
export function planImport(table: string[][], existingNames: string[] = []): ImportPlan {
  if (table.length === 0) return { rows: [], ignoredColumns: [], missing: ['name', 'price'], truncated: false };
  const { fields, ignored } = mapHeaders(table[0]);
  const missing: ('name' | 'price')[] = [];
  if (fields.name === undefined) missing.push('name');
  if (fields.price === undefined) missing.push('price');
  if (missing.length > 0) return { rows: [], ignoredColumns: ignored, missing, truncated: false };

  const cell = (r: string[], f: ImportField) => (fields[f] === undefined ? '' : (r[fields[f] as number] ?? '').trim());
  const seen = new Set(existingNames.map((n) => n.trim().toLowerCase()));
  const rows: ImportRow[] = [];
  let truncated = false;
  for (let i = 1; i < table.length; i += 1) {
    const r = table[i];
    const name = cell(r, 'name');
    // Ligne de variante / d'image d'un export Shopify : même « handle », pas de titre.
    if (!name && cell(r, 'handle')) continue;
    if (rows.length >= MAX_IMPORT_ROWS) {
      truncated = true;
      break;
    }
    const price = parsePriceCell(cell(r, 'price'));
    const compare = parsePriceCell(cell(r, 'compareAt'));
    const errors: ImportRowError[] = [];
    if (name.length < 2 || name.length > 200) errors.push('name');
    if (price === null) errors.push('price');
    if (name && seen.has(name.toLowerCase())) errors.push('duplicate');
    if (name) seen.add(name.toLowerCase());
    const rawDescription = cell(r, 'description');
    const description = htmlToText(rawDescription) || name;
    const stock = parseStockCell(cell(r, 'stock'));
    rows.push({
      line: i + 1,
      name,
      price,
      originalPrice: price !== null && compare !== null && compare > price ? compare : undefined,
      category: pickCategory(cell(r, 'category')),
      stock: stock ?? undefined,
      sku: cell(r, 'sku') || undefined,
      description: description.slice(0, 5000),
      shortDescription: htmlToText(cell(r, 'shortDescription')).slice(0, 300) || undefined,
      errors,
    });
  }
  return { rows, ignoredColumns: ignored, missing, truncated };
}

/** Modèle de fichier à télécharger (séparateur « ; » : s'ouvre correctement dans Excel en français). */
export const CSV_TEMPLATE = [
  'nom;prix;categorie;stock;sku;description',
  'T-shirt coton;149;Vêtements;20;TSH-001;T-shirt en coton épais',
  'Sac cabas;549;Accessoires;8;SAC-002;Grand sac en cuir',
].join('\n');
