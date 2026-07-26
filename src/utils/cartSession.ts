const CART_SESSION_KEY = 'cart_session_key';

export function getOrCreateCartSessionKey(): string {
  try {
    const existing = localStorage.getItem(CART_SESSION_KEY);
    if (existing?.trim()) return existing.trim();
    const key =
      typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID()
        : `sess_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
    localStorage.setItem(CART_SESSION_KEY, key);
    return key;
  } catch {
    return `sess_${Date.now()}`;
  }
}

export { CART_SESSION_KEY };
