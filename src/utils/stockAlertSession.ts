const PENDING_KEY = 'troco_stock_alert_pending';

export function markStockAlertPending() {
  sessionStorage.setItem(PENDING_KEY, '1');
}

export function clearStockAlertPending() {
  sessionStorage.removeItem(PENDING_KEY);
}

export function isStockAlertPending(): boolean {
  return sessionStorage.getItem(PENDING_KEY) === '1';
}
