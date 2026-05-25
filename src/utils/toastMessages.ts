import { toast } from 'sonner';

const SECURITY_PATTERNS = [
  /unauthorized/i,
  /forbidden/i,
  /access denied/i,
  /token/i,
  /jwt/i,
  /session/i,
  /authentication/i,
  /cors/i,
  /csrf/i,
  /sql/i,
  /injection/i,
  /stack\s?trace/i,
  /internal server/i,
  /500/,
  /exception/i,
  /null\s?pointer/i,
  /\.java/i,
  /\.class/i,
  /spring/i,
  /hibernate/i,
  /failed to fetch/i,
  /network\s?error/i,
  /econnrefused/i,
  /timeout/i,
];

const GENERIC_ERROR = 'Une erreur est survenue. Veuillez réessayer.';
const NETWORK_ERROR = 'Connexion impossible. Vérifiez votre connexion internet.';
const SERVER_ERROR = 'Le serveur est temporairement indisponible. Réessayez dans un instant.';

function sanitizeErrorMessage(raw: string | undefined | null): string {
  if (!raw) return GENERIC_ERROR;

  const lower = raw.toLowerCase();

  if (lower.includes('network') || lower.includes('fetch') || lower.includes('econnrefused')) {
    return NETWORK_ERROR;
  }

  if (lower.includes('500') || lower.includes('internal server')) {
    return SERVER_ERROR;
  }

  for (const pattern of SECURITY_PATTERNS) {
    if (pattern.test(raw)) {
      return GENERIC_ERROR;
    }
  }

  return raw;
}

export function toastError(error: unknown, fallback?: string): void {
  const message = error instanceof Error ? error.message : typeof error === 'string' ? error : undefined;
  toast.error(sanitizeErrorMessage(message) || fallback || GENERIC_ERROR);
}

export function toastSuccess(message: string): void {
  toast.success(message);
}

export function toastInfo(message: string, options?: Parameters<typeof toast.info>[1]): void {
  toast.info(message, options);
}

export function toastWarning(message: string): void {
  toast.warning(message);
}

export { sanitizeErrorMessage };
