import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

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
  const [previewUrl, setPreviewUrl] = useState(value);

  // Synchroniser le previewUrl avec la prop value
  React.useEffect(() => {
    console.log('🔄 Syncing previewUrl with value:', value);
    setPreviewUrl(value);
  }, [value]);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Vérifier le type de fichier
    if (!file.type.startsWith('image/')) {
      alert('Veuillez sélectionner une image valide (JPG, PNG, GIF)');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('L\'image ne doit pas dépasser 5MB');
      return;
    }

    console.log('📁 File selected:', file.name, file.type, file.size);
    setUploading(true);
    
    try {
      let url: string;
      
      if (onUpload) {
        // Utiliser l'handler d'upload personnalisé
        try {
          console.log('🔧 Attempting API upload...');
          url = await onUpload(file);
          console.log('✅ API upload successful:', url);
        } catch (error) {
          console.warn('⚠️ Upload API failed, using base64 fallback:', error);
          // Fallback vers base64 si l'API échoue
          url = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
              const base64Url = e.target?.result as string;
              console.log('📸 Base64 fallback successful');
              resolve(base64Url);
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
          });
        }
      } else {
        // Upload par défaut (base64 pour le développement)
        console.log('🔧 Using default base64 upload...');
        url = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            const base64Url = e.target?.result as string;
            console.log('📸 Base64 upload successful');
            resolve(base64Url);
          };
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      }
      
      console.log('🖼️ Setting preview URL:', url);
      setPreviewUrl(url);
      onChange(url);
    } catch (error) {
      console.error('❌ Upload error:', error);
      alert('Erreur lors de l\'upload de l\'image');
    } finally {
      setUploading(false);
    }
  };

  const handleUrlChange = (url: string) => {
    console.log('🖼️ URL changed:', url);
    setPreviewUrl(url);
    onChange(url);
  };

  const clearImage = () => {
    console.log('🗑️ Clearing image');
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
            className="w-full h-48 object-cover rounded-md border"
            onError={(e) => {
              console.error('Error loading image:', previewUrl);
              e.currentTarget.src = '';
              setPreviewUrl('');
            }}
            onLoad={() => {
              console.log('Image loaded successfully:', previewUrl);
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
          disabled={uploading}
        >
          {uploading ? (
            <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
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
        Formats acceptés: JPG, PNG, GIF (max 5MB)
      </p>
    </div>
  );
};

export default ImageUpload;
