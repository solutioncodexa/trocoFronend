import imageCompression, { type Options } from 'browser-image-compression';

export interface CompressImageOptions {
  maxSizeMB?: number;
  maxWidthOrHeight?: number;
  outputType?: 'image/webp' | 'image/jpeg' | 'image/png';
  initialQuality?: number;
  preservePngTransparency?: boolean;
  /** Afficher le détail dans la console (défaut : true). */
  log?: boolean;
}

export type CompressionStatus = 'compressed' | 'skipped' | 'unchanged' | 'error';

export interface CompressionReport {
  fileName: string;
  originalBytes: number;
  finalBytes: number;
  status: CompressionStatus;
  reason?: string;
}

const DEFAULTS: Required<Omit<CompressImageOptions, 'outputType' | 'log'>> & {
  outputType: NonNullable<CompressImageOptions['outputType']>;
} = {
  maxSizeMB: 2.5,
  maxWidthOrHeight: 3000,
  outputType: 'image/webp',
  initialQuality: 0.92,
  preservePngTransparency: false,
};

function fmtMB(bytes: number): string {
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function withExtensionFor(name: string, mimeType: string): string {
  const ext =
    mimeType === 'image/webp'
      ? 'webp'
      : mimeType === 'image/jpeg'
        ? 'jpg'
        : mimeType === 'image/png'
          ? 'png'
          : name.split('.').pop() || 'img';
  const base = name.replace(/\.[^.]+$/, '');
  return `${base}.${ext}`;
}

/** Message lisible pour toast / console. */
export function formatCompressionMessage(report: CompressionReport): string {
  switch (report.status) {
    case 'compressed': {
      const pct = Math.round((1 - report.finalBytes / report.originalBytes) * 100);
      return `${report.fileName} : ${fmtMB(report.originalBytes)} → ${fmtMB(report.finalBytes)} (${pct} % économisés)`;
    }
    case 'skipped':
      return `${report.fileName} : non optimisée (${report.reason ?? 'format non pris en charge'})`;
    case 'unchanged':
      return `${report.fileName} : déjà optimale (${fmtMB(report.finalBytes)})`;
    case 'error':
      return `${report.fileName} : optimisation impossible, fichier original conservé`;
    default:
      return report.fileName;
  }
}

export function logCompressionReport(report: CompressionReport): void {
  const msg = `[compressImage] ${formatCompressionMessage(report)}`;
  if (report.status === 'error') console.warn(msg);
  else console.log(msg);
}

export async function compressImageWithReport(
  file: File,
  opts: CompressImageOptions = {},
): Promise<{ file: File; report: CompressionReport }> {
  const { log = true, ...compressOpts } = opts;
  const baseReport = (status: CompressionStatus, finalFile: File, reason?: string): CompressionReport => ({
    fileName: file.name,
    originalBytes: file.size,
    finalBytes: finalFile.size,
    status,
    reason,
  });

  if (!file.type.startsWith('image/')) {
    const report = baseReport('skipped', file, 'pas une image');
    if (log) logCompressionReport(report);
    return { file, report };
  }
  if (file.type === 'image/svg+xml' || file.type === 'image/gif') {
    const report = baseReport('skipped', file, file.type);
    if (log) logCompressionReport(report);
    return { file, report };
  }

  const cfg = { ...DEFAULTS, ...compressOpts };
  const targetType =
    cfg.preservePngTransparency && file.type === 'image/png'
      ? 'image/png'
      : cfg.outputType;

  if (file.size <= cfg.maxSizeMB * 1024 * 1024 && file.type === targetType) {
    const report = baseReport('unchanged', file, `déjà ≤ ${cfg.maxSizeMB} MB en ${targetType}`);
    if (log) logCompressionReport(report);
    return { file, report };
  }

  const options: Options = {
    maxSizeMB: cfg.maxSizeMB,
    maxWidthOrHeight: cfg.maxWidthOrHeight,
    useWebWorker: true,
    fileType: targetType,
    initialQuality: cfg.initialQuality,
    alwaysKeepResolution: false,
  };

  try {
    const compressedBlob = await imageCompression(file, options);
    if (compressedBlob.size >= file.size) {
      const report = baseReport('unchanged', file, 'compression sans gain de taille');
      if (log) logCompressionReport(report);
      return { file, report };
    }

    const compressedFile = new File(
      [compressedBlob],
      withExtensionFor(file.name, targetType),
      { type: targetType, lastModified: Date.now() },
    );
    const report: CompressionReport = {
      fileName: file.name,
      originalBytes: file.size,
      finalBytes: compressedFile.size,
      status: 'compressed',
    };
    if (log) logCompressionReport(report);
    return { file: compressedFile, report };
  } catch (err) {
    const report = baseReport(
      'error',
      file,
      err instanceof Error ? err.message : 'erreur inconnue',
    );
    if (log) logCompressionReport(report);
    return { file, report };
  }
}

/** Compresse une image (retourne uniquement le fichier). */
export async function compressImage(
  file: File,
  opts: CompressImageOptions = {},
): Promise<File> {
  const { file: out } = await compressImageWithReport(file, opts);
  return out;
}
