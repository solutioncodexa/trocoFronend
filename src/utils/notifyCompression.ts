import { toast } from 'sonner';
import {
  formatCompressionMessage,
  type CompressionReport,
} from '@/utils/compressImage';

/** Toast visible après optimisation (en plus des logs console). */
export function notifyCompressionReports(reports: CompressionReport[]): void {
  if (reports.length === 0) return;

  const compressed = reports.filter((r) => r.status === 'compressed');
  const unchanged = reports.filter((r) => r.status === 'unchanged');
  const skipped = reports.filter((r) => r.status === 'skipped' || r.status === 'error');

  if (compressed.length === 1 && reports.length === 1) {
    toast.success('Image optimisée', {
      description: formatCompressionMessage(compressed[0]),
      duration: 5000,
    });
    return;
  }

  if (compressed.length > 0) {
    const totalBefore = compressed.reduce((s, r) => s + r.originalBytes, 0);
    const totalAfter = compressed.reduce((s, r) => s + r.finalBytes, 0);
    const pct = Math.round((1 - totalAfter / totalBefore) * 100);
    toast.success(
      compressed.length === 1 ? 'Image optimisée' : `${compressed.length} images optimisées`,
      {
        description: `${(totalBefore / (1024 * 1024)).toFixed(1)} MB → ${(totalAfter / (1024 * 1024)).toFixed(1)} MB (${pct} % économisés)`,
        duration: 5000,
      },
    );
  } else if (unchanged.length > 0 && skipped.length === 0) {
    toast.info('Image déjà optimale', {
      description: formatCompressionMessage(unchanged[0]),
      duration: 4000,
    });
  } else if (skipped.length > 0) {
    toast.info('Image non modifiée', {
      description: formatCompressionMessage(skipped[0]),
      duration: 4000,
    });
  }
}
