export const PERMISSIONS = {
  PRODUCTS_VIEW: 'PRODUCTS_VIEW',
  PRODUCTS_CREATE: 'PRODUCTS_CREATE',
  PRODUCTS_UPDATE: 'PRODUCTS_UPDATE',
  PRODUCTS_DELETE: 'PRODUCTS_DELETE',
  ORDERS_VIEW: 'ORDERS_VIEW',
  ORDERS_UPDATE: 'ORDERS_UPDATE',
  STOCK_VIEW: 'STOCK_VIEW',
  STOCK_ADJUST: 'STOCK_ADJUST',
  CUSTOM_ORDERS_VIEW: 'CUSTOM_ORDERS_VIEW',
  CUSTOM_ORDERS_UPDATE: 'CUSTOM_ORDERS_UPDATE',
  CATALOG_MANAGE: 'CATALOG_MANAGE',
  CONTENT_MANAGE: 'CONTENT_MANAGE',
  STATS_VIEW: 'STATS_VIEW',
  MEMBERS_MANAGE: 'MEMBERS_MANAGE',
  AUDIT_VIEW: 'AUDIT_VIEW',
} as const;

export type PermissionCode = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

/** Si on coche X, on ajoute aussi Y (ex. gérer stock → voir stock). */
export const PERMISSION_IMPLIES: Partial<Record<string, string[]>> = {
  [PERMISSIONS.STOCK_ADJUST]: [PERMISSIONS.STOCK_VIEW],
  [PERMISSIONS.ORDERS_UPDATE]: [PERMISSIONS.ORDERS_VIEW],
  [PERMISSIONS.CUSTOM_ORDERS_UPDATE]: [PERMISSIONS.CUSTOM_ORDERS_VIEW],
  [PERMISSIONS.PRODUCTS_CREATE]: [PERMISSIONS.PRODUCTS_VIEW],
  [PERMISSIONS.PRODUCTS_UPDATE]: [PERMISSIONS.PRODUCTS_VIEW],
  [PERMISSIONS.PRODUCTS_DELETE]: [PERMISSIONS.PRODUCTS_VIEW],
};

/** Codes qui dépendent d'une permission « voir » (retirés si on décoche la vue). */
export const PERMISSION_DEPENDENTS: Partial<Record<string, string[]>> = {
  [PERMISSIONS.STOCK_VIEW]: [PERMISSIONS.STOCK_ADJUST],
  [PERMISSIONS.ORDERS_VIEW]: [PERMISSIONS.ORDERS_UPDATE],
  [PERMISSIONS.CUSTOM_ORDERS_VIEW]: [PERMISSIONS.CUSTOM_ORDERS_UPDATE],
  [PERMISSIONS.PRODUCTS_VIEW]: [
    PERMISSIONS.PRODUCTS_CREATE,
    PERMISSIONS.PRODUCTS_UPDATE,
    PERMISSIONS.PRODUCTS_DELETE,
  ],
};

export function expandPermissions(codes: string[]): string[] {
  const set = new Set(codes);
  for (const code of [...set]) {
    for (const implied of PERMISSION_IMPLIES[code] ?? []) {
      set.add(implied);
    }
  }
  return [...set];
}

/** Toggle avec implications UX : cocher « gérer » ajoute « voir » ; décocher « voir » retire « gérer ». */
export function togglePermissionSet(
  current: string[],
  code: string,
  checked: boolean
): string[] {
  const set = new Set(current);
  if (checked) {
    set.add(code);
    for (const implied of PERMISSION_IMPLIES[code] ?? []) {
      set.add(implied);
    }
  } else {
    set.delete(code);
    for (const dependent of PERMISSION_DEPENDENTS[code] ?? []) {
      set.delete(dependent);
    }
  }
  return expandPermissions([...set]);
}

export function hasEffectivePermission(
  granted: string[] | undefined,
  code: string,
  isAdmin = false
): boolean {
  if (isAdmin) return true;
  const set = new Set(granted ?? []);
  if (set.has(code)) return true;
  // VIEW effective si une permission « gérer » liée est présente
  for (const [action, views] of Object.entries(PERMISSION_IMPLIES)) {
    if (views.includes(code) && set.has(action)) return true;
  }
  return false;
}
