import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { compressImageWithReport } from '@/utils/compressImage';
import { notifyCompressionReports } from '@/utils/notifyCompression';

const MAX_INPUT_SIZE_MB = 20;
const COMPRESSION_OPTS = {
  maxSizeMB: 2.5,
  maxWidthOrHeight: 3000,
  outputType: 'image/webp' as const,
  initialQuality: 0.92,
};

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  onUpload?: (file: File) => Promise<string>;
  placeholder?: string;
  className?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  value,
  onChange,
  onUpload,
  placeholder = "URL de l'image ou uploadez une image",
  className = "",
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [optimizing, setOptimizing] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(value);

  React.useEffect(() => {
    setPreviewUrl(value);
  }, [value]);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const rawFile = event.target.files?.[0];
    if (!rawFile) return;

    if (!rawFile.type.startsWith('image/')) {
      toast.error('Veuillez sélectionner une image valide (JPG, PNG, WebP, GIF, SVG).');
      return;
    }

    if (rawFile.size > MAX_INPUT_SIZE_MB * 1024 * 1024) {
      toast.error(`L'image ne doit pas dépasser ${MAX_INPUT_SIZE_MB} MB.`);
      return;
    }

    let file = rawFile;

    // Sans handler API : on compresse ici. Avec onUpload (ex. uploadImage), la compression est faite côté upload.
    if (!onUpload) {
      setOptimizing(true);
      try {
        const { file: compressed, report } = await compressImageWithReport(rawFile, COMPRESSION_OPTS);
        file = compressed;
        notifyCompressionReports([report]);
      } catch (err) {
        console.warn('Compression impossible, envoi du fichier original :', err);
        file = rawFile;
      } finally {
        setOptimizing(false);
      }
    }

    setUploading(true);
    try {
      let url: string;

      if (onUpload) {
        try {
          url = await onUpload(rawFile);
        } catch (error) {
          console.warn('Upload API échec → fallback base64 :', error);
          const { file: compressed } = await compressImageWithReport(rawFile, COMPRESSION_OPTS);
          url = await readAsDataUrl(compressed);
        }
      } else {
        url = await readAsDataUrl(file);
      }

      setPreviewUrl(url);
      onChange(url);
    } catch (error) {
      console.error('Upload error:', error);
      toast.error("Erreur lors de l'upload de l'image");
    } finally {
      setUploading(false);
    }
  };

  const handleUrlChange = (url: string) => {
    setPreviewUrl(url);
    onChange(url);
  };

  const clearImage = () => {
    setPreviewUrl('');
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor="image-upload">Image</Label>
      
      {/* Preview */}
      {previewUrl && (
        <div className="relative group">
          <img
            src={previewUrl.startsWith('data:') ? previewUrl : `http://localhost:8080${previewUrl.startsWith('/') ? previewUrl : '/' + previewUrl}`}
            alt="Preview"
            loading="lazy"
            decoding="async"
            className="w-full h-48 object-cover rounded-xl border border-border"
            onError={(e) => {
              console.error('Error loading image:', previewUrl);
              e.currentTarget.src = '';
              setPreviewUrl('');
            }}
          />
          <Button
            type="button"
            variant="destructive"
            size="sm"
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={clearImage}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      )}

      {/* URL Input */}
      <div className="flex gap-2">
        <Input
          id="image-upload"
          value={previewUrl}
          onChange={(e) => handleUrlChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1"
        />
        <Button
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading || optimizing}
          title={optimizing ? 'Optimisation…' : uploading ? 'Envoi…' : 'Importer une image'}
        >
          {uploading || optimizing ? (
            <div className="w-4 h-4 border-2 border-muted border-t-primary rounded-full animate-spin" />
          ) : (
            <Upload className="w-4 h-4" />
          )}
        </Button>
      </div>

      {/* File Input (caché) */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Instructions */}
      <p className="text-xs text-muted-foreground">
        Formats acceptés : JPG, PNG, WebP, GIF, SVG (max {MAX_INPUT_SIZE_MB} MB).
        Optimisation automatique en WebP, jusqu'à {COMPRESSION_OPTS.maxWidthOrHeight}px,
        ~{COMPRESSION_OPTS.maxSizeMB} MB, qualité{' '}
        {Math.round(COMPRESSION_OPTS.initialQuality * 100)} % — détails fins préservés.
        {optimizing && (
          <span className="block mt-1 text-primary">Optimisation en cours…</span>
        )}
      </p>
    </div>
  );
};

function readAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target?.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default ImageUpload;
